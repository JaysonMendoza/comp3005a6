
--Time
INSERT INTO Time(time,tUnit,tValue) VALUES("1 ACTION","ACTION","1");
INSERT INTO Time(time,tUnit,tValue) VALUES("1 ROUND","ACTION","1");
INSERT INTO Time(time,tUnit,tValue) VALUES("1 DAY","DAY","1");
INSERT INTO Time(time,tUnit,tValue) VALUES("1 HOUR","HOUR","1");
INSERT INTO Time(time,tUnit,tValue) VALUES("1 MINUTE","MINUTE","1");


--SpellComponents
INSERT INTO SpellComponents(spellComponent) VALUES("Verbal");
INSERT INTO SpellComponents(spellComponent) VALUES("Somantic");
INSERT INTO SpellComponents(spellComponent) VALUES("A bit of bat fur");
INSERT INTO SpellComponents(spellComponent) VALUES("Charcol");

--SpellSchools
INSERT INTO SpellSchools(magicSchool,spellLevel) VALUES ("CONJURATION",2);


--Spells
BEGIN;
INSERT INTO Spells (spellName,castingTime,magicSchool,spellLevel,spellDescription) VALUES ("Find Familiar","1 HOUR","CONJURATION",2,"You gain the service of a familiar, a spirit that takes an animal form you choose: bat, cat, crab, frog (toad), hawk, lizard, octopus, owl, poisonous snake, fish (quipper), rat, raven, sea horse, spider, or weasel. Appearing in an unoccupied space within range, the familiar has the statistics of the chosen form, though it is a celestial, fey, or fiend (your choice) instead of a beast.
Your familiar acts independently of you, but it always obeys your commands. In combat, it rolls its own initiative and acts on its own turn. A familiar can’t attack, but it can take other actions as normal.
When the familiar drops to 0 hit points, it disappears, leaving behind no physical form. It reappears after you cast this spell again
While your familiar is within 100 feet of you, you can communicate with it telepathically. Additionally, as an action, you can see through your familiar’s eyes and hear what it hears until the start of your next turn, gaining the benefits of any special senses that the familiar has. During this time, you are deaf and blind with regard to your own senses.
As an action, you can temporarily dismiss your familiar. It disappears into a pocket dimension where it awaits your summons. Alternatively, you can dismiss it forever. As an action while it is temporarily dismissed, you can cause it to reappear in any unoccupied space within 30 feet of you.
You can’t have more than one familiar at a time. If you cast this spell while you already have a familiar, you instead cause it to adopt a new form. Choose one of the forms from the above list. Your familiar transforms into the chosen creature.
Finally, when you cast a spell with a range of touch, your familiar can deliver the spell as if it had cast the spell. Your familiar must be within 100 feet of you, and it must use its reaction to deliver the spell when you cast it. If the spell requires an attack roll, you use your attack modifier for the roll.");
DECLARE @spellID INTEGER;
SET @spellID = last_insert_rowid();
--SpellsHaveComponents
INSERT INTO SpellsHaveComponents (spellID,spellComponent) VALUES (@spellID,"Verbal");
INSERT INTO SpellsHaveComponents (spellID,spellComponent) VALUES (@spellID,"Somantic");
INSERT INTO SpellsHaveComponents (spellID,spellComponent,goldCost) VALUES (@spellID,"Charcol",10);

COMMIT;