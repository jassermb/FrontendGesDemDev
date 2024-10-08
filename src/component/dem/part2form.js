import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Grid, Paper, Container, Divider, Box, Card, CardContent, CircularProgress, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import StorageIcon from '@mui/icons-material/Storage'; import { format } from 'date-fns';
import Tooltip from '@mui/material/Tooltip'
const DevelopmentRequestDetails = ({ requestId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/demdev/demdev2/${requestId}`);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des données', error);
                setError('Erreur lors de la récupération des données');
                setLoading(false);
            }
        };
        fetchData();
    }, [requestId]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    const formattedDateCreation = format(new Date(data.dateCreation), 'dd/MM/yyyy');
    const risquesImpacts = data.RisqueImpact ? JSON.parse(data.RisqueImpact) : [];
    const donneesDeBase = data.donneesDeBase || [];
    const handleShowMore = () => {
        setVisibleCount((prevCount) => Math.min(prevCount + 3, donneesDeBase.length));
    };

    const handleShowLess = () => {
        setVisibleCount((prevCount) => Math.max(prevCount - 3, 3));
    };
    return (
        <Container maxWidth="xl" sx={{ marginTop: '20px' }}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#f0f4f7', borderTop: '2px solid #00509E' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: '#000', borderBottom: '1px ridge #00509E', paddingLeft: '15px', paddingBottom: '5px' }}>
                    Détails de la Demande de Développement
                </Typography>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ marginY: '20px', fontWeight: 'bold', color: '#000' }}
                >
                    Données de Base
                </Typography>
                <Card
                    sx={{
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff',
                        padding: '10px',
                        margin: '16px 0',
                    }}
                >
                    <CardContent>
                        <Grid container spacing={2}>
                            {donneesDeBase.slice(0, visibleCount).map((item, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        sx={{
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            backgroundColor: '#fff',
                                            padding: '16px',
                                            maxHeight: '400px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',

                                        }}
                                    >

                                        <CardContent sx={{ padding: '0' }}>
                                        <Box display="flex" alignItems="center" mb={1}>
                                        <StorageIcon sx={{ color: 'primary.main', marginRight: '8px' }} />
                                                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                                                Données de Base  {index + 1}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    marginBottom: '12px',
                                                    color: '#333',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                Code Windeco: {item.Codewindeco}
                                            </Typography>
                                            <Tooltip title={item.designation || 'Non spécifié'} arrow placement="bottom"
                                                componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            backgroundColor: '#2C3E50',
                                                            color: '#ecf0f1',
                                                            fontSize: '14px',
                                                            padding: '10px 16px',
                                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                            borderRadius: '5px',
                                                            maxWidth: '300px',
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
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        marginBottom: '8px',
                                                        color: '#555',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    <strong>Désignation:</strong> {item.designation || 'Non spécifié'}
                                                </Typography>
                                            </Tooltip>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    marginBottom: '8px',
                                                    color: '#555',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                <strong>Consommation Annuelle 2024:</strong>{' '}
                                                {item.consommationAnnuelle2024 || 'Non spécifié'}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{ marginBottom: '8px', color: '#555' }}
                                            >
                                                <strong>Prix Actuel:</strong> {item.prixActuel || 'Non spécifié'}
                                            </Typography>

                                            <Tooltip title={item.fournisseur || 'Non spécifié'} arrow placement="bottom"
                                                componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            backgroundColor: '#2C3E50',
                                                            color: '#ecf0f1',
                                                            fontSize: '14px',
                                                            padding: '10px 16px',
                                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                            borderRadius: '5px',
                                                            maxWidth: '300px',
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
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        marginBottom: '8px',
                                                        color: '#555',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    <strong>Fournisseur:</strong> {item.fournisseur || 'Non spécifié'}
                                                </Typography>
                                            </Tooltip>

                                            <Tooltip title={item.designationFournisseur || 'Non spécifié'} arrow placement="bottom"
                                                componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            backgroundColor: '#2C3E50',
                                                            color: '#ecf0f1',
                                                            fontSize: '14px',
                                                            padding: '10px 16px',
                                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                            borderRadius: '5px',
                                                            maxWidth: '300px',
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
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        marginBottom: '8px',
                                                        color: '#555',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    <strong>Désignation Fournisseur:</strong>{' '}
                                                    {item.designationFournisseur || 'Non spécifié'}
                                                </Typography>
                                            </Tooltip>

                                            <Tooltip title={item.documentsQualite || 'Non spécifié'} arrow placement="bottom"
                                                componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            backgroundColor: '#2C3E50',
                                                            color: '#ecf0f1',
                                                            fontSize: '14px',
                                                            padding: '10px 16px',
                                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                            borderRadius: '5px',
                                                            maxWidth: '300px',
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
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#555',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    <strong>Documents Qualité:</strong>{' '}
                                                    {item.documentsQualite || 'Non spécifié'}
                                                </Typography>
                                            </Tooltip>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Box textAlign="center" marginTop="16px">
                            {visibleCount < donneesDeBase.length && (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleShowMore}
                                    startIcon={<ExpandMoreIcon />}
                                    sx={{ marginRight: '8px', borderRadius: '20px' }}
                                >
                                    Afficher plus
                                </Button>
                            )}

                            {visibleCount > 3 && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleShowLess}
                                    startIcon={<ExpandLessIcon />}
                                    sx={{ borderRadius: '20px' }}
                                >
                                    Afficher moins
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>
                <Grid item xs={12} sm={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            borderRadius: 1,
                            padding: 2,
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            minHeight: '80px',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': { transform: 'scale(1.02)' },
                        }}
                    >
                        <Box display="flex" alignItems="center">
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    sx={{ marginBottom: '4px', fontWeight: 'bold' }}
                                >
                                    Estimation de Vente
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#333' }}>
                                    {data.estimationDeVente}
                                </Typography>
                            </Box>

                        </Box>
                    </Paper>
                </Grid>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ marginY: '16px', fontWeight: 'bold', color: '#000' }}
                >
                    Étude des Risques & Impacts
                </Typography>
                <Grid item xs={12}>
                    <Card sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '5px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
                        backgroundColor: '#ffffff',
                        padding: '16px',
                    }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                {risquesImpacts.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Box sx={{
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '5px',
                                            padding: '12px',
                                            backgroundColor: '#f9f9f9',
                                            transition: 'transform 0.2s ease-in-out',
                                            '&:hover': { transform: 'scale(1.02)' }
                                        }}>
                                            <Box display="flex" alignItems="center" mb={1}>
                                                <WarningIcon sx={{ color: 'primary.main', marginRight: '8px' }} />
                                                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                                                    Risque {index + 1}
                                                </Typography>
                                            </Box>

                                            <Tooltip title={item.description || 'Non spécifié'} arrow placement="bottom"
                                                componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            backgroundColor: '#2C3E50',
                                                            color: '#ecf0f1',
                                                            fontSize: '14px',
                                                            padding: '10px 16px',
                                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                            borderRadius: '5px',
                                                            maxWidth: '300px',
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
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        marginBottom: '6px',
                                                        lineHeight: '1.5',
                                                        color: '#666',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <strong>Description:</strong> {item.description || 'Non spécifié'}
                                                </Typography>
                                            </Tooltip>

                                            <Typography variant="body2" sx={{ marginBottom: '6px', lineHeight: '1.5', color: '#666' }}>
                                                <strong>Gravité:</strong> {item.gravite || 'Non spécifié'}
                                            </Typography>

                                            <Tooltip title={item.planAction || 'Non spécifié'} arrow placement="bottom"
                                                componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            backgroundColor: '#2C3E50',
                                                            color: '#ecf0f1',
                                                            fontSize: '14px',
                                                            padding: '10px 16px',
                                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                            borderRadius: '5px',
                                                            maxWidth: '300px',
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
                                                <Box display="flex" alignItems="center">
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            lineHeight: '1.5',
                                                            color: '#666',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <strong>Plan d'Action:</strong> {item.planAction || 'Non spécifié'}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            marginTop: '20px',
                            borderRadius: 1,
                            padding: 2,
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            minHeight: '80px',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': { transform: 'scale(1.02)' },
                        }}
                    >
                        <Box display="flex" alignItems="center">
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    sx={{ marginBottom: '4px', fontWeight: 'bold' }}
                                >
                                    Estimation de Gain Annuel
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#333' }}>
                                    {data.estimationDeGain}
                                </Typography>
                            </Box>

                        </Box>
                    </Paper>
                </Grid>


            </Paper>
        </Container >
    );
};

export default DevelopmentRequestDetails;
