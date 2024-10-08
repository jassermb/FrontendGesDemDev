import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Card, Button, Table, Form, Alert } from 'react-bootstrap';
import Tooltip from '@mui/material/Tooltip';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { FaArrowLeft } from 'react-icons/fa';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    TableCell, Paper, Grid, Typography,
} from '@mui/material';
const Consulterdd = () => {
    const { id } = useParams();
    const [developmentRequest, setDevelopmentRequest] = useState(null);

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

    const parsedRaisonDevelopment = JSON.parse(developmentRequest.raisonDevelopment || '[]');

    // Fonction pour revenir en arrière
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

            <Container fluid className="mt-4" style={{ marginBottom: '20px' }}>

                <Card style={{ borderBottom: '1px solid #243242' }}>
                    <Card.Header as="h5" style={{
                        backgroundColor: '#243242',
                        color: '#FFFFFF',
                        borderBottom: '2px solid black'
                    }}>
                        Consultation de la Demande de Développement - Deuxième Partie

                    </Card.Header>
                    <Card.Body>
                        <Table bordered hover responsive>
                            <tbody>
                                <tr>
                                    <th style={{ backgroundColor: '#C0C0C0' }}>Code</th>
                                    <td>{developmentRequest.code}</td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#C0C0C0' }}>Date de Création</th>
                                    <td>{new Date(developmentRequest.dateCreation).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#C0C0C0' }}>Date Objectif Mise en Industrialisation </th>
                                    <td>{new Date(developmentRequest.dateObjectifMiseEnIndustrialisation).toLocaleDateString()}</td>
                                </tr>
                                <tr>
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
                                </tr>

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

                        <h5 className="mt-4">Données de Base Associées</h5>
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


                    </Card.Body>
                </Card>
                <ToastContainer />
            </Container>        </>

    );
};

export default Consulterdd;
