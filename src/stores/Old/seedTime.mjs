import db from './Database.mjs'

let stmt = db.prepare("INSERT INTO Time(time,tUnit,tValue) VALUES(?,?,?)");


function seedTime() {
    let values = [
        {time :"1 ACTION", tUnit :"ACTION", tValue: 1},
        {time : "1 ROUND", tUnit : "ROUND", tValue :1},
        {time : "1 DAY", tUnit : "DAY", tValue :1},
        {time : "1 HOUR", tUnit : "HOUR", tValue :1},
        {time : "1 MINUTE", tUnit : "MINUTE", tValue :1},
    ]
    for(const v of values) {
        console.log(v["time"],v["tUnit"],v["tValue"]);
        stmt.run(v["time"],v["tUnit"],v["tValue"]);
    }
    stmt.finalize();
}

export default seedTime();