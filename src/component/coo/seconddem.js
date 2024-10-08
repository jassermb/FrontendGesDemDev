import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Card, Button, Table, Form, Alert } from 'react-bootstrap';
import Tooltip from '@mui/material/Tooltip';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Developmentpart1RequestDetails from '../dem/part1form';

import {
    TableCell, Paper, Grid, Typography,
} from '@mui/material';
import { Margin } from '@mui/icons-material';
const DevelopmentRequestDetailsView2 = () => {
    const { id } = useParams();
    const [developmentRequest, setDevelopmentRequest] = useState(null);
    const [comment, setComment] = useState('');
    const [isRejected, setIsRejected] = useState(false);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    useEffect(() => {
        const fetchDevelopmentRequest = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/demdev/demdev2/${id}`);
                console.log('Response status:', response.status);

                const data = response.data;
                console.log('Data fetched:', data);

                if (data) {
                    data.RisqueImpact = Array.isArray(data.RisqueImpact) ? data.RisqueImpact : JSON.parse(data.RisqueImpact || "[]");
                    setDevelopmentRequest(data);
                } else {
                    console.error('Aucune donnée trouvée pour l\'ID fourni.');
                    toast.error('Aucune donnée trouvée pour l\'ID fourni.');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de la demande de développement', error);
                toast.error('Erreur lors de la récupération des données.');
            }
        };

        fetchDevelopmentRequest();
    }, [id]);

    if (!developmentRequest) {
        return <p>Chargement...</p>;
    }

    const handleValidate = async (isValid) => {
        if (!isValid && comment.trim() === '') {
            setIsRejected(true);
            toast.error('Le commentaire est obligatoire en cas de rejet.');
            return;
        }

        try {
            const validationStatus = isValid ? 'validé (COO)' : 'Non validé (COO)';
            await axios.put(`http://localhost:5000/api/users/validationcoo/${id}`, { validationCOO: validationStatus, status: validationStatus });

            toast.success(`Demande ${validationStatus} avec succès!`, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                navigate('/tableau');
                window.location.reload();
            }, 2000);

            await axios.post('http://localhost:5000/api/users/create-notification', {
                userId: userId,
                role: role,
                receiverRole: 'chefdeproduit',
                type: isValid ? 'validationcoo2' : 'rejetcoo2',
                message: `Votre deuxième partie de la demande de développement a été ${validationStatus}${!isValid ? ` Raison : ${comment}` : ''}`,
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
    const parsedRaisonDevelopment = JSON.parse(developmentRequest.raisonDevelopment || '[]');

    return (
        <>
            <Developmentpart1RequestDetails requestId={id} />
            <Container fluid className="mt-4" style={{ marginBottom: '20px'  }}>
                <Card style={{borderBottom:'1px solid #243242'}}>
                    <Card.Header as="h5" style={{
                        backgroundColor: '#243242',
                        color: '#FFFFFF',
                        borderBottom: '2px solid black'
                    }}>
                        Validation de la Deuxième Partie de la Demande de Développement
                    </Card.Header>
                    <Card.Body>
                        <h7 style={{
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            color: '#333',
                            letterSpacing: '0.8px',

                        }}>
                            Données de Base Associées
                        </h7>
                        {developmentRequest.donneesDeBase.length > 0 ? (
                            <Table striped bordered hover>
                                <thead style={{ backgroundColor: '#C0C0C0' }}>
                                    <tr>
                                        <th>Code windeco</th>
                                        <th>Désignation</th>
                                        <th>Consommation Annuelle 2024</th>
                                        <th>Prix Actuel</th>
                                        <th>Fournisseur</th>
                                        <th>Désignation Fournisseur</th>
                                        <th>Documents Qualité</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {developmentRequest.donneesDeBase.map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.Codewindeco}</td>
                                            <TableCell align="left">
                                                {data.designation.length > 10 ? (
                                                    <Tooltip title={data.designation} arrow
                                                        placement="bottom"
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: '#2C3E50',
                                                                    color: '#ecf0f1',
                                                                    fontSize: '14px',
                                                                    padding: '10px 16px',
                                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                                    borderRadius: '8px',
                                                                    maxWidth: '250px',
                                                                    whiteSpace: 'pre-wrap',
                                                                    textAlign: 'center',
                                                                },
                                                            },
                                                            arrow: {
                                                                sx: {
                                                                    color: '#2C3E50',
                                                                },
                                                            },
                                                        }}>
                                                        <span>{data.designation.substring(0, 10) + '...'}</span>
                                                    </Tooltip>
                                                ) : (
                                                    data.designation
                                                )}
                                            </TableCell>
                                            <td>{data.consommationAnnuelle2024}</td>
                                            <td>{data.prixActuel}</td>
                                            <td>{data.fournisseur}</td>
                                            <TableCell align="left">
                                                {data.designationFournisseur.length > 10 ? (
                                                    <Tooltip title={data.designationFournisseur} arrow
                                                        placement="bottom"
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: '#2C3E50',
                                                                    color: '#ecf0f1',
                                                                    fontSize: '14px',
                                                                    padding: '10px 16px',
                                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                                    borderRadius: '8px',
                                                                    maxWidth: '250px',
                                                                    whiteSpace: 'pre-wrap',
                                                                    textAlign: 'center',
                                                                },
                                                            },
                                                            arrow: {
                                                                sx: {
                                                                    color: '#2C3E50',
                                                                },
                                                            },
                                                        }}>
                                                        <span>{data.designationFournisseur.substring(0, 10) + '...'}</span>
                                                    </Tooltip>
                                                ) : (
                                                    data.designationFournisseur
                                                )}
                                            </TableCell>
                                            <TableCell align="left">
                                                {data.documentsQualite.length > 10 ? (
                                                    <Tooltip title={data.documentsQualite} arrow
                                                        placement="bottom"
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: '#2C3E50',
                                                                    color: '#ecf0f1',
                                                                    fontSize: '14px',
                                                                    padding: '10px 16px',
                                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                                    borderRadius: '8px',
                                                                    maxWidth: '250px',
                                                                    whiteSpace: 'pre-wrap',
                                                                    textAlign: 'center',
                                                                },
                                                            },
                                                            arrow: {
                                                                sx: {
                                                                    color: '#2C3E50',
                                                                },
                                                            },
                                                        }}>
                                                        <span>{data.documentsQualite.substring(0, 10) + '...'}</span>
                                                    </Tooltip>
                                                ) : (
                                                    data.documentsQualite
                                                )}
                                            </TableCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>Aucune donnée de base associée trouvée.</p>
                        )}
                        <h7 style={{
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            color: '#333',
                            letterSpacing: '0.8px',

                        }}>
                            Analyse des Risques et Estimations Financières                        </h7>
                        <Table bordered hover responsive>
                            <tbody>


                                {/* <tr>
                                <th style={{ backgroundColor: '#C0C0C0' }}>Raison du Développement</th>
                                <td>
                                    {parsedRaisonDevelopment.length > 0 ? (
                                        parsedRaisonDevelopment.map((item, index) => (
                                            <Paper key={index} sx={{ p: 1, mt: 1, border: 1, borderColor: 'grey.200' }}>
                                                <Grid container alignItems="center" spacing={1}>
                                                    <Grid item xs={12} sm={8}>
                                                        <Typography variant="body2">{item.raison}</Typography>
                                                    </Grid>
                                                    {item.file && (
                                                        <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                                                            <Button
                                                                style={{ border: '0.5px solid black' }}
                                                                variant="outlined"
                                                                color="primary"
                                                                startIcon={<InsertDriveFileIcon />}
                                                                component="a"
                                                                href={`http://localhost:5000/${item.file}`}
                                                                target="_blank"
                                                                rel="noopener"
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    fontSize: '0.8rem',
                                                                }}
                                                            >
                                                                Télécharger
                                                            </Button>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </Paper>
                                        ))
                                    ) : (
                                        <Typography variant="body2">Aucune raison de développement spécifiée</Typography>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th style={{ backgroundColor: '#C0C0C0' }}>Problématique</th>
                                <td>{developmentRequest.problematique}</td>
                            </tr>
                            <tr>
                                <th style={{ backgroundColor: '#C0C0C0' }}>Objectif du Développement</th>
                                <td>{developmentRequest.objectifDevelopment}</td>
                            </tr>   */}

                                <tr>
                                    <th style={{ backgroundColor: '#C0C0C0' }}>Estimation de Vente</th>
                                    <td>{developmentRequest.estimationDeVente}</td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#C0C0C0' }}>Risque & Impact</th>
                                    <td>
                                        {developmentRequest.RisqueImpact.length > 0 ? (
                                            <Table striped bordered hover>
                                                <thead style={{ backgroundColor: '#C0C0C0' }}>
                                                    <tr >
                                                        <th>Numéro</th>
                                                        <th>Description</th>
                                                        <th>Gravité</th>
                                                        <th>Plan d'Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {developmentRequest.RisqueImpact.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <TableCell align="left">
                                                                {item.description.length > 10 ? (
                                                                    <Tooltip title={item.description} arrow
                                                                        placement="bottom"
                                                                        componentsProps={{
                                                                            tooltip: {
                                                                                sx: {
                                                                                    backgroundColor: '#2C3E50',
                                                                                    color: '#ecf0f1',
                                                                                    fontSize: '14px',
                                                                                    padding: '10px 16px',
                                                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                                                    borderRadius: '8px',
                                                                                    maxWidth: '250px',
                                                                                    whiteSpace: 'pre-wrap',
                                                                                    textAlign: 'center',
                                                                                },
                                                                            },
                                                                            arrow: {
                                                                                sx: {
                                                                                    color: '#2C3E50',
                                                                                },
                                                                            },
                                                                        }}>
                                                                        <span>{item.description.substring(0, 10) + '...'}</span>
                                                                    </Tooltip>
                                                                ) : (
                                                                    item.description
                                                                )}
                                                            </TableCell>
                                                            <td>{item.gravite}</td>
                                                            <TableCell align="left">
                                                                {item.planAction.length > 10 ? (
                                                                    <Tooltip title={item.planAction} arrow
                                                                        placement="bottom"
                                                                        componentsProps={{
                                                                            tooltip: {
                                                                                sx: {
                                                                                    backgroundColor: '#2C3E50',
                                                                                    color: '#ecf0f1',
                                                                                    fontSize: '14px',
                                                                                    padding: '10px 16px',
                                                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                                                    borderRadius: '8px',
                                                                                    maxWidth: '250px',
                                                                                    whiteSpace: 'pre-wrap',
                                                                                    textAlign: 'center',
                                                                                },
                                                                            },
                                                                            arrow: {
                                                                                sx: {
                                                                                    color: '#2C3E50',
                                                                                },
                                                                            },
                                                                        }}>
                                                                        <span>{item.description.substring(0, 10) + '...'}</span>
                                                                    </Tooltip>
                                                                ) : (
                                                                    item.planAction
                                                                )}
                                                            </TableCell>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        ) : (
                                            'Aucun risque ou impact spécifié'
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#C0C0C0' }}>Estimation de Gain annuel </th>
                                    <td>{developmentRequest.estimationDeGain}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <Form.Group className="mt-4">
                            <Form.Label>
                                Raison <span style={{ color: 'red' }}>*</span> (obligatoire si vous refusez)
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                style={{
                                    borderColor: isRejected && comment.trim() === '' ? 'red' : '#ced4da',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    backgroundColor: '#f8f9fa',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                placeholder="Veuillez entrer une raison pour le rejet..."
                                onFocus={(e) => (e.target.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.5)')}
                                onBlur={(e) => (e.target.style.boxShadow = 'none')}
                            />
                            {comment.trim() === '' && isRejected && (
                                <Alert
                                    variant="danger"
                                    className="mt-2"
                                    style={{
                                        backgroundColor: '#f8d7da',
                                        borderColor: '#f5c6cb',
                                        color: '#721c24',
                                        borderRadius: '8px',
                                    }}
                                >
                                    Le commentaire est obligatoire si vous refusez la demande.
                                </Alert>
                            )}
                        </Form.Group>
                        <div className="text-center mt-4">
                            <Button
                                variant="success"
                                onClick={() => handleValidate(true)}
                                className="me-2"
                            >
                                Valider
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => handleValidate(false)}
                            >
                                Rejeter
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
                <ToastContainer />
            </Container>        </>

    );
};

export default DevelopmentRequestDetailsView2;
