import React from 'react';
import RegisterForm from './register';
import { Container, Row, Col } from 'react-bootstrap';

const AdminDashboard = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <h1>Tableau de Bord Administrateur</h1>
                    <RegisterForm />
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
