import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Description as FileIcon } from '@mui/icons-material';
import { FaFileDownload } from 'react-icons/fa';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InputAdornment from '@mui/material/InputAdornment';
import DevelopmentRequestDetails from '../dem/part2form';
import Developmentpart1RequestDetails from '../dem/part1form';
import { FaArrowLeft } from 'react-icons/fa';
import {
    Container, CardHeader, CardActions, Select,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Divider, Grid, Tooltip,
    Button,
    TextField,
    Card,
    CardContent,
    Box, FormControl, MenuItem
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
const Form4 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionReason, setShowRejectionReason] = useState(false);
    const [comment, setComment] = useState('');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const [visibleCards, setVisibleCards] = useState(3);
    const [showMore, setShowMore] = useState(true);
    const [decision, setDecision] = useState(null);
    const handleShowMore = () => {
        setVisibleCards((prevVisible) => prevVisible + 3);
        setShowMore(true);
    };
    const handleShowLess = () => {
        setVisibleCards((prevVisible) => Math.max(prevVisible - 3, 3));
        setShowMore(false);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/demdevp3/soumettre-demandepart3/${id}`);
                setData(response.data);
                if (response.data.decisions && response.data.decisions.length > 0) {
                    setDecision(response.data.decisions[0].decision);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);
    const [formData, setFormData] = useState({
        dateCloture: '',
        appreciationCloture: '',
        gainFinal: '',
        selectedUnitr: 'EUR (€)',
        unitsr: ['unité', 'EUR (€)', 'USD ($)', 'GBP (£)', 'TND'],
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const gainFinalWithUnit = `${formData.gainFinal} ${formData.selectedUnitr}`;
        const statut = 'Clôturée par chef produit'; 
        const validationData = {
            Validationchefprod: true,  
            status: statut,
        };

        try {
            const [clotureResponse, validationResponse] = await Promise.all([
                axios.put(`http://localhost:5000/api/demdev/demande1-developpement2/${id}`, {
                    dateCloture: formData.dateCloture,
                    appreciationCloture: formData.appreciationCloture,
                    gainFinal: gainFinalWithUnit,
                }),
                axios.put(`http://localhost:5000/api/users/validationchefprod/${id}`, validationData)
            ]);

            if (clotureResponse.status === 200 && validationResponse.status === 200) {
                toast.success('La demande de développement a été clôturée avec succès par le Chef de Produit', {
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
                const notificationResponse = await fetch('http://localhost:5000/api/users/create-notification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        userId: localStorage.getItem('userId'),
                        role: localStorage.getItem('role'),
                        receiverRole: 'coo',
                        type: 'Clôture chef produit',
                        message: `La demande de développement  est clôturée par le chef de produit.`,
                        id_dem: id,
                    })
                });

                if (notificationResponse.ok) {
                    console.log('Notification envoyée avec succès');
                } else {
                    console.error('Erreur lors de l\'envoi de la notification.');
                    toast.error('Erreur lors de la création de la notification.');
                }


            } else {
                throw new Error('Échec de la validation ou de la clôture.');
            }

        } catch (error) {
            console.error('Erreur lors de la clôture/validation:', error);
            toast.error('Erreur lors de la clôture de la demande de développement');
        }
    };

    const CertificationSection = ({ data, decision }) => {
        return (
            <div style={{
                padding: '5px',
                backgroundColor: '#fffff',
                marginBottom: '10px'
            }}>
                {data?.decisions && data.decisions.length > 0 && decision !== null && (
                    <Card style={{
                        marginBottom: '10px',
                    }}>
                        <CardHeader
                            title={<Typography variant="h6" style={{ color: '#3f51b5' }}>Fichiers de Certification des Articles</Typography>}
                            style={{ backgroundColor: '#E6E6FA', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', padding: '5px', borderBottom: '1px solid #ccc' }}
                        />
                        <CardContent>

                            <Grid container spacing={2}>
                                {renderCertificationFiles(data.decisions)}
                            </Grid>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    };

    const renderCertificationFiles = (decisions) => {
        const decisionObject = decisions.find(decisionItem => decisionItem.decision === decision);

        if (!decisionObject) {
            return <Typography>Aucune décision trouvée pour cette condition</Typography>;
        }

        let certifications = [];
        try {
            certifications = JSON.parse(decisionObject.certificationsart);
        } catch (error) {
            return <Typography>Erreur lors du chargement des fichiers de certification</Typography>;
        }

        if (certifications.length === 0) {
            return <Typography>Aucun fichier de certification disponible</Typography>;
        }

        return certifications.map((file, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Card style={{
                    padding: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    borderRadius: '7px', border: '1px solid #ccc',

                    transition: '0.3s',
                    '&:hover': {
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        transform: 'scale(1.02)',
                    }
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <Typography variant="h6" style={{ color: '#333', fontWeight: '600', fontSize: '14px' }}>
                            {`Fichier ${index + 1}: ${file.split('/').pop()}`}
                        </Typography>
                        <a
                            href={`http://localhost:5000/${file.replace(/\\/g, '/')}`}

                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                marginLeft: '10px',
                                color: '#007bff',
                                textDecoration: 'none',
                            }}
                        >
                            <FaFileDownload
                                style={{
                                    fontSize: '24px',
                                    transition: 'color 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = '#32CD32	'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#007bff'}
                            />
                        </a>
                    </div>
                </Card>
            </Grid>
        ));
    };




    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">Erreur : {error}</Alert>;
    if (!data) return <Typography>Aucune donnée disponible.</Typography>;
    const firstTaskWithAttachment = data.tasks.find(task => task.piecesJointes);

    return (
        <>
            <Developmentpart1RequestDetails requestId={id} />
            <DevelopmentRequestDetails requestId={id} />
            <Container
                fluid
                className="mt-3"
                style={{
                    marginTop: '-20px',
                    backgroundColor: '#fff',
                    padding: '10px',
                    borderRadius: '8px',
                    maxWidth: '100%',
                    width: '95%',
                    marginLeft: 'auto',
                    marginRight: 'auto', marginBottom: '10px', borderBottom: '1px solid #243242'
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    style={{
                        backgroundColor: '#243242',
                        color: '#FFFFFF',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                        borderBottom: '2px solid black',
                        padding: '7px',
                        margin: '-10px',
                        paddingLeft: '20px',
                        marginBottom: '10px'
                    }}
                >
                    Clôture de la Demande de Développement            </Typography>
                <Card style={{ border: 'none', boxShadow: 'none' }}>
                    <Divider style={{ marginBottom: '20px' }} />
                    <Card sx={{ mb: 3, borderRadius: '8px', boxShadow: 6, borderTop: '1px solid #D3D3D3' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ marginBottom: '16px', color: '#3f51b5', paddingLeft: '10px', borderBottom: '1px solid #243242', paddingBottom: '5px' }}>
                                Liste des tâches à réaliser
                            </Typography>
                            <TableContainer component={Paper} sx={{ borderRadius: '8px', border: '1px solid #ccc', overflow: 'hidden' }}>
                                <Table>
                                    <TableHead style={{ backgroundColor: '#E6E6FA' }}>
                                        <TableRow style={{ height: '40px' }}>
                                            <TableCell style={{
                                                borderRight: '1px solid #d9d9d9',
                                                padding: '8px',
                                                textAlign: 'left',
                                                fontWeight: '400',
                                                paddingLeft: '15px',
                                                color: '#4a4a4a',
                                                fontSize: '14px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px', borderBottom: '1px solid black'
                                            }}><strong>Tâche</strong></TableCell>
                                            <TableCell style={{
                                                borderRight: '1px solid #d9d9d9',
                                                padding: '8px',
                                                textAlign: 'left',
                                                fontWeight: '400',
                                                paddingLeft: '15px'
                                                , borderBottom: '1px solid black',
                                                color: '#4a4a4a',
                                                fontSize: '14px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}><strong>Échéance</strong></TableCell>
                                            <TableCell style={{
                                                borderRight: '1px solid #d9d9d9',
                                                padding: '8px',
                                                textAlign: 'left',
                                                paddingLeft: '15px',
                                                fontWeight: '400',
                                                color: '#4a4a4a',
                                                fontSize: '14px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px', borderBottom: '1px solid black'
                                            }}><strong>Assigné à</strong></TableCell>
                                            <TableCell style={{
                                                borderRight: '1px solid #d9d9d9',
                                                padding: '8px',
                                                textAlign: 'left',
                                                fontWeight: '400',
                                                paddingLeft: '15px',

                                                color: '#4a4a4a',
                                                fontSize: '14px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px', borderBottom: '1px solid black'
                                            }}><strong>Suivi</strong></TableCell>
                                            <TableCell style={{
                                                borderRight: '1px solid #d9d9d9',
                                                padding: '8px',
                                                textAlign: 'left',
                                                fontWeight: '400',
                                                paddingLeft: '15px',

                                                color: '#4a4a4a',
                                                fontSize: '14px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px', borderBottom: '1px solid black'
                                            }}><strong>Validation</strong></TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {data.tasks.map((task, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                                                    '&:hover': {
                                                        backgroundColor: '#d9e7ff', // Couleur lors du survol
                                                    },
                                                }}
                                            >                                            <TableCell>{task.task}</TableCell>
                                                <TableCell style={{ borderLeft: '1px solid #ccc', lineHeight: '1', }}>{new Date(task.echeance).toLocaleDateString()}</TableCell>
                                                <TableCell style={{ borderLeft: '1px solid #ccc', lineHeight: '1', }}>{task.qui}</TableCell>
                                                <TableCell style={{ borderLeft: '1px solid #ccc', lineHeight: '1', }}>{new Date(task.suivi).toLocaleDateString()}</TableCell>
                                                <TableCell style={{ borderLeft: '1px solid #ccc', lineHeight: '1', }}>{task.validation}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Grid
                                container
                                alignItems="center"
                                sx={{
                                    marginBottom: '10px',
                                    marginTop: '15px',
                                    padding: '10px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc'
                                }}
                            >
                                <Grid item xs={10} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontSize: '0.9rem',
                                            color: '#3f51b5',
                                        }}
                                    >
                                        Fiche de test et validation du prototype
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                                    {firstTaskWithAttachment && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<FileIcon />}
                                            component="a"
                                            href={`http://localhost:5000/${firstTaskWithAttachment.piecesJointes.replace(/\\/g, '/')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                textTransform: 'none',
                                                color: '#FFFFFF',
                                                fontSize: '0.8rem',
                                                padding: '4px 8px',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                borderRadius: '6px',
                                                '&:hover': {
                                                    backgroundColor: '#243242',
                                                },
                                            }}
                                        >
                                            Télécharger
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card sx={{ mb: 3, borderRadius: '8px', boxShadow: 6, padding: '20px', borderTop: '1px solid #D3D3D3' }}>
                        <Container maxWidth="xl">
                            <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5', marginLeft: '-30px', paddingLeft: '10px', borderBottom: '1px solid #243242', paddingBottom: '5px', marginBottom: '10px' }}>
                                Les Décisions Associées
                            </Typography>
                            <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
                                {data.decisions.slice(0, visibleCards).map((decision) => (
                                    <Grid item xs={12} sm={6} md={4} key={decision.id}>
                                        <Card sx={{ borderRadius: '12px', boxShadow: 2, overflow: 'hidden', height: '100%', backgroundColor: '#F8F8FF' }}>
                                            <CardContent>

                                                <TableContainer component={Paper} sx={{ borderRadius: '4px', border: '1px solid #ccc' }}>
                                                    <Table>
                                                        <TableBody>
                                                            {[
                                                                { key: 'Code Article', value: decision.codeArticle },
                                                                { key: 'Code Fournisseur', value: decision.codeFournisseur },
                                                                { key: 'Fournisseur', value: decision.fournisseur },
                                                                { key: 'Désignation Article', value: decision.designationArticle },
                                                                { key: 'Désignation Fournisseur', value: decision.designationFournisseur },
                                                                {
                                                                    key: 'Prix Unitaire',
                                                                    value: `${decision.prixUnitaire ? `${decision.prixUnitaire} ${decision.unites}` : 'N/A'}`,
                                                                },
                                                                { key: 'Origine', value: decision.origine },
                                                                { key: 'MOQ', value: decision.moq },
                                                                { key: 'Seuil de réapprovisionnement', value: decision.seuilAppro },
                                                                {
                                                                    key: 'Décision',
                                                                    value: (
                                                                        <>
                                                                            {decision.decision === 1 ? (
                                                                                <CheckCircleIcon sx={{ color: 'green' }} />
                                                                            ) : (
                                                                                <CancelIcon sx={{ color: 'red' }} />
                                                                            )}
                                                                        </>
                                                                    )
                                                                }
                                                            ].map((item, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell
                                                                        sx={{
                                                                            fontWeight: 'bold',
                                                                            whiteSpace: 'nowrap',
                                                                            backgroundColor: '#E6E6FA',
                                                                            border: '1px solid #ccc',
                                                                            width: '150px',
                                                                            padding: '6px 12px',
                                                                        }}
                                                                    >
                                                                        {item.key}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        sx={{
                                                                            maxWidth: '200px',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap',
                                                                            padding: '6px 12px',
                                                                            border: '1px solid #ccc',
                                                                        }}
                                                                    >
                                                                        <Tooltip title={item.value} arrow placement="bottom"
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
                                                                            <span>{item.value && item.value.length > 15 ? `${item.value.slice(0, 15)}...` : item.value}</span>
                                                                        </Tooltip>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            {(data.decisions.length > visibleCards || visibleCards > 3) && (
                                <Box mt={4} display="flex" justifyContent="center" gap={2}>
                                    {data.decisions.length > visibleCards && (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={handleShowMore}
                                            endIcon={<ExpandMoreIcon />}
                                            sx={{
                                                borderRadius: '8px',
                                                padding: '6px 12px',
                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                backgroundColor: '#ffffff',
                                                '&:hover': {
                                                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                                                    backgroundColor: '#f0f0f0',
                                                },
                                            }}
                                        >     Afficher Plus
                                        </Button>
                                    )}
                                    {visibleCards > 3 && (
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={handleShowLess}
                                            endIcon={<ExpandLessIcon />}
                                            sx={{
                                                borderRadius: '8px',
                                                padding: '6px 12px',
                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                backgroundColor: '#ffffff',
                                                '&:hover': {
                                                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                                                    backgroundColor: '#f0f0f0',
                                                },
                                            }}
                                        >
                                            Afficher Moins
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Container>
                    </Card>


                    <CertificationSection data={data} decision={decision} />


                    <div className="close-development-request-container">
                        <Paper elevation={3} sx={{ padding: 2, margin: 'auto' }}>

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3} style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Appréciation de Clôture"
                                            name="appreciationCloture"
                                            value={formData.appreciationCloture}
                                            onChange={handleChange}
                                            required
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            helperText="Veuillez donner une brève appréciation."
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <TextField
                                                fullWidth
                                                name="gainFinal"
                                                type="number"
                                                value={formData.gainFinal}
                                                onChange={handleChange}
                                                label="Gain Final *"
                                                variant="outlined"
                                                helperText="Indiquez le gain final."

                                                size="small"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <FormControl size="small">
                                                                <Select
                                                                    name="selectedUnitG"
                                                                    value={formData.selectedUnitr}
                                                                    onChange={handleChange}
                                                                    IconComponent={() => (
                                                                        <Tooltip title="Sélectionner l'unité">
                                                                            <ExpandMoreIcon
                                                                                sx={{ cursor: 'pointer' }}
                                                                                onClick={(event) => {
                                                                                    event.stopPropagation();
                                                                                    event.currentTarget.parentNode.click();
                                                                                }}
                                                                            />
                                                                        </Tooltip>
                                                                    )}
                                                                    displayEmpty
                                                                    sx={{
                                                                        minWidth: 60,
                                                                        '& .MuiSelect-select': { paddingRight: 0 },
                                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                                            border: 'none',
                                                                            borderLeft: '1px solid black'
                                                                        },
                                                                    }}
                                                                >
                                                                    {formData.unitsr.map((unit, index) => (
                                                                        <MenuItem key={index} value={unit}>
                                                                            {unit}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiInputBase-root': { fontSize: '14px', borderRadius: '4px', paddingRight: '8px' },
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
                                                        '&:hover fieldset': { borderColor: '#3f51b5' },
                                                        '&.Mui-focused fieldset': { borderColor: '#3f51b5' },
                                                    },
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Date de Clôture"
                                            type="date"
                                            name="dateCloture"
                                            value={formData.dateCloture}
                                            onChange={handleChange}
                                            required
                                            size="small"

                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                            helperText="Sélectionnez la date de clôture."
                                        />
                                    </Grid>
                                </Grid>


                                <Grid container justifyContent="center" style={{ marginTop: '20px', marginBottom: '-10px' }}>
                                    <Grid item xs={12} sm={3}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            type="submit"
                                            sx={{
                                                padding: '5px 8px',
                                                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.15)',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                transition: 'background-color 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: '#1976d2',
                                                },
                                                margin: '0 auto',
                                            }}
                                        >
                                            Soumettre
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                        <ToastContainer />
                    </div>
                </Card>
                <ToastContainer />

            </Container>
        </>
    );
};

export default Form4;
