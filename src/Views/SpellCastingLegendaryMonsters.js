import React, {useState} from 'react';
import axios from 'axios';
import SpellCastingLegendaryMonstersTable from '../Components/SpellCastingLegendaryMonstersTable'
import {setSqlQueryString} from '../stores/SQLQueryStore';


export default function SpellCastingLegendaryMonsters(props) {
    const [monstertdst,settdst] = useState([]);
    if(monstertdst.length<1) {
        axios.get("/monsters/R3-6").then(response=> {
            settdst(response.data.data);
            setSqlQueryString(response.data.sqlQuery);
        });
    }


    return <SpellCastingLegendaryMonstersTable monsterList={monstertdst}/>;
}