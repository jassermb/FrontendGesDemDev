import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper, Container,
    Box, CardContent, Card, Button
} from '@mui/material';

const DataDisplayPage = ({ id_demdev }) => {
    const [data, setData] = useState({ decisions: [], fournisseurs: [], articles: [], certificats: [], tasks: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    const handleDownload = (fileName) => {
        const url = `http://localhost:5000/${fileName}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const firstTaskWithAttachment = data.tasks.find(task => task.piecesJointes);

    if (loading) return <Typography variant="h6">Chargement...</Typography>;
    if (error) return <Typography variant="h6" color="error">Erreur: {error}</Typography>;

    return (

        <Container maxWidth="xl" sx={{ mt: 3 ,marginBottom:'10px' }}>
            <Paper
                elevation={3}
                sx={{ p: 3, backgroundColor: '#f0f4f7', borderTop: '2px solid #00509E' }}
            >


                <Card sx={{ p: 1.5, backgroundColor: '#fff', borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                marginBottom: 2,
                                color: '#000',
                                borderBottom: '1px solid #3f51b5',
                                paddingBottom: 1,
                            }}
                        >
                            Les Décisions Associés
                        </Typography>
                        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#E6E6FA' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Code Article</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Fournisseur</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Désignation</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Prix Unitaire</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Unites</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Origine</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.decisions.map((decision, index) => (
                                        <TableRow
                                            key={decision.id}
                                            sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}
                                        >
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{decision.id}</TableCell>
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{decision.codeArticle}</TableCell>
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{decision.fournisseur}</TableCell>
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{decision.designationArticle}</TableCell>
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{decision.prixUnitaire}</TableCell>
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{decision.unites}</TableCell>
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{decision.origine}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>



                <Card
                    sx={{
                        p: 1,
                        backgroundColor: '#ffffff',
                        borderRadius: 0.5,
                        marginTop: '20px',
                        border: 1,
                        borderColor: 'grey.300',
                        transition: 'transform 0.1s',
                        '&:hover': {
                            transform: 'scale(1.01)',
                        },
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                marginBottom: 2,
                                color: '#000',
                                borderBottom: '1px solid #3f51b5',
                                paddingBottom: 1,
                            }}
                        >
                            Fournisseurs et Articles Associés
                        </Typography>

                        <TableContainer
                            component={Paper}
                            sx={{
                                borderRadius: 2,
                                border: '1px solid #ccc',
                                overflow: 'hidden',
                                boxShadow: 1,
                            }}
                        >
                            <Table>
                                <TableHead sx={{ backgroundColor: '#E6E6FA' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Fournisseur</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Article</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Certificat</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.fournisseurs.map((fournisseur, index) => {
                                        const article = data.articles[index] || {};
                                        const certificat = data.certificats[index] || {};

                                        return (
                                            <TableRow
                                                key={fournisseur.id}
                                                sx={{
                                                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                                                    '&:hover': {
                                                        backgroundColor: '#f0f0f0',
                                                    },
                                                }}
                                            >
                                                <TableCell sx={{ textAlign: 'left', lineHeight: 1, borderRight: '0.5px solid #ccc ' }}>
                                                    {fournisseur.nom_fournisseur || 'N/A'}
                                                </TableCell>
                                                <TableCell sx={{ textAlign: 'left', lineHeight: 1, borderRight: '0.5px solid #ccc ' }}>
                                                    {article.nom_article || 'N/A'}
                                                </TableCell>
                                                <TableCell sx={{ textAlign: 'left', lineHeight: 1, borderRight: '0.5px solid #ccc ' }}>
                                                    {certificat.nom_certificat || 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>




                <Card
                    sx={{
                        p: 1,
                        backgroundColor: '#ffffff',
                        borderRadius: 1,
                        border: 0.5,
                        marginTop: '20px',
                        marginBottom: '20px',
                        borderColor: 'grey.300',
                        boxShadow: 1,
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'scale(1.01)',
                        },
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                marginBottom: 2,
                                color: '#000',
                                borderBottom: '1px solid #3f51b5',
                                paddingBottom: 1,
                            }}
                        >
                            Liste des Tâches
                        </Typography>
                        <TableContainer
                            component={Paper}
                            sx={{
                                borderRadius: 2,
                                border: '1px solid #ccc',
                                overflow: 'hidden',
                                boxShadow: 1,
                            }}
                        >
                            <Table>
                                <TableHead sx={{ backgroundColor: '#E6E6FA' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Tâche</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Échéance</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Qui ?</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Suivi</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>Validation</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.tasks.map((task, index) => (
                                        <TableRow
                                            key={task.id}
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                                                '&:hover': {
                                                    backgroundColor: '#f0f0f0',
                                                },
                                            }}
                                        >
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{task.id}</TableCell>
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{task.task}</TableCell>
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{task.echeance}</TableCell>
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{task.qui}</TableCell>
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{task.suivi}</TableCell>
                                            <TableCell sx={{ textAlign: 'left', borderRight: '0.5px solid #ccc ' }}>{task.validation}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {firstTaskWithAttachment && (
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',border:'0.5px solid #ccc',borderRadius: 1 ,padding:'5px' }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 0,
                                        fontWeight: 'bold', // Bold for emphasis
                                        color: '#3f51b5' // Consistent color with the theme
                                    }}
                                >
                                    Fiche de test et validation du prototype
                                </Typography>
                                <Button
                                    variant="outlined" // Changed to outlined for a less intrusive look
                                    color="primary"
                                    onClick={() => handleDownload(firstTaskWithAttachment.piecesJointes)}
                                    sx={{
                                        textTransform: 'none',
                                        padding: '4px 8px', 
                                        borderRadius: 1, 
                                        '&:hover': {
                                            backgroundColor: 'rgba(63, 81, 181, 0.1)', // Light background on hover
                                        },
                                    }}
                                >
                                    Télécharger
                                </Button>
                            </Box>
                        )}

                    </CardContent>
                </Card>

            </Paper>
        </Container>

    );
};

export default DataDisplayPage;
