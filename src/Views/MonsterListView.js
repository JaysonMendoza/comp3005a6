import React, {useState} from 'react';
import axios from 'axios';
import MonsterTable from '../Components/MonsterTable';
import {setSqlQueryString} from '../stores/SQLQueryStore';


export default function MonsterListView(props) {
    const [monstertdst,settdst] = useState([]);
    if(monstertdst.length<1) {
        axios.get("/monsters/all").then(response=> {
            settdst(response.data.data);
            setSqlQueryString(response.data.sqlQuery);
        });
    }


    return <MonsterTable monsterList={monstertdst}/>;
}