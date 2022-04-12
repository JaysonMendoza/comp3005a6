import DND5EDB from './Database.mjs';
import axios from 'axios';

const DND5EAPI = "https://www.dnd5eapi.co/api/";
const MONSTER_ENDPOINT = DND5EAPI+"Monsters/";

async function updateFromApi() {
    let mList = await apiGetMonsterList();
    let formList = new Map();
    console.log("This list has "+mList.length+" elements!");
    try {
        for(const mEntry of mList) {
            let currMonster = await axios.get(MONSTER_ENDPOINT+mEntry.index);
            let monsterID = await convertMonster(currMonster?.data,formList);
            console.log("Processing monsterID: ",monsterID);
            await convertAffectTypes(currMonster?.data?.damage_vulnerabilities,monsterID,"Vulnerabilities");
            await convertAffectTypes(currMonster?.data?.damage_resistances,monsterID,"Resistances");
            await convertAffectTypes(currMonster?.data?.damage_immunities,monsterID,"Immunities");
            await convertProficiencies(currMonster?.data?.proficiencies,monsterID);
            await convertSenses(currMonster?.data?.senses,monsterID);
            await convertActionTypes(currMonster?.data?.reactions,"r",monsterID,"Reactions","MonsterReactions");
            await convertActionTypes(currMonster?.data?.legendary_actions,"la",monsterID,"LegendaryActions","MonsterLA");
            await convertActionTypes(currMonster?.data?.special_abilities,"sa",monsterID,"SpecialAbilities","MonsterSA");
            await convertActionTypes(currMonster?.data?.actions,"action",monsterID,"Actions","MonsterActions");
        }
        for(const [monsterID,formMonsterID] of Object.entries(formList)) {
            
            let res = await DND5EDB.get("SELECT monsterID,formMonsterID FROM AlternateForms WHERE monsterID=? AND formMonsterID=?",monsterID,formMonsterID);
            if( !(res?.monsterID===monsterID && res?.formMonsterID===formMonsterID) ) {
                res = await DND5EDB.get("INSERT INTO AlternateForms(monsterID,formMonsterID) VALUES(?,?)",monsterID,formMonsterID);
                if(!isFinite(res?.lastID)) {
                    console.error("Failed to insert alternate form monsterID "+monsterID+", formMonsterID: "+formMonsterID);
                }
            }
        }
    }
    catch(error) {
        console.log("Failure: ",error);
    }
}

async function apiGetMonsterList() {
    try {
        const response = await axios.get(MONSTER_ENDPOINT);
        // console.log(response?.data);
        let list = response?.data?.results;
        console.log("Api Monster List Response has "+list.length+" monsters, api: "+MONSTER_ENDPOINT);
        if(list===undefined) {
            console.log("Failed to get list from monsters api");
            throw new Error("Failed to get list from monsters api");
        }
        else {
            return list;
        }
    }
    catch (error) {
        console.log("Error in api endpoint "+MONSTER_ENDPOINT);
        console.log(error);
        throw error;
    }
}


async function convertAffectTypes(affectTypeList,monsterID,table) {
    let list = [];

    for(let entry of affectTypeList) {
        let items = entry.split(",");
        for(let it of items) {
            it=it.trim();
            if(it.startsWith("and")) {
                it = it.substring(3);
                it=it.trim();
            }
            list.push(it.trim());
        }
    }

    for(let affect of list) {
        let res = await DND5EDB.get("SELECT affectType FROM AffectTypes WHERE affectType=?",affect)
        if(res?.affectType===undefined) {
            res = await DND5EDB.run("INSERT INTO AffectTypes(affectType) VALUES(?)",affect);
            if(!isFinite(res?.lastID)) {
                console.error("Failed to insert affect "+affect);
                continue;
            }
        }
    }

    const sqlTable = "SELECT monsterID,affectType FROM "+table+" WHERE monsterID=? AND affectType=?";
    const sqlInsert = "INSERT INTO "+table+"(monsterID,affectType) VALUES(?,?)";
    for(let affect of list) {
        
        let res = await DND5EDB.get(sqlTable,monsterID,affect);
        if(res?.affectType===undefined) {
            res = await DND5EDB.run(sqlInsert,monsterID,affect);
            if(!isFinite(res?.lastID)) {
                console.error("Failed to insert affect "+affect+" for monsterID "+monsterID);
                continue;
            }
        }
    }
}


