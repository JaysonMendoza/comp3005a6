DROP TABLE IF EXISTS Spells;
CREATE TABLE Spells (
    spellID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    spellName TEXT NOT NULL,
    castingTime TEXT NOT NULL,
    magicSchool TEXT NOT NULL,
    spellLevel INTEGER NOT NULL,
    spellDescription TEXT,
    FOREIGN KEY (castingTime) REFERENCES Time(time),
    FOREIGN KEY (magicSchool) REFERENCES SpellSchools(magicSchool),
    FOREIGN KEY (spellLevel) REFERENCES SpellSchools(spellLevel)
);

DROP TABLE IF EXISTS Time;
CREATE TABLE Time (
    time TEXT PRIMARY KEY NOT NULL,
    tUnit TEXT NOT NULL,
    tValue INTEGER NOT NULL
);

DROP TABLE IF EXISTS SpellSchools;
CREATE TABLE SpellSchools (
    magicSchool TEXT NOT NULL,
    spellLevel INTEGER NOT NULL
);

DROP TABLE IF EXISTS SpellComponents;
CREATE TABLE SpellComponents (
    spellComponent TEXT PRIMARY KEY NOT NULL
);

DROP TABLE IF EXISTS SpellsHaveComponents;
CREATE TABLE SpellsHaveComponents (
    spellID INTEGER NOT NULL,
    spellComponent TEXT NOT NULL,
    goldCost REAL DEFAULT 0,
    PRIMARY KEY (spellID,spellComponent),
    FOREIGN KEY (spellID) REFERENCES Spells(spellID),
    FOREIGN KEY (spellComponent) REFERENCES SpellComponents(spellComponent)
);