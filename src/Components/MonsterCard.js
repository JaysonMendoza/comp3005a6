import React from 'react';
import {Container, Row, Col, Accordion} from 'react-bootstrap'
import BackGround from '../Assets/parchment-612x612.jpg';
const cardStyle = {
    backgroundImage : `url(${BackGround})`
};

export default function MonsterCard(props) {
    console.log(props);

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
                <Accordion defaultActiveKey={"Actions"} flush alwaysOpen>
                    <Accordion.Item eventKey="Actions">
                        <Accordion.Header>Actions</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col>
                                    <h4>Ability Name</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>description</p>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="specialAbilities">
                        <Accordion.Header>Special Abilities</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col>
                                    <h4>Ability Name</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>description</p>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="legendaryActions">
                        <Accordion.Header>Legendary Actions</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col>
                                    <h4>Ability Name</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>description</p>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="resistances">
                        <Accordion.Header>Resistances</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col>
                                    <h4>Ability Name</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>description</p>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="vulnerabilities">
                        <Accordion.Header>Vulnerabilities</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col>
                                    <h4>Ability Name</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>description</p>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="immunities">
                        <Accordion.Header>Immunities</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col>
                                    <h4>Ability Name</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>description</p>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="proficiencies">
                            <Accordion.Header>Proficiencies</Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col>
                                        <h4>Ability Name</h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p>description</p>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="senses">
                        <Accordion.Header>Senses</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col>
                                    <h4>Ability Name</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>description</p>
                                </Col>
                            </Row>
                            </Accordion.Body>
                    </Accordion.Item>   
                    <Accordion.Item eventKey="movement">
                        <Accordion.Header>Movement Speeds</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col>
                                    <h4>Ability Name</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>description</p>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Row>
        </Container>
    );
}