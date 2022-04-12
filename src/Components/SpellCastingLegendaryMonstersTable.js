import React from "react";
import Table from 'react-bootstrap/Table'
import {Container} from 'react-bootstrap';

export default function MonsterTable(props) {

    let tableItems = props?.monsterList?.map( monster => {
        return (<tr key={monster?.monsterID}>
            <td className="text-center">{monster?.challengeRating}</td>
            <td className="text-center">{Number(monster?.xpReward).toLocaleString()}</td>
            <td className="text-center">{monster?.name}</td>
            <td className="text-center">{monster?.saDescription}</td>
            <td className="text-center">{monster?.size}</td>
            <td className="text-center">{monster?.type}</td>
            <td className="text-center">{monster?.alignment}</td>
            <td className="text-center">{monster?.armorClass}</td>
            <td className="text-center">{monster?.hitPoints}</td>
            <td className="text-center">{monster?.hitDice}</td>
            <td className="text-center">{monster?.strength}</td>
            <td className="text-center">{monster?.dexterity}</td>
            <td className="text-center">{monster?.constitution}</td>
            <td className="text-center">{monster?.intelligence}</td>
            <td className="text-center">{monster?.wisdom}</td>
            <td className="text-center">{monster?.charisma}</td>
        </tr>)
    });

    return (
        <Container>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="text-center">CR</th>
                        <th className="text-center">XP</th>
                        <th className="text-center">Name</th>
                        <th className="text-center">Spells</th>
                        <th className="text-center">Size</th>
                        <th className="text-center">Type</th>
                        <th className="text-center">Alignment</th>
                        <th className="text-center">AC</th>
                        <th className="text-center">HP</th>
                        <th className="text-center">Hit Dice</th>
                        <th className="text-center">STR</th>
                        <th className="text-center">DEX</th>
                        <th className="text-center">CON</th>
                        <th className="text-center">INT</th>
                        <th className="text-center">WIS</th>
                        <th className="text-center">CHA</th>
                    </tr>
                </thead>
                <tbody>
                {tableItems}
                </tbody>
            </Table>
        </Container>
    );
}