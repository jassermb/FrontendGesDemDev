import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import {
    Container,
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
    Divider,
    Button,
    Card,
    CardContent,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

const Validation3DemandeCOO777 = () => {
    const { id_demdev } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionReason, setShowRejectionReason] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/demdevp3/soumettre-demandepart3/${id_demdev}`);
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id_demdev]);

    const handleValidation = async (isValid) => {
        try {
            const validationStatus = isValid ? 'validé COO' : 'refusé COO';
            const status = isValid ? 'validé 2 (COO)' : 'Non validé 2 (COO)';

            if (!isValid && rejectionReason.trim() === '') {
                toast.error('Le commentaire est obligatoire si vous refusez la demande.', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  });
                return;
            }

            await axios.put(`http://localhost:5000/api/users/validationCOO/${id_demdev}`, { validationCOO:validationStatus, status });

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

            const message = `La demande de développement a été ${validationStatus}.`;
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            };

            await axios.post(
                'http://localhost:5000/api/users/create-notification',
                {
                    userId: localStorage.getItem('userId'),
                    role: localStorage.getItem('role'),
                    receiverRole: 'chefdeproduit',
                    type: isValid ? 'validation2COO' : 'rejet2COO',
                    message,
                    id_dem: id_demdev,
                },
                { headers }
            );

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

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">Erreur : {error}</Alert>;
    if (!data) return <Typography>Aucune donnée disponible.</Typography>;

    return (
        <Container maxWidth="xl" style={{ marginTop: '20px', padding: '0 3%', backgroundColor: '#fff' }}>
            <Card sx={{ border: 'none', boxShadow: 3, marginBottom: '20px' }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        backgroundColor: '#243242',
                        color: '#FFFFFF',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                        borderBottom: '2px solid black',
                        padding: '10px 20px',
                        marginBottom: '5px',
                    }}
                >
                    Validation de la 3ème Partie de la Demande de Développement (coo)
                </Typography>

                <Divider sx={{ marginBottom: '20px' }} />

                {/* Section Fournisseurs et Articles */}
                <Card sx={{ mb: 3, borderRadius: '8px', boxShadow: 6 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Fournisseurs et Articles Associés
                        </Typography>
                        <TableContainer component={Paper} sx={{ borderRadius: '8px', border: '1px solid #ccc' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Numéro de Fournisseur</strong></TableCell>
                                        <TableCell style={{ borderLeft: '1px solid #ccc' }}><strong>Fournisseur</strong></TableCell>
                                        <TableCell style={{ borderLeft: '1px solid #ccc' }}><strong>Article</strong></TableCell>
                                        <TableCell style={{ borderLeft: '1px solid #ccc' }}><strong>Certificat</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {['1', '2', '3'].map((num) => {
                                        const fournisseur = data.formData[`fournisseur${num}`];
                                        const article = data.formData[`article${num}`];
                                        const certificat = data.formData[`certificat${num}`];

                                        if (fournisseur || article || certificat) {
                                            return (
                                                <TableRow key={num}>
                                                    <TableCell>{num}</TableCell>
                                                    <TableCell style={{ borderLeft: '1px solid #ccc' }}>{fournisseur || 'N/A'}</TableCell>
                                                    <TableCell style={{ borderLeft: '1px solid #ccc' }}>{article || 'N/A'}</TableCell>
                                                    <TableCell style={{ borderLeft: '1px solid #ccc' }}>{certificat || 'N/A'}</TableCell>
                                                </TableRow>
                                            );
                                        }

                                        return null;
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Section Tâches Associées */}
                <Card sx={{ mb: 3, borderRadius: '8px', boxShadow: 6 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Tâches Associées
                        </Typography>
                        <TableContainer component={Paper} sx={{ borderRadius: '8px', border: '1px solid #ccc' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Tâche</strong></TableCell>
                                        <TableCell style={{ borderLeft: '1px solid #ccc' }}><strong>Échéance</strong></TableCell>
                                        <TableCell style={{ borderLeft: '1px solid #ccc' }}><strong>Assigné à</strong></TableCell>
                                        <TableCell style={{ borderLeft: '1px solid #ccc' }}><strong>Suivi</strong></TableCell>
                                        <TableCell style={{ borderLeft: '1px solid #ccc' }}><strong>Validation</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.tasks.map((task, index) => (
                                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                                            <TableCell>{task.task}</TableCell>
                                            <TableCell style={{ borderLeft: '1px solid #ccc' }}>{new Date(task.echeance).toLocaleDateString()}</TableCell>
                                            <TableCell style={{ borderLeft: '1px solid #ccc' }}>{task.qui}</TableCell>
                                            <TableCell style={{ borderLeft: '1px solid #ccc' }}>{new Date(task.suivi).toLocaleDateString()}</TableCell>
                                            <TableCell style={{ borderLeft: '1px solid #ccc' }}>{task.validation}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Section Détails de la Décision */}
                <Card sx={{ mb: 3, borderRadius: '8px', boxShadow: 6 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Détails de la Décision
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <TableContainer component={Paper} sx={{ borderRadius: '8px', border: '1px solid #ccc' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {/* <TableCell><strong>Champ</strong></TableCell>
                                    <TableCell><strong>Valeur</strong></TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {[
                                        { key: 'Code Article', value: data.formData.codeArticle },
                                        { key: 'Code Fournisseur', value: data.formData.codeFournisseur },
                                        { key: 'Fournisseur', value: data.formData.fournisseur },
                                        { key: 'Désignation Article', value: data.formData.designationArticle },
                                        { key: 'Désignation Fournisseur', value: data.formData.designationFournisseur },
                                        {
                                            key: 'Prix Unitaire',
                                            value: `${data.formData.prixUnitaire ? `${data.formData.prixUnitaire} ${data.formData.unites}` : 'N/A'}`,
                                        }, { key: 'Origine', value: data.formData.origine }, { key: 'MOQ', value: data.formData.moq }, { key: ' Seuil de réapprovisionnement', value: data.formData.seuilAppro }

                                    ].map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell style={{ fontWeight: 'bold', width: '50%' }}>{item.key}</TableCell>
                                            <TableCell style={{ borderLeft: '1px solid #ccc' }}>{item.value || 'N/A'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Boutons de Validation/Refus */}
                <Box display="flex" justifyContent="center" gap={6} sx={{ mb: 3 }}>
                    <Button
                        sx={{
                            backgroundColor: '#4CAF50', 
                            color: '#FFFFFF',
                            ':hover': {
                                backgroundColor: '#3A9D23' 
                            },
                            borderRadius: '10px', 
                            boxShadow: 3, 
                            fontWeight: 'bold',
                            padding: '5px',
                            width: '130px'
                        }}
                        startIcon={<CheckCircleIcon style={{ marginRight: '5px' }} />} 
                        onClick={() => handleValidation(true)}
                    >
                        Valider
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: '#F44336',
                            color: '#FFFFFF',
                            ':hover': {
                                backgroundColor: '#FF0000' 
                            },
                            borderRadius: '10px', 
                            boxShadow: 3, 
                            fontWeight: 'bold',
                            padding: '5px',
                            width: '130px'
                        }}
                        startIcon={<CancelIcon style={{ marginRight: '5px' }} />} 
                        onClick={() => setShowRejectionReason(true)}
                    >
                        Refuser
                    </Button>
                </Box>

            </Card>


            

            <Dialog
                open={showRejectionReason}
                onClose={() => setShowRejectionReason(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '12px', 
                        boxShadow: 24, 
                        maxWidth: '600px', 
                        width: '80%', 
                    },
                }}
              >
                <DialogTitle
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        borderBottom: '1px solid #e0e0e0',
                        padding: '16px 24px', 
                    }}
                >
                    <Box display="flex" alignItems="center">
                        Veuillez indiquer la raison du rejet (obligatoire) :
                    </Box>
                </DialogTitle>
                <DialogContent
                    sx={{
                        padding: '24px', 
                    }}
                >
                    <TextField
                        multiline
                        rows={5} 
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{
                            borderRadius: '5px',
                            boxShadow: 1, 
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                            },
                        }}
                        placeholder="Veuillez entrer le motif du rejet ici..."
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        padding: '16px 24px', 
                        justifyContent: 'space-between', 
                    }}
                >
                    <Button
                        onClick={() => setShowRejectionReason(false)}
                        color="primary"
                        variant="outlined"
                        sx={{
                            borderRadius: '5px',
                            padding: '4px 6px', 
                            boxShadow: 1,
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                            fontSize: '0.875rem', 
                        }}
                        startIcon={<CancelIcon />}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={() => {
                            handleValidation(false);
                            setShowRejectionReason(false);
                        }}
                        color="error"
                        variant="contained"
                        sx={{
                            borderRadius: '8px',
                            padding: '4px 6px', 
                            boxShadow: 1,
                            '&:hover': {
                                backgroundColor: '#d32f2f',
                            },
                            fontSize: '0.875rem', 
                        }}
                        startIcon={<CheckCircleIcon />}
                    >
                        Confirmer le Rejet
                    </Button>
                </DialogActions>
            </Dialog>


            <ToastContainer />
        </Container>
    );
};

export default Validation3DemandeCOO777;
