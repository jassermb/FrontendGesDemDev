import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Table, Badge, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft } from 'react-icons/fa';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const DevelopmentRequestView = () => {
    const { id } = useParams();
    const [developmentRequest, setDevelopmentRequest] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchDevelopmentRequest = async () => {
            try {
                console.log('id', id);
                const response = await axios.get(`http://localhost:5000/api/demdev/demande1-developpement/${id}`);
                setDevelopmentRequest(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de la demande de développement', error);
            }
        };

        fetchDevelopmentRequest();
    }, [id]);



    if (!developmentRequest) {
        return <p>Chargement...</p>;
    }
    const goBack = () => {
        navigate(-1);
    };
    return (

        <>
         <div className="back-button">
                <button onClick={goBack} className="scroll-top-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow-icon" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 5l-7 7 7 7" />
                        <path d="M2 12h20" />
                    </svg>
                </button>

            </div>

        <Container style={{ marginTop: '10px' }} >
  
            <Card style={{borderBottom:'1px solid #243242'}} >
                <Card.Header as="h4" style={{
                    backgroundColor: '#243242',
                    color: '#FFFFFF',
                    borderBottom: '2px solid #00509E'
                }}>
                    Consultation de la Demande de Développement - Première Partie
                </Card.Header>
                <Card.Body >
                    <Table bordered hover responsive>
                        <tbody>
                            <tr>
                                <th>Date Objectif Mise en Industrialisation</th>
                                <td>{developmentRequest.dateObjectifMiseEnIndustrialisation}</td>
                            </tr>
                            <tr>
                                <th>Problématique</th>
                                <td>{developmentRequest.problematique}</td>
                            </tr>
                            <tr>
                                <th>Objectif Développement</th>
                                <td>{developmentRequest.objectifDevelopment}</td>
                            </tr>
                            <tr>
                                <th>Raison Développement</th>
                                <td>
                                    <ListGroup>
                                        {JSON.parse(developmentRequest.raisonDevelopment).map((item, index) => (
                                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                                {item.raison}
                                                {item.file && (
                                                    <Button
                                                        variant="outline-primary"
                                                        href={`http://localhost:5000/${item.file}`}
                                                        target="_blank"
                                                        className="ms-2"
                                                    >
                                                        <Badge bg="secondary">Télécharger</Badge>
                                                    </Button>
                                                )}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </td>
                            </tr>
                            <tr>
                                <th>Date de Création</th>
                                <td>{new Date(developmentRequest.dateCreation).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <th>Rôle du Créateur</th>
                                <td>{developmentRequest.creatorRole}</td>
                            </tr>
                            <tr>
                                <th>code</th>
                                <td>{developmentRequest.code}</td>
                            </tr>
                        </tbody>
                    </Table>

                </Card.Body>
            </Card>
            <ToastContainer />
        </Container> </>
    );
};

export default DevelopmentRequestView;