async function convertSenses(senseObject,monsterID) {
    for(let key in senseObject) {
        if(isFinite(senseObject[key])) {
            // console.log("Skill: "+key+", Value: "+senseObject[key]);
            // console.log("outmap.get = ",outMap.get("senses"));
            let data={
                "$profID" : undefined,
                "$monsterID" : monsterID,
                "$skillName" : key.replace(/(^passive_)/g,"").trim().toLowerCase(),
                "$passiveCheckBonus" : senseObject[key]
            };
            
            
            //Find skill in SkillProficiencies if exists
            const sqlSkillExists = "SELECT profID, skillName FROM Skills WHERE skillName=?";
            let res = await DND5EDB.get(sqlSkillExists,data["$skillName"]);                     
            data["$profID"] = res?.profID;

            //Add skill if it doesn't exist
            if(data["$profID"]===undefined) {
                data["$profID"]= await DND5EDB.run("INSERT INTO Proficiencies(profID) VALUES(null)"); //this will generate a new ID
                data["$profID"]=data["$profID"]?.lastID;
                if(!isFinite(data["$profID"])) {
                    console.error("Failed to generate new proficiency ID");
                    continue;
                }
                
                res = await DND5EDB.run("INSERT INTO Skills(profID,skillName) VALUES(?,?)",data["$profID"],data["$skillName"]);
                res = res?.lastID;
                if(res===undefined) {
                    console.error("Failed insert new skill into db using profID: "+data["$profID"]);
                    continue;
                }
                               
            }
            
            //Now that we know skill exists, check if it appears in skill proficiencies table
            res = await DND5EDB.get("SELECT profID,monsterID,checkBonus,passiveCheckBonus FROM SkillProficiencies WHERE profID=? AND monsterID=?",data["$profID"],data["$monsterID"]);
            let passiveCheckBonus = res?.passiveCheckBonus;

            //If it exists, check the value to see if we need to update the record
            if(passiveCheckBonus===undefined) {
                //The record doesn't exist so add it    
                res= await DND5EDB.run("INSERT INTO SkillProficiencies(profID,monsterID,passiveCheckBonus) VALUES(?,?,?)",data["$profID"],data["$monsterID"],data["$passiveCheckBonus"]);
                res = res?.lastID;
                if(res===undefined) {
                    console.error("Failed insert new skill monster association into db using profID: "+data["$profID"]);
                    continue;
                }
            }
            else if(passiveCheckBonus!==data["$passiveCheckBonus"]) {
                res = await DND5EDB.run("UPDATE SkillProficiencies SET passiveCheckBonus=? WHERE profID=? AND monsterID=?",data["$passiveCheckBonus"],data["$profID"],data["$monsterID"]);
                res = res?.lastID;
                if(res===undefined) {
                    console.error("Failed to update skill passiveCheckBonus using profID: "+data["$profID"]+", monsterID: "+data["$monsterID"]);
                    continue;
                }
            }
        }
        else {
            let data = {
                "$profID" : undefined,
                "$monsterID" : monsterID,
                "$sense" : key,
                "$dUnit" : 0,
                "$dValue" : 0,
                "$range" : null
            };
            // console.log("Sense: "+key+", Range: "+senseObject[key]);
            let vals = senseObject[key].trim().slice().split(" ");
            if(vals.length>=2) {
                data["$dUnit"]=vals[1].toLowerCase().replace(/[^a-z]*/g,"").trim();
                data["$dValue"]=parseInt(vals[0]);
                data["$range"] = ""+data["$dValue"]+" "+data["$dUnit"];   
            }
            else {
                console.error("No distnace found!",vals);
            }

            //Find PassiveSenses to see if record exists
            let res = await DND5EDB.get("SELECT profID,sense FROM Senses WHERE sense=?",data["$sense"]);
            data["$profID"] = res?.profID;
            
            //If it didn't exist add it
            if(data["$profID"]===undefined) {
                data["$profID"]= await DND5EDB.run("INSERT INTO Proficiencies(profID) VALUES(null)"); //this will generate a new ID
                data["$profID"]=data["$profID"]?.lastID;
                if(!isFinite(data["$profID"])) {
                    console.error("Failed to generate new proficiency ID");
                    continue;
                }

                res = await DND5EDB.run("INSERT INTO Senses(profID,sense) VALUES(?,?)",data["$profID"],data["$sense"]);
                if(!isFinite(res?.lastID)) {
                    console.error("Failed to add sense ",data);
                    continue;
                }
            }

            //If we have a valid range check if range exists as a distance and add if necessary
            if(data["$range"]!==null && data["$range"])
            {
                res = await DND5EDB.get("SELECT distance FROM Distance WHERE distance=?",data["$range"]);
                if(res?.distance===undefined) {
                    res = await DND5EDB.run("INSERT INTO Distance (distance,dUnit,dValue) VALUES (?,?,?)",data["$range"],data["$dUnit"],data["$dValue"]);
                    if(!isFinite(res?.lastID)) {
                        console.error("Failed to insert distance ",data);
                        continue;
                    }
                }
            }

            //Check to see if monster and sense appear in PassiveSenses
            res = await DND5EDB.get("SELECT profID,monsterID,range FROM PassiveSenses WHERE profID=? AND monsterID=?",data["$profID"],data["$monsterID"]);
            let profID = res?.profID;
            if(profID===undefined) {
                res = await DND5EDB.run("INSERT INTO PassiveSenses(profID,monsterID,range) VALUES(?,?,?)",data["$profID"],data["$monsterID"],data["$range"]);
                if(!isFinite(res?.lastID)) {
                    console.error("Failed to insert PasiveSense ",data,res);
                    continue;
                }
            }
            else {
                let range = res?.range;
                if(range!==data["$range"]) {
                    res = await DND5EDB.run("UPDATE PassiveSenses SET range=? WHERE profID=? AND monsterID=?",data["$range"],data["$profID"],data["$monsterID"]);
                    if(!isFinite(res?.lastID)) {
                        console.error("Failed to Update PasiveSense ",data,res);
                        continue;
                    }
                }
            }
        }
    }
}

