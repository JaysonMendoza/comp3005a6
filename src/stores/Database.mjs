import sqlite3 from 'sqlite3'

sqlite3.verbose();
let db = new sqlite3.Database('DNDSpellsAndAbilities.db');

//Prepared Queries go here


export default db;