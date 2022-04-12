import React from "react";
import {Route, Routes,NavLink,Navigate} from 'react-router-dom'
import {Nav, Tab} from 'react-bootstrap'
import {Container,Row,Col} from 'react-bootstrap';
import MonsterListView from "./MonsterListView";
import ActionsByMonsterCR from './ActionsByMonsterCR'
import SQLQueryString from '../Components/SQLQueryString'
import SpellCastingLegendaryMonsters from './SpellCastingLegendaryMonsters'
import MonsterView from "./MonsterView";

export default function MainView(props) {

    return (
    <Container fluid>
        <Row>
            <Col>
                <Routes>
                        
                    <Route path="/R3-3" element={<h1  className="text-center" >R3.3) Monster List</h1>}/>
                    <Route path="/R3-4" element={<h1 className="text-center">R3.4) Actions by Monster CR</h1>}/>
                    <Route path="/R3-5" element={<h1 className="text-center">R3.5) View Monster Card</h1>}/>
                    <Route path="/R3-6" element={<h1 className="text-center">R3.6) Spellcasting Legendary Monsters</h1>}/>
                    <Route index element={<Navigate to="/R3-3" />}/>
                </Routes>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Tab.Container id="sideMenu" defaultActiveKey="R3-3">
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                        <NavLink to="/R3-3">
                            <Nav.Link eventKey="R3-3" >R3.3) Monster List</Nav.Link>
                        </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink to="/R3-4">
                                <Nav.Link eventKey="R3-4">R3.4) Actions by Monster and Challenge Rating</Nav.Link>
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink to="/R3-5">
                                <Nav.Link eventKey="R3-5">R3.5) View Monster Card</Nav.Link>
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <NavLink to="/R3-6">
                                <Nav.Link eventKey="R3.6">R3.6) Spellcasting Legendary Monsters</Nav.Link>
                            </NavLink>
                        </Nav.Item>
                    </Nav>
                </Tab.Container>
            </Col>
            <Col xs={10}>
                <Row>
                    <Col>
                        <SQLQueryString/>
                    </Col>
                </Row>
                <Row>
                    <Routes>
                        <Route path="/">No Route</Route>
                        <Route path="/R3-3" element={<MonsterListView/>}/>
                        <Route path="/R3-4" element={<ActionsByMonsterCR/>}/>
                        <Route path="/R3-5" element={<MonsterView/>}/>
                        <Route path="/R3-6" element={<SpellCastingLegendaryMonsters/>}/>
                    </Routes>
                </Row>
            </Col>
        </Row>
    </Container>
    );
}