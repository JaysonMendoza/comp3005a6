import React, {useState} from 'react';
import axios from 'axios';
import ActionsByMonsterCRTable from '../Components/ActionsByMonsterCRTable';

import {setSqlQueryString} from '../stores/SQLQueryStore';


export default function ActionsByMonsterCR(props) {
    const [list,setList] = useState([]);
    if(list.length<1) {
        axios.get("/monsters/R3-4").then(response=> {
            setList(response.data.data);
            setSqlQueryString(response.data.sqlQuery);
        });
    }


    return <ActionsByMonsterCRTable list={list}/>;
}