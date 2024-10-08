import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Table, Badge, ListGroup, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
const Firstdemchefprod = () => {
    const { id } = useParams();
    const [developmentRequest, setDevelopmentRequest] = useState(null);
    const [reload, setReload] = useState(false);
    const [comment, setComment] = useState('');
    const [isRejected, setIsRejected] = useState(false);
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevelopmentRequest = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/demdev/demande1-developpement/${id}`);
                setDevelopmentRequest(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de la demande de développement', error);
            }
        };

        fetchDevelopmentRequest();
    }, [id]);

    useEffect(() => {
        if (reload) {
            window.location.reload();
            setReload(false);
        }
    }, [reload]);

    if (!developmentRequest) {
        return <p>Chargement...</p>;
    }

    const handleTakeCharge = async (isValid) => {
        try {
            const validationStatus = isValid ? 'Prendre_en_Charge' : 'Refuser';
            const statustt = isValid ? 'Pris en charge' : 'Non pris en charge';

            if (!isValid && comment.trim() === '') {
                toast.error('Le commentaire est obligatoire si vous refusez la demande.');
                return;
            }
            await axios.put(`http://localhost:5000/api/users/validationresachat/${id}`, { Validationresachat: validationStatus, status: statustt });
            toast.success(`Demande ${validationStatus} avec succès!`, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            if (isValid) {
                setTimeout(() => {
                    navigate(`/form2/${id}`);
                }, 2000);
            } else {
                setTimeout(() => {
                    navigate('/tableau');
                    window.location.reload();
                }, 3000);
            }
            const message = isValid
                ? `Votre demande de développement a été prise en charge par le chef de produit et est en cours d'examen.`
                : `Votre demande de développement a été rejetée par le chef de produit. Raison : ${comment}`;
            await axios.post('http://localhost:5000/api/users/create-notification', {
                userId: userId,
                role: role,
                receiverRole: developmentRequest.creatorRole,
                type: isValid ? 'validationchefprod1' : 'rejetchefprod',
                message: message,
                id_dem: id,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        } catch (error) {
            console.error('Erreur lors de la validation/rejet de la demande', error);
            toast.error('Erreur lors de la validation/rejet de la demande.', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };
    const StyledTooltip = styled(Tooltip)(({ theme }) => ({
        '& .MuiTooltip-tooltip': {
            backgroundColor: '#333',
            color: '#fff',
            fontSize: '0.875rem',
            borderRadius: '4px',
            padding: '8px 12px',
            boxShadow: theme.shadows[4],
            maxWidth: '200px',
            textAlign: 'center',
        },
    }));
    return (
        <Container className="mt-3" style={{
            marginBottom: '20px'
        }}>
            <Card style={{ borderBottom: '2px solid #243242', maxWidth: '100%' }}>
                <Card.Header as="h5" style={{
                    backgroundColor: '#243242', // Bleu marine
                    color: '#FFFFFF', // Blanc
                    borderBottom: '2px solid #000' // Bordure plus claire
                }}>
                    Prise en Charge de la Première Partie de la Demande de Développement
                </Card.Header>
                <Card.Body>
                    <Table bordered hover responsive>
                        <tbody>
                            <tr>
                                <th>Date Objectif Mise en Industrialisation</th>
                                <td>{developmentRequest.dateObjectifMiseEnIndustrialisation}</td>
                            </tr>
                            <tr>
                                <th>Date de Création</th>
                                <td>{new Date(developmentRequest.dateCreation).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <th>Code</th>
                                <td>{developmentRequest.code}</td>
                            </tr>
                            <tr>
                                <th>Problématique</th>
                                <td>
                                    <Tooltip
                                        title={developmentRequest.problematique}
                                        componentsProps={{
                                            tooltip: {
                                                sx: {
                                                    backgroundColor: 'black',
                                                    color: 'white',
                                                    fontSize: '14px',
                                                    padding: '8px 12px',
                                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                                    borderRadius: '4px',
                                                }
                                            }
                                        }}
                                    >
                                        <span style={{ cursor: 'pointer' }}>
                                            {developmentRequest.problematique.length > 20
                                                ? `${developmentRequest.problematique.substring(0, 20)}...`
                                                : developmentRequest.problematique}
                                        </span>
                                    </Tooltip>
                                </td>
                            </tr>
                            <tr>
                                <th>Objectif Développement</th>
                                <td>
                                    <Tooltip
                                        title={developmentRequest.objectifDevelopment}
                                        componentsProps={{
                                            tooltip: {
                                                sx: {
                                                    backgroundColor: 'black',
                                                    color: 'white',
                                                    fontSize: '14px',
                                                    padding: '8px 12px',
                                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                                    borderRadius: '4px',
                                                }
                                            }
                                        }}
                                    >
                                        <span style={{ cursor: 'pointer' }}>
                                            {developmentRequest.objectifDevelopment.length > 20
                                                ? `${developmentRequest.objectifDevelopment.substring(0, 20)}...`
                                                : developmentRequest.objectifDevelopment}
                                        </span>
                                    </Tooltip>
                                </td>
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


                        </tbody>
                    </Table>

                    <Form.Group className="mt-4">
                        <Form.Label>Commentaire (obligatoire si vous refusez)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ borderColor: isRejected ? 'red' : 'default' }}
                            placeholder="Veuillez entrer une raison pour le rejet..."
                        />
                        {comment.trim() === '' && isRejected && (
                            <Alert variant="danger" className="mt-2">
                                Le commentaire est obligatoire si vous refusez la demande.
                            </Alert>
                        )}
                    </Form.Group>

                    <div className="text-center mt-4" >
                        <Button
                            variant="success"
                            onClick={() => {
                                setIsRejected(false);
                                handleTakeCharge(true);
                            }}
                            className="me-2"
                            style={{ width: '200px' ,padding:'6px 10px',  fontWeight: 'bold', }} 
                        >
                            Prendre en Charge
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                setIsRejected(true);
                                handleTakeCharge(false);
                            }}
                            style={{ width: '200px' ,padding:'6px 10px', marginLeft: '25px', fontWeight: 'bold', }} 
                        >
                            Refuser
                        </Button>
                    </div>

                </Card.Body>
            </Card>
            <ToastContainer />
        </Container>
    );
};

export default Firstdemchefprod;
