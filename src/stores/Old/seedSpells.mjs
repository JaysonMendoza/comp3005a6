import db from './Database.mjs'
import axios from 'axios'

let stmt = db.prepare("INSERT INTO SpellComponents(spellComponent) VALUES(?)");
let stmtCountTimeMatches = db.prepare("SELECT COUNT(time) AS 'numTime' FROM Time WHERE time=?");
let stmntAddTime = db.prepare("INSERT INTO Time(time,tUnit,tValue) VALUES($time,$tUnit,$tValue)");
const DND5EAPI = "https://www.dnd5eapi.co/api/";
const SPELL_ENDPOINT = DND5EAPI+"spells/";


async function updateFromApi() {
    let rcList = await dnd5eAPIGetSpellList();
    console.log("This list has "+rcList.length+" elements!");
    try {
        for(const sRes of rcList) {
            let result = await dnd5EAPIGetSpell(sRes);
            let timeKey = await desearlizeTime(result.casting_time);
            console.log(sRes.name+" Success for timeKey "+timeKey);
        }
    }
    catch(error) {
        console.log("Failure: ",error);
    }
}

async function dnd5eAPIGetSpellList() {
    try {
        const response = await axios.get(SPELL_ENDPOINT);
        // console.log(response?.data);
        let list = response?.data?.results;
        console.log("Api Spell List Response has "+list.length+" spells, api: "+SPELL_ENDPOINT);
        if(list===undefined) {
            console.log("Failed to get list from spells api");
            throw new Error("Failed to get list from spells api");
        }
        else {
            return list;
        }
    }
    catch (error) {
        console.log("Error in api endpoint "+DND5EAPI+"spells/");
        console.log(error);
        throw error;
    }
}