async function convertProficiencies(proficienciesArr,monsterID) {
    for(let p of proficienciesArr) {
        let val = p?.value;
        if(val===undefined) {
            console.error("Proficiency has undefined value: ",p);
            return;
        }
        let prof = p?.proficiency?.index;
        if(prof ===undefined) {
            console.error("Proficiency has undefined index: ",p);
            return;
        }
        // console.log("prof before conv: ",prof,val);
        prof = prof.replace(/(^saving-throw-|^skill-)/g,"").toLowerCase();


        //Find skill in SkillProficiencies if exists
        const sqlSkillExists = "SELECT profID, skillName FROM Skills WHERE skillName=?";
        let res = await DND5EDB.get(sqlSkillExists,prof);                     
        let profID = res?.profID;

        //Add skill if it doesn't exist
        if(profID===undefined) {
            profID= await DND5EDB.run("INSERT INTO Proficiencies(profID) VALUES(null)"); //this will generate a new ID
            profID=profID.lastID;
            if(!isFinite(profID)) {
                console.error("Failed to generate new proficiency ID");
                continue;
            }
            
            res = await DND5EDB.run("INSERT INTO Skills(profID,skillName) VALUES(?,?)",profID,prof);
            res = res?.lastID;
            if(res===undefined) {
                console.error("Failed insert new skill into db using profID: "+profID);
                continue;
            }
                            
        }
        
        //Now that we know skill exists, check if it appears in skill proficiencies table
        res = await DND5EDB.get("SELECT profID,monsterID,checkBonus,checkBonus FROM SkillProficiencies WHERE profID=? AND monsterID=?",profID,monsterID);
        let checkBonus = res?.checkBonus;

        //If it exists, check the value to see if we need to update the record
        if(checkBonus===undefined) {
            //The record doesn't exist so add it    
            res= await DND5EDB.run("INSERT INTO SkillProficiencies(profID,monsterID,checkBonus) VALUES(?,?,?)",profID,monsterID,val);
            res = res?.lastID;
            if(res===undefined) {
                console.error("Failed insert new skill monster association into db using profID: "+profID);
                continue;
            }
        }
        else if(checkBonus!==val) {
            res = await DND5EDB.run("UPDATE SkillProficiencies SET checkBonus=? WHERE profID=? AND monsterID=?",val,profID,monsterID);
            res = res?.lastID;
            if(res===undefined) {
                console.error("Failed to update skill passiveCheckBonus using profID: "+prof+", monsterID: "+monsterID+", Value: "+val);
                continue;
            }
        }
    }
}

