import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Accordion,Table} from 'react-bootstrap'
import BackGround from '../Assets/parchment-612x612.jpg';
const cardStyle = {
    backgroundImage : `url(${BackGround})`
};

export default function MonsterCard(props) {
    const [actions,setActions] = useState([]);
    const [la,setLA] = useState([]);
    const [sa,setSA] = useState([]);
    const [reactions,setReactions] = useState([]);
    const [skills,setSkills] = useState([]);
    const [senses,setSenses] = useState([]);
    const [movementSpeeds,setMovementSpeeds] = useState([]);
    const [vulnerabilities,setVulnerabilities] = useState([]);
    const [resistances,setResistances] = useState([]);
    const [immunities,setImmunities] = useState([]);
    const [altForms,setAltForms] = useState([]);
    console.log(props);

    
    useEffect( () => {
        if(props?.monster===undefined || props?.monster==null) {
            console.error("Monster cannot be undefined!");
            return;
        }
        setActionItems("action",props?.monster?.actions,setActions);   
        setActionItems("la",props?.monster?.la,setLA);
        setActionItems("sa",props?.monster?.sa,setSA);
        setActionItems("reactions",props?.monster?.reactions,setReactions); 
        setSkillList(props?.monster.skills);
        setSensesItems(props?.monster?.senses);
        setMoveSpeedItems(props?.monster?.moveSpeeds);
        setAsList(props?.monster?.vulnerabilities,setVulnerabilities);
        setAsList(props?.monster?.resistances,setResistances);
        setAsList(props?.monster?.immunities,setImmunities);
        setAltFormItems(props?.monster?.altForms)
    },[props]);

    async function setAsList(list,setFunct) {
        let newList = [];
        for(const item of list) {
            
            newList.push(item.affectType);
        };

        if(newList===undefined || newList.length<1) {
            newList.push("None")
        }
        setFunct(newList);
    }

    async function setActionItems(prefix,list,setFunct) {
        let componentList = list.map( (item,index)=> {
            console.log(item,index);
            const keyName = prefix+"Name";
            const keyDescription = prefix+"Description";
            return (
            <Container fluid key={index}>
                <Row>
                    <Col>
                        <h4>{item[keyName]}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>{item[keyDescription]}</p>
                    </Col>
                </Row>
            </Container>
            );
        });
        if(componentList===undefined || componentList?.length<1) {
            componentList.push(<p>None</p>);
        }
        setFunct(componentList);
    }



    async function setSensesItems(list) {
        let componentList = list.map( (item,index)=> {
            console.log(item,index);
            return (
            <Container fluid key={index}>
                <Row>
                    <Col>
                        <h4>{item["sense"].toUpperCase()}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>{item["range"]}</p>
                    </Col>
                </Row>
            </Container>
            );
        });
        if(componentList===undefined || componentList?.length<1) {
            componentList.push(<p>None</p>);
        }
        setSenses(componentList);
    }

    async function setAltFormItems(list) {
        if(list===undefined) {
            return;
        }
        let outList = [];
        for(const item of list) {
            outList.push(item.name);
        }
        if(outList===undefined || outList?.length<1) {
            outList.push("None");
        }
        setAltForms(outList);
    }

    async function setMoveSpeedItems(list) {
        let componentList = list.map( (item,index)=> {
            console.log(item,index);
            return (
            <Container fluid key={index}>
                <Row>
                    <Col>
                        <h4>{item["moveType"].toUpperCase()}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>{item["distance"]}</p>
                    </Col>
                </Row>
            </Container>
            );
        });
        if(componentList===undefined || componentList?.length<1) {
            componentList.push(<p>None</p>);
        }
        setMovementSpeeds(componentList);
    } 

    async function setSkillList(list) {
        let componentList = list.map( (item,index)=> {
            console.log(item,index);
            return (
                <Container key={index}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th rowSpan={2}>{item["skillName"].toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Check</th>
                                <td>{item["checkBonus"]}</td>
                            </tr>
                            <tr>
                                <th>Passive Check</th>
                                <td>{item["passiveCheckBonus"]}</td>
                            </tr>
                        </tbody>
                    </Table>

                </Container>
            );
        });
        if(componentList===undefined || componentList?.length<1) {
            componentList.push(<p>None</p>);
        }
        setSkills(componentList);
    }

    return (
        <Container style={cardStyle}>
            <Row>
                <Col>
                    <h1 className="text-center">{props?.monster?.name}</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5 className="text-center">Challenge Raiting (CR)</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.challengeRating}</p>
                </Col>
                <Col>
                    <h5 className="text-center">XP Reward</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.xpReward}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5 className="text-center">STR</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.strength}</p>
                </Col>
                <Col>
                    <h5 className="text-center">Type</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.type}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5 className="text-center">DEX</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.dexterity}</p>
                </Col>
                <Col>
                    <h5 className="text-center">SubType</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.subType}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5 className="text-center">CON</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.constitution}</p>
                </Col>
                <Col>
                    <h5 className="text-center">Alignment</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.alignment}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5 className="text-center">INT</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.intelligence}</p>
                </Col>
                <Col>
                    <h5 className="text-center">Armor Class</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.armorClass}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5 className="text-center">WIS</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.wisdom}</p>
                </Col>
                <Col>
                    <h5 className="text-center">Hit Points</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.hitPoints}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5 className="text-center">CHA</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.charisma}</p>
                </Col>
                <Col>
                    <h5 className="text-center">Hit Dice</h5>
                </Col>
                <Col>
                    <p className="text-center">{props?.monster?.hitDice}</p>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <h5 className="text-center">Resistances</h5>
                </Col>
                <Col xs={9}>
                    <p className="text-left">{resistances}</p>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <h5 className="text-center">Immunities</h5>
                </Col>
                <Col xs={9}>
                    <p className="text-left">{immunities}</p>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <h5 className="text-center">Vulnerabilities</h5>
                </Col>
                <Col xs={9}>
                    <p className="text-left">{vulnerabilities}</p>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <h5 className="text-center">Alternate Forms</h5>
                </Col>
                <Col xs={9}>
                    <p className="text-left">{altForms}</p>
                </Col>
            </Row>
            <Row>
                <Accordion defaultActiveKey={"Actions"} flush alwaysOpen>
                    <Accordion.Item eventKey="movement">
                        <Accordion.Header>Movement Speeds</Accordion.Header>
                        <Accordion.Body>
                            {movementSpeeds}
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="senses">
                        <Accordion.Header>Senses</Accordion.Header>
                        <Accordion.Body>
                                {senses}
                            </Accordion.Body>
                    </Accordion.Item>   
                    <Accordion.Item eventKey="Actions">
                        <Accordion.Header>Actions</Accordion.Header>
                        <Accordion.Body>
                            {actions}
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="reactions">
                        <Accordion.Header>Reactions</Accordion.Header>
                        <Accordion.Body>
                            {reactions}
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="specialAbilities">
                        <Accordion.Header>Special Abilities</Accordion.Header>
                        <Accordion.Body>
                            {sa}
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="legendaryActions">
                        <Accordion.Header>Legendary Actions</Accordion.Header>
                        <Accordion.Body>
                            {la}
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="proficiencies">
                            <Accordion.Header>Proficiencies</Accordion.Header>
                            <Accordion.Body>
                                {skills}
                            </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Row>
        </Container>
    );
}