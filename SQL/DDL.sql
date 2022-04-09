
BEGIN;

CREATE TABLE StatCards(
    statCardID INTEGER PRIMARY KEY ,  --Using ROWID
    strength INTEGER NOT NULL,
    dexterity INTEGER NOT NULL,
    constitution INTEGER NOT NULL,
    intelligence INTEGER NOT NULL,
    wisdom INTEGER NOT NULL,
    charisma INTEGER NOT NULL
);

CREATE TABLE Monsters(
    monsterID TEXT PRIMARY KEY NOT NULL,
    size TEXT,
    type TEXT,
    subType TEXT,
    alignment TEXT,
    armorClass INTEGER DEFAULT 0 NOT NULL,
    hitPoints INTEGER NOT NULL,
    hitDice TEXT NOT NULL,
    languages TEXT NOT NULL,
    numAlternateForms INTEGER DEFAULT 0,
    statCardID INTEGER NOT NULL,
    challengeRating INTEGER NOT NULL,
    xpReward INTEGER NOT NULL,
    FOREIGN KEY (statCardID) REFERENCES StatCards(statCardID)
);

CREATE TABLE AlternateForms(
    monsterID TEXT NOT NULL,
    formMonsterID INTEGER,
    PRIMARY KEY (monsterID,formMonsterID),
    FOREIGN KEY (monsterID) REFERENCES Monsters(monsterID),
    FOREIGN KEY (formMonsterID) REFERENCES Monsters(monsterID)
);

CREATE TABLE AffectTypes(
    affectType TEXT PRIMARY KEY NOT NULL --Could be conditions or a damage type
);

CREATE TABLE Vulnerabilities(
    monsterID TEXT NOT NULL,
    affectType TEXT NOT NULL,
    PRIMARY KEY (monsterID,affectType),
    FOREIGN KEY (monsterID) REFERENCES Monsters(monsterID),
    FOREIGN KEY (affectType) REFERENCES AffectTypes(affectType)
);

CREATE TABLE Resistances(
    monsterID TEXT NOT NULL,
    affectType TEXT NOT NULL,
    PRIMARY KEY (monsterID,affectType),
    FOREIGN KEY (monsterID) REFERENCES Monsters(monsterID),
    FOREIGN KEY (affectType) REFERENCES AffectTypes(affectType)
);

CREATE TABLE Immunities(
    monsterID TEXT NOT NULL,
    affectType TEXT NOT NULL,
    PRIMARY KEY (monsterID,affectType),
    FOREIGN KEY (monsterID) REFERENCES Monsters(monsterID),
    FOREIGN KEY (affectType) REFERENCES AffectTypes(affectType)
);

CREATE TABLE Proficiencies(
    profID INTEGER PRIMARY KEY  --Using ROWID 
);

CREATE TABLE Senses(
    profID INTEGER PRIMARY KEY NOT NULL,
    sense TEXT NOT NULL,
    FOREIGN KEY (profID) REFERENCES Proficiencies(profID)
);

CREATE TABLE Skills(
    profID INTEGER PRIMARY KEY NOT NULL,
    skillName TEXT NOT NULL,
    FOREIGN KEY (profID) REFERENCES Proficiencies(profID)
);

CREATE TABLE PassiveSenses(
    profID INTEGER NOT NULL,
    monsterID TEXT NOT NULL,
    range TEXT,
    PRIMARY KEY (profID,monsterID),
    FOREIGN KEY (profID) REFERENCES Proficiencies(profID),
    FOREIGN KEY (monsterID) REFERENCES Monsters(monsterID),
    FOREIGN KEY (range) REFERENCES Distance(distance)
);

CREATE TABLE SkillProficiencies(
    profID INTEGER NOT NULL,
    monsterID TEXT NOT NULL,
    checkBonus INTEGER NOT NULL DEFAULT 0,
    passiveCheckBonus INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (profID,monsterID),
    FOREIGN KEY (profID) REFERENCES Proficiencies(profID),
    FOREIGN KEY (monsterID) REFERENCES Monsters(monsterID)
);

CREATE TABLE Distance(
    distance TEXT PRIMARY KEY NOT NULL,
    dUnit TEXT NOT NULL,
    dValue INTEGER NOT NULL
);

CREATE TABLE MoveSpeeds(
    distance TEXT NOT NULL,
    monsterID TEXT NOT NULL,
    moveType TEXT NOT NULL,
    PRIMARY KEY (distance,monsterID,moveType),
    FOREIGN KEY (distance) REFERENCES Distance(distance),
    FOREIGN KEY (monsterID) REFERENCES Monsters(monsterID)
);

CREATE TABLE Actions(
    actionID INTEGER PRIMARY KEY,  --Using ROWID
    actionName TEXT NOT NULL,
    actionDescription TEXT
);

CREATE TABLE Reactions(
    rID INTEGER PRIMARY KEY,  --Using ROWID
    rName TEXT NOT NULL,
    rDescription TEXT
);

CREATE TABLE LegendaryActions(
    laID INTEGER PRIMARY KEY,  --Using ROWID
    laName TEXT NOT NULL,
    laDescription TEXT
);

CREATE TABLE SpecialAbilities(
    saID INTEGER PRIMARY KEY,  --Using ROWID
    saName TEXT NOT NULL,
    saDescription TEXT
);

CREATE TABLE MonsterReactions (
    rID INTEGER NOT NULL,
    monsterID TEXT NOT NULL,
    PRIMARY KEY (rID,monsterID),
    FOREIGN KEY (rID) REFERENCES Reactions(rID),
    FOREIGN KEY (monsterID) REFERENCES Monsters(monsterID)
);

CREATE TABLE MonsterActions(
    actionID INTEGER NOT NULL,
    monsterID TEXT NOT NULL,
    PRIMARY KEY (actionID,monsterID),
    FOREIGN KEY (actionID) REFERENCES Actions(actionID),
    FOREIGN KEY (monsterID) REFERENCES Monsters(monsterID)
);

CREATE TABLE MonsterLA(
    laID INTEGER NOT NULL,
    monsterID TEXT NOT NULL,
    PRIMARY KEY (laID,monsterID),
    FOREIGN KEY (laID) REFERENCES LegendaryActions(laID),
    FOREIGN KEY (monsterID) REFERENCES Monsters(monsterID)
);

CREATE TABLE MonsterSA(
    saID INTEGER NOT NULL,
    monsterID TEXT NOT NULL,
    PRIMARY KEY (saID,monsterID),
    FOREIGN KEY (saID) REFERENCES SpecialAbilities(saID),
    FOREIGN KEY (monsterID) REFERENCES Monsters(monsterID)
);

COMMIT;