async function convertActionTypes(actionArr,prefix,monsterID,table,nTonTable) {
    if(actionArr===undefined || monsterID===undefined || table==="") {
        return;
    }
    let name = "$"+prefix+"Name";
    let desc = "$"+prefix+"Description";
    for(let action of actionArr) {
        if( !action.hasOwnProperty("name") && !action.hasOwnProperty("desc")) {
            console.error("Action is malformed: ",action);
            continue;
        }
        let data= {
                [name] : action.name,
                [desc] : action.desc
        };

        const sqlFind = "SELECT "+prefix+"Name FROM "+table+" WHERE "+prefix+"name="+name+" AND "+prefix+"Description="+desc;
        const sqlAdd = "INSERT INTO "+table+"("+prefix+"Name,"+prefix+"Description) VALUES("+name+","+desc+")";
        const sqlLink = "INSERT INTO "+nTonTable+"("+prefix+"ID,monsterID) VALUES($"+prefix+"ID,$monsterID)";
        let qRes = await DND5EDB.get(sqlFind,data);
        let id = qRes?.[prefix+"ID"];
        if(id===undefined) {
            let res = await DND5EDB.run(sqlAdd,data);
            id = res?.lastID;
            if(isFinite(id)) {
                let nTonData = {
                    ["$"+prefix+"ID"] : id,
                    "$monsterID" : monsterID
                }
                res = await DND5EDB.run(sqlLink,nTonData);
            }
        }
    }
}

async function convertMonster(monsterObj,formMap) {
    if(monsterObj===undefined || monsterObj===null) {
        console.error("Corrupt monster data: ",monsterObj);
    }
    let monster = {
        "$monsterID" : monsterObj?.index,
        "$name" :  monsterObj?.name,
        "$size" : monsterObj?.size,
        "$type" : monsterObj?.type,
        "$subType" : monsterObj?.subtype,
        "$alignment" : monsterObj?.alignment,
        "$armorClass" : monsterObj?.armor_class,
        "$hitPoints" : monsterObj?.hit_points,
        "$hitDice" : monsterObj?.hit_dice,
        "$languages" : monsterObj?.languages,
        "$numAlternateForms" : monsterObj?.forms?.length,
        "$statCardID" : await convertStatCard(monsterObj),
        "$challengeRating" : parseInt(monsterObj?.challenge_rating),
        "$xpReward" : parseInt(monsterObj?.xp)
    };
    
    if(monster["$challengeRating"]===undefined || monster["$xpReward"]===undefined) {
        console.error("Monster CR and xp cannot be undefined",monster["$challengeRating"],monster["$xpReward"]);
        return;
    }

    if(monster["$subType"]===undefined){
        monster["$subType"]="";
    }

    for(let key in monster) {
        if(monster[key]===undefined && key!="$numAlternateForms") {
            console.error("Monster attribute "+key+" cannot be undefined!");
            return;
        }
    }
    
    //Validate Forms
    if(monster["$numAlternateForms"]===undefined) {
        monster["$numAlternateForms"]=0;
    }
    else {
        for(let f of monsterObj?.forms) {
            formMap.set(monster["$monsterID"],f?.index);
        }
    }

    const sqlExists="SELECT monsterID FROM Monsters WHERE monsterID=?";
    const sqlAdd="INSERT INTO Monsters(monsterID,name,size,type,subType,alignment,armorClass,hitPoints,hitDice,languages,numAlternateForms,statCardID,challengeRating,xpReward) VALUES($monsterID,$name,$size,$type,$subType,$alignment,$armorClass,$hitPoints,$hitDice,$languages,$numAlternateForms,$statCardID,$challengeRating,$xpReward)";

    let monsterID = await DND5EDB.get(sqlExists,monster["$monsterID"]);
    monsterID=monsterID?.monsterID;
    if(monsterID===undefined) {
        let res = await DND5EDB.run(sqlAdd,monster);
        if(res!==undefined) {
            monsterID=monster["$monsterID"];
        }
    }
    return monsterID;
}

