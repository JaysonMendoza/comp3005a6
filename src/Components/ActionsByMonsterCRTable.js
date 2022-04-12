import React from 'react';
import {Container,Row,Col,Table} from 'react-bootstrap';

export default function ActionsByMonsterCRTable(props) {

    let tableItems = props?.list?.map( (item,index) => {
        return (<tr key={index}>
            <td className="text-center">{item?.challengeRating}</td>
            <td className="text-center">{item?.name}</td>
            <td className="text-center">{item?.actionName}</td>
            <td className="text-center">{item?.actionDescription}</td>
        </tr>)
    });

    return (
        <Container>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="text-center">CR</th>
                        <th className="text-center">Name</th>
                        <th className="text-center">Action Name</th>
                        <th className="text-center">Description</th>
                    </tr>
                </thead>
                <tbody>
                {tableItems}
                </tbody>
            </Table>
        </Container>
    );
}