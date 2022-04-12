import {PromisedDatabase} from 'promised-sqlite3'

const DND5EDB = new PromisedDatabase();

try {
    DND5EDB.open('./Server/DB/DND5eMonsters.db');
}
catch(error) {
    console.error("DB Open Error:",error);
}

//Prepared Queries go here


export default DND5EDB;