// function convertAlternateForms(monsterObj) {
//     if(monsterObj===undefined) {
//         console.error("convertChallengeRating: monsterObj cannot be undefined");
//     }

//     const sqlExists()
// }

// async function convertChallengeRating(monsterObj) {
//     if(monsterObj===undefined) {
//         console.error("convertChallengeRating: monsterObj cannot be undefined");
//     }
//     const sqlExists = "SELECT CR FROM ChallengeRatings WHERE CR=$CR AND XP=$XP";
//     const sqlAdd = "INSERT INTO ChallengeRatings(CR,XP) VALUES($CR,$XP)";
//     let data = {
//         "$CR" : parseInt(monsterObj?.challenge_rating),
//         "$XP" : parseInt(monsterObj?.xp)
//     };

//     for(let key in data) {
//         if(isNaN(data[key])) {
//             console.error("convertChallengeRating: Key "+key+" cannot be NaN.",data);
//             return;
//         }
//     }

//     let CR = await DND5EDB.get(sqlExists,data);
//     console.log(CR);
//     CR = CR?.CR;
//     if(CR===undefined) {
//         console.log("Not found, adding to CR",data);
//         let res = await DND5EDB.run(sqlAdd,data);
//         console.log(res);
//         CR=res?.lastID;
//     }
//     console.log("CR="+CR);
//     return CR;

// }

async function convertStatCard(monsterObj) {
    const sqlExists = "SELECT statCardID FROM StatCards WHERE strength=$strength AND dexterity=$dexterity AND constitution=$constitution AND intelligence=$intelligence AND wisdom=$wisdom AND charisma=$charisma";
    const sqlAdd = "INSERT INTO StatCards(strength,dexterity,constitution,intelligence,wisdom,charisma) VALUES($strength,$dexterity,$constitution,$intelligence,$wisdom,$charisma)";
    let statCardID = undefined;
    if(monsterObj===undefined || monsterObj===null) {
        console.error("Corrupt monster data: ",monsterObj);
    }
    let statCard = {
        "$strength": monsterObj?.strength,
        "$dexterity": monsterObj?.dexterity,
        "$constitution": monsterObj?.constitution,
        "$intelligence": monsterObj?.intelligence,
        "$wisdom": monsterObj?.wisdom,
        "$charisma": monsterObj?.charisma
    };

    for(let key in statCard) {
        if(key===undefined) {
            console.error("StatCard key had undefined value",key);
            return;
        }
    }

    //Does it exist?
    statCardID = await DND5EDB.get(sqlExists,statCard)
    statCardID = statCardID?.statCardID;
    if(!isFinite(statCardID)) {
        let res = await DND5EDB.run(sqlAdd,statCard);
        statCardID=res?.lastID;
    }

    if(!isFinite(statCardID))
    {
        console.error("Failed to add statCard",statCard);
    }
    return statCardID
}

updateFromApi();