async function dnd5EAPIGetSpell(spellItem) {
    const endpoint = SPELL_ENDPOINT+spellItem.index;
    console.log("Fetching endpoint "+endpoint);
    let spell = undefined;
    try {
        let result = await axios.get(endpoint);
        spell = result?.data;
        if(spell===undefined) {
            throw new Error("Spell endpoint returned an invalid result "+result+"\n Endpoint: "+endpoint);
        }
        return spell;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

async function deSearalizeSpellComponents(spellComponent) {
    if(spellComponent===null || spellComponent===undefined) {
        throw new Error("Invalid spell Component");
    }
}

async function desearlizeTime(time) {
    if(time===null || time===undefined) {
        throw new Error("Invalid time");
    }
    const asyncResult = new Promise( (resolve,reject) => {
        console.log(time.toUpperCase());
        stmtCountTimeMatches.get(time.toUpperCase(),(error,row) =>
            {
                if(error) {
                   reject("Time query had an error"+error);
                }
    
                const numTime = row?.numTime;
                if(numTime===1) {
                    console.log("Found a matching Time");
                    resolve(time.toUpperCase());
                }
                else if(numTime===0) {
                    console.log("No matching time not found, adding to db");
                    let newTime = {
                        $time : "",
                        $tUnit : "",
                        $tValue : 0
                    }
    
                    //parse the given text to find values
                    //We will split the string since its format should be tValue tUnit
                    let strings = time.split(" ");
                    if(strings.length!==2) {
                        reject("The castingTime was malformed "+time);
                    }
                    
                    newTime.$tValue = parseInt(strings[0]); //This should return only the number portion, that  is the prefix to the tUnit
                    if(isNaN(newTime.$tValue)) {
                        reject("The castingTime was malformed "+time);
                    }
                    
                    newTime.$tUnit=strings[1];
                    if(newTime.$tUnit===undefined || newTime.$tUnit===null || newTime.$tUnit.length<1) {
                        reject("The castingTime was malformed "+time);
                    }
    
                    newTime.$time=time.trim().toUpperCase();
                    console.log("Adding new Time\n", newTime);
                    stmntAddTime.run(newTime,(err2,res) => {
                        if(err2) {
                            reject("Failed to add new time\n",err2);
                        }
                        console.log("Successfully added rowID ",res?.lastID);
                        let key = res?.lastID;
                        if(key===undefined) {
                            reject("Time was added but key had unexpected key result.")
                        }
                        resolve(key);
                    });
                }
                else {
                    reject("The query to see if the time already exists had an unexpected result");
                }
            }
        )

    })

    return asyncResult;
    //Does this already exist

}




function seedSpellComponents() {
    let values = [
        {
            "spellID" : null,
            "name" : "Find Familiar", //spellName
            "desc" : ""
        }

    ]
    for(const v of values) {
        console.log(v);
        stmt.run(v);
    }
    stmt.finalize();
}

// export default seedSpellComponents();

updateFromApi();

// {
//     _id: '62475d311c1ec99a1e0cb351',
//     index: 'acid-arrow',
//     name: 'Acid Arrow',
//     desc: [
//       'A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.'
//     ],
//     higher_level: [
//       'When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd.'
//     ],
//     range: '90 feet',
//     components: [ 'V', 'S', 'M' ],
//     material: "Powdered rhubarb leaf and an adder's stomach.",
//     ritual: false,
//     duration: 'Instantaneous',
//     concentration: false,
//     casting_time: '1 action',
//     level: 2,
//     attack_type: 'ranged',
//     damage: {
//       damage_type: { index: 'acid', name: 'Acid', url: '/api/damage-types/acid' },
//       damage_at_slot_level: {
//         '2': '4d4',
//         '3': '5d4',
//         '4': '6d4',
//         '5': '7d4',
//         '6': '8d4',
//         '7': '9d4',
//         '8': '10d4',
//         '9': '11d4'
//       }
//     },
//     school: {
//       index: 'evocation',
//       name: 'Evocation',
//       url: '/api/magic-schools/evocation'
//     },
//     classes: [ { index: 'wizard', name: 'Wizard', url: '/api/classes/wizard' } ],
//     subclasses: [
//       { index: 'lore', name: 'Lore', url: '/api/subclasses/lore' },
//       { index: 'land', name: 'Land', url: '/api/subclasses/land' }
//     ],
//     url: '/api/spells/acid-arrow'
//   }

{
    "index": "aboleth",
    "name": "Aboleth",
    "url": "/api/monsters/aboleth",
    "actions": [
      {
        "attacks": [],
        "damage": [],
        "desc": "The aboleth makes three tentacle attacks.",
        "name": "Multiattack",
        "options": {
          "choose": 1,
          "from": [
            {
              "0": {
                "count": 3,
                "name": "Tentacle",
                "type": "melee"
              }
            }
          ]
        }
      },
      {
        "attack_bonus": 9,
        "attacks": [],
        "damage": [
          {
            "damage_dice": "2d6+5",
            "damage_type": {
              "index": "bludgeoning",
              "name": "Bludgeoning",
              "url": "/api/damage-types/bludgeoning"
            }
          },
          {
            "damage_dice": "1d12",
            "damage_type": {
              "index": "acid",
              "name": "Acid",
              "url": "/api/damage-types/acid"
            }
          }
        ],
        "dc": {
          "dc_type": {
            "index": "con",
            "name": "CON",
            "url": "/api/ability-scores/con"
          },
          "dc_value": 14,
          "success_type": "none"
        },
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature's skin becomes translucent and slimy, the creature can't regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.",
        "name": "Tentacle"
      },
      {
        "attack_bonus": 9,
        "attacks": [],
        "damage": [
          {
            "damage_dice": "3d6+5",
            "damage_type": {
              "index": "bludgeoning",
              "name": "Bludgeoning",
              "url": "/api/damage-types/bludgeoning"
            }
          }
        ],
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft. one target. Hit: 15 (3d6 + 5) bludgeoning damage.",
        "name": "Tail"
      },
      {
        "attacks": [],
        "damage": [],
        "dc": {
          "dc_type": {
            "index": "wis",
            "name": "WIS",
            "url": "/api/ability-scores/wis"
          },
          "dc_value": 14,
          "success_type": "none"
        },
        "desc": "The aboleth targets one creature it can see within 30 ft. of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth's control and can't take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.\nWhenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw when it is at least 1 mile away from the aboleth.",
        "name": "Enslave",
        "usage": {
          "times": 3,
          "type": "per day"
        }
      }
    ],
    "alignment": "lawful evil",
    "armor_class": 17,
    "challenge_rating": 10,
    "charisma": 18,
    "condition_immunities": [],
    "constitution": 15,
    "damage_immunities": [],
    "damage_resistances": [],
    "damage_vulnerabilities": [],
    "dexterity": 9,
    "forms": [],
    "hit_dice": "18d10",
    "hit_points": 135,
    "intelligence": 18,
    "languages": "Deep Speech, telepathy 120 ft.",
    "legendary_actions": [
      {
        "damage": [],
        "desc": "The aboleth makes a Wisdom (Perception) check.",
        "name": "Detect"
      },
      {
        "damage": [],
        "desc": "The aboleth makes one tail attack.",
        "name": "Tail Swipe"
      },
      {
        "attack_bonus": 0,
        "damage": [
          {
            "damage_dice": "3d6",
            "damage_type": {
              "index": "psychic",
              "name": "Psychic",
              "url": "/api/damage-types/psychic"
            }
          }
        ],
        "desc": "One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.",
        "name": "Psychic Drain (Costs 2 Actions)"
      }
    ],
    "proficiencies": [
      {
        "proficiency": {
          "index": "saving-throw-con",
          "name": "Saving Throw: CON",
          "url": "/api/proficiencies/saving-throw-con"
        },
        "value": 6
      },
      {
        "proficiency": {
          "index": "saving-throw-int",
          "name": "Saving Throw: INT",
          "url": "/api/proficiencies/saving-throw-int"
        },
        "value": 8
      },
      {
        "proficiency": {
          "index": "saving-throw-wis",
          "name": "Saving Throw: WIS",
          "url": "/api/proficiencies/saving-throw-wis"
        },
        "value": 6
      },
      {
        "proficiency": {
          "index": "skill-history",
          "name": "Skill: History",
          "url": "/api/proficiencies/skill-history"
        },
        "value": 12
      },
      {
        "proficiency": {
          "index": "skill-perception",
          "name": "Skill: Perception",
          "url": "/api/proficiencies/skill-perception"
        },
        "value": 10
      }
    ],
    "reactions": [],
    "senses": {
      "darkvision": "120 ft.",
      "passive_perception": 20
    },
    "size": "Large",
    "special_abilities": [
      {
        "damage": [],
        "desc": "The aboleth can breathe air and water.",
        "name": "Amphibious"
      },
      {
        "damage": [],
        "dc": {
          "dc_type": {
            "index": "con",
            "name": "CON",
            "url": "/api/ability-scores/con"
          },
          "dc_value": 14,
          "success_type": "none"
        },
        "desc": "While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 ft. of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.",
        "name": "Mucous Cloud"
      },
      {
        "damage": [],
        "desc": "If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature.",
        "name": "Probing Telepathy"
      }
    ],
    "speed": {
      "swim": "40 ft.",
      "walk": "10 ft."
    },
    "strength": 21,
    "subtype": null,
    "type": "aberration",
    "wisdom": 15,
    "xp": 5900
  }