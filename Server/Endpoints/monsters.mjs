import express from 'express';
import DND5EDB from '../DB/Database.mjs'
const monsterRouter = express.Router();

/**
 * R3.3 [2 marks] Demonstrate one of the primary use-case queries of your
 * database application. The query should be performed through whatever
 * user-interface you have created. 
 * 
 * See a list of all monsters and an overview of key attributes.
 * 
 */
monsterRouter.get("/all", async (req,res)=> {
    const sql = "SELECT  monsterID,name,size,type,subType,alignment,armorClass,hitPoints,hitDice,languages,numAlternateForms,challengeRating,xpReward,strength,dexterity,constitution,intelligence,wisdom,charisma FROM Monsters NATURAL JOIN StatCards";
    let data = await DND5EDB.all(sql);
    let msgOut = {
        "sqlQuery" : sql,
        "data" : data
    }
    console.log(msgOut);
    res.status(200).send(msgOut);
});


/**
 * R3.4 [2 marks] Demonstrate a second important use-case query of your
 * database application. The query should be performed through whatever
 * user-interface you have created
 * 
 * Find all Actions ordered by the monsters challenge Rating then by attackName.
 * 
 * This would be used by game masters for creating new monsters to get an idea of the power level 
 * monsters at a specific challenge rating may have by sample. 
 */
monsterRouter.get("/R3-4", async (req,res)=> {
    const sql = "SELECT challengeRating,name,actionName,actionDescription FROM Monsters NATURAL JOIN MonsterActions NATURAL JOIN Actions ORDER BY challengeRating,name";
    let data = await DND5EDB.all(sql);
    let msgOut = {
        "sqlQuery" : sql,
        "data" : data
    }
    console.log(msgOut);
    res.status(200).send(msgOut);
});

/**
 * R3.5 [2 marks] Demonstrate a query that involves an N:N relationship in
 * your data. 
 * 
 * This will bring up all Monster Attributes which includes many N to N Relationships
 */
monsterRouter.get("/:monsterID", async (req,res)=> {
    let monsterID = req.params?.monsterID;
    console.log("request recieved for monster: ",monsterID);
    const sqlActions = "SELECT  actionName,actionDescription FROM Monsters NATURAL JOIN MonsterActions NATURAL JOIN Actions WHERE monsterID=?";
    const sqlLA = "SELECT  laName,laDescription FROM Monsters NATURAL JOIN MonsterLA NATURAL JOIN LegendaryActions WHERE monsterID=?";
    const sqlSA = "SELECT  saName,saDescription FROM Monsters NATURAL JOIN MonsterSA NATURAL JOIN SpecialAbilities WHERE monsterID=?";
    const sqlReactions = "SELECT  rName,rDescription FROM Monsters NATURAL JOIN MonsterReactions NATURAL JOIN Reactions WHERE monsterID=?";
    const sqlMoveSpeeds = "SELECT  moveType,distance FROM Monsters NATURAL JOIN moveSpeeds WHERE monsterID=?";
    const sqlSenses = "SELECT  sense,range FROM Monsters NATURAL JOIN PassiveSenses NATURAL JOIN Senses WHERE monsterID=?";
    const sqlSkills = "SELECT  skillName,checkBonus,passiveCheckBonus FROM Monsters NATURAL JOIN SkillProficiencies NATURAL JOIN Skills WHERE monsterID=?";
    const sqlVulnerabilities = "SELECT  affectType FROM Monsters NATURAL JOIN Vulnerabilities WHERE monsterID=?";
    const sqlResistances = "SELECT  affectType FROM Monsters NATURAL JOIN Resistances WHERE monsterID=?";
    const sqlImmunities = "SELECT  affectType FROM Monsters NATURAL JOIN Immunities WHERE monsterID=?";
    const sqlAltForms = "SELECT Monsters.name AS name FROM AlternateForms JOIN Monsters ON AlternateForms.formMonsterID=Monsters.monsterID WHERE Monsters.monsterID=?";
    let data = {};
    data.actions = await DND5EDB.all(sqlActions,monsterID);
    data.la = await DND5EDB.all(sqlLA,monsterID);
    data.sa = await DND5EDB.all(sqlSA,monsterID);
    data.reactions = await DND5EDB.all(sqlReactions,monsterID);
    data.moveSpeeds = await DND5EDB.all(sqlMoveSpeeds,monsterID);
    data.senses = await DND5EDB.all(sqlSenses,monsterID);
    data.skills = await DND5EDB.all(sqlSkills,monsterID);
    data.vulnerabilities = await DND5EDB.all(sqlVulnerabilities,monsterID);
    data.resistances = await DND5EDB.all(sqlResistances,monsterID);
    data.immunities = await DND5EDB.all(sqlImmunities,monsterID);
    data.altForms = await DND5EDB.all(sqlAltForms,monsterID);
    let sql = sqlActions+";\n"+sqlLA+";\n"+sqlSA+";\n"+sqlReactions+";\n"+sqlMoveSpeeds+";\n"+sqlSenses+";\n"+sqlSkills+";\n"+sqlVulnerabilities+";\n"+sqlResistances+";\n"+sqlImmunities+";\n"+sqlAltForms;
    let msgOut = {
        "sqlQuery" : sql,
        "data" : data
    }
    console.log(msgOut);
    res.status(200).send(msgOut);
});

/**
 * R3.6 [2 marks] Demonstrate a query that involves a secondary
 * refinement, or query based on the results of the first query. 
 * 
 * This is spellcasting Legendary monsters.
 * 
 * This selects all monsters that have the spellcasting special ability and also have at least one legendary action
 */
monsterRouter.get("/R3-6", async (req,res)=> {
    const sql = "SELECT monsterID,name,size,type,alignment,armorClass,hitPoints,hitDice,challengeRating,xpReward,strength,dexterity,constitution,intelligence,wisdom,charisma, saDescription FROM Monsters NATURAL JOIN MonsterSA NATURAL JOIN StatCards NATURAL JOIN SpecialAbilities WHERE saName LIKE 'spellcasting' AND monsterID IN (SELECT monsterID FROM Monsters NATURAL JOIN MonsterLA GROUP BY monsterID)";
    let data = await DND5EDB.all(sql);
    let msgOut = {
        "sqlQuery" : sql,
        "data" : data
    }
    console.log(msgOut);
    res.status(200).send(msgOut);
});

export default monsterRouter;