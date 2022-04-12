import axios from "axios";
import {processMonsterList} from './stores/MonsterStore';
import produce from 'immer';



function updateMonsters() {
    axios.get("/monsters/all").then(monsterList => processMonsterList(monsterList));
}