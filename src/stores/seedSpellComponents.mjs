import db from './Database.mjs'

let stmt = db.prepare("INSERT INTO SpellComponents(spellComponent) VALUES(?)");


function seedSpellComponents() {
    let values = [
        "Verbal",
        "Somantic",
        "A bit of bat fur",
        "Charcol"
    ]
    for(const v of values) {
        console.log(v);
        stmt.run(v);
    }
    stmt.finalize();
}

export default seedSpellComponents();