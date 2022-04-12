import React, {useState} from "react";
import {Route, Routes,NavLink} from 'react-router-dom'
import {Nav, Tab,Form,Dropdown, DropdownButton} from 'react-bootstrap'
import {Container,Row,Col} from 'react-bootstrap';
import axios from 'axios';
import {setSqlQueryString} from '../stores/SQLQueryStore';
import MonsterCard from "../Components/MonsterCard";

export default function MonsterView(props) {
    const [monstertdst,settdst] = useState([]);
    const [monster,setMonster] = useState(null);
    if(monstertdst.length<1) {
        axios.get("/monsters/all").then(response=> {
            settdst(response.data.data);
            setSqlQueryString(response.data.sqlQuery);
        });
    }

    // let options = monstertdst?.map( monster => {
    //     return (<option key={monster?.monsterID} value={monster?.monsterID}>{monster?.name}</option>);
    // });

    let bOptions = monstertdst?.map( monster => {
        return <Dropdown.Item key={monster?.monsterID} onClick={e => monsterChanged(monster?.monsterID)}>{monster?.name}</Dropdown.Item>;
    });

    async function monsterChanged(monsterID) {
        console.log(monsterID)
        let m = monstertdst.find(e => e.monsterID === monsterID);
        // console.log("Search for monsterID: ",monsterID,", Found: ",m);
        axios.get("/monsters/"+monsterID).then(response=> {
            let tdata = response.data.data;
            let newMonster = {
                ...m,
                actions : tdata.actions,
                la : tdata.la,
                sa : tdata.sa,
                reactions : tdata.reactions,
                moveSpeeds : tdata.moveSpeeds,
                senses : tdata.senses,
                skills : tdata.skills,
                vulnerabilities : tdata.vulnerabilities,
                resistances : tdata.resistances,
                immunities : tdata.immunities,
                altForms : tdata.altForms
            }
            // console.log(newMonster);
            setSqlQueryString(response.data.sqlQuery);
            setMonster(newMonster);
        });
    }

    return (
        <Container fluid>
            <Row>
                <DropdownButton id="monsterSelect" title="Select Monster">
                    {bOptions}
                </DropdownButton>
            </Row>
            <Row>
                <MonsterCard monster={monster}/>
            </Row>
        </Container>
    );
}