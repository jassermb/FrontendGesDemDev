import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Typography, Grid, TextField, Button, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, InputLabel, FormControl, Select,
    MenuItem, Container
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';

const Modificationpart3cooPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // const [data, setData] = useState({});
    const [data, setData] = useState({
        fournisseur1: '',
        fournisseur2: '',
        fournisseur3: '',
        article1: '',
        article2: '',
        article3: '',
        certificat1: '',
        certificat2: '',
        certificat3: '',
        codeArticle: '',
        codeFournisseur: '',
        fournisseur: '',
        designationArticle: '',
        designationFournisseur: '',
        prixUnitaire: '',
        unites: '',
        origine: '',
        moq: '',
        seuilAppro: '',
        validationAcheteur: false,
        validationCoo: false,
        id_demdev: id
    });
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        task: '',
        echeance: '',
        qui: '',
        suivi: '',
        validation: '',
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        // Fetch data for the given ID
        axios.get(`http://localhost:5000/api/demdevp3/soumettre-demandepart3/${id}`)
            .then(response => {
                setData(response.data.formData);
                setTasks(response.data.tasks || []);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        const fetchRejectionComments = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/rejection-commentsresachat/${id}`);
                const data = await response.json();
                const comments = data.map(comment => comment.reason).join('; ');
                setData(prevFormData => ({
                    ...prevFormData,
                    rejectionComments: comments
                }));
            } catch (error) {
                toast.error(`Erreur lors de la récupération des commentaires de rejet : ${error.message}`);
            }
        };

        fetchRejectionComments();
    }, [id]);

    const handleAddTask = () => {
        if (!isValidDate(newTask.echeance) || !isValidDate(newTask.suivi)) {
            toast.error('Dates invalides');
            return;
        }
        setTasks(prevTasks => [...prevTasks, newTask]);
        setNewTask({
            task: '',
            echeance: '',
            qui: '',
            suivi: '',
            validation: '',
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewTask(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDeleteTask = (index) => {
        setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Préparer l'objet formData
        const updatedData = {
            formData: {
                fournisseur1: data.fournisseur1,
                fournisseur2: data.fournisseur2,
                fournisseur3: data.fournisseur3,
                article1: data.article1,
                article2: data.article2,
                article3: data.article3,
                certificat1: data.certificat1,
                certificat2: data.certificat2,
                certificat3: data.certificat3,
                codeArticle: data.codeArticle,
                codeFournisseur: data.codeFournisseur,
                fournisseur: data.fournisseur,
                designationArticle: data.designationArticle,
                designationFournisseur: data.designationFournisseur,
                prixUnitaire: data.prixUnitaire,
                unites: data.unites,
                origine: data.origine,
                moq: data.moq,
                seuilAppro: data.seuilAppro,
                validationAcheteur: data.validationAcheteur,
                validationCoo: data.validationCoo,
                id_demdev: id
            }
        };
    
        // Créer une instance de FormData
        const fd = new FormData();
        fd.append('formData', JSON.stringify(updatedData.formData)); // Correction ici : Serialisation de formData
        fd.append('tasks', JSON.stringify(tasks)); // Ajout des tâches en tant que chaîne JSON
    
        // Ajouter le fichier s'il existe
        if (file) {
            fd.append('file', file);
        }
    
        try {
            // Effectuer la requête PUT avec multipart/form-data
            await axios.put(`http://localhost:5000/api/demdevp3/modifier-demandepart3/${id}`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('La demande de développement a été mise à jour avec succès.', {
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
              receiverRole: 'responsableachat',
              type: 'Development Request part 3',
              message: `La troisième partie de La demande corrigée est prête pour révision et validation.`,
              id_dem: id, // Assurez-vous que 'id_demdev' est défini correctement
            })
          });
      
          if (!notificationResponse.ok) {
            throw new Error('Erreur lors de la création de la notification.');
          }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            toast.error('Une erreur est survenue lors de la mise à jour.', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
        }
    };
    
    


    const isValidDate = (dateString) => {
        if (!dateString) return false; // Vérifie si la chaîne est vide ou nulle
        const date = new Date(dateString);
        return !isNaN(date.getTime()) && date.toISOString().split('T')[0] === dateString;
    };

    const getRowColor = (echeance, suivi) => {
        const echeanceDate = isValidDate(echeance) ? new Date(echeance) : null;
        const suiviDate = isValidDate(suivi) ? new Date(suivi) : null;

        if (!echeanceDate || !suiviDate) {
            console.error('Invalid date:', echeanceDate, suiviDate);
            return 'transparent';
        }

        return suiviDate > echeanceDate ? '#f8d7da' : '#d4edda';
    };





    if (!data) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', marginBottom: '5px', backgroundColor: '#FFFAFA' }}>
                <Grid item>
                    <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginBottom: '30px' }}>
                        Correction de la Demande de Développement après Rejet de Coo
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {/* <Typography variant="h6">Commentaires du chef de produit</Typography> */}
                    <Paper elevation={2} style={{ padding: '15px', backgroundColor: '#f5f5f5' }}>
                        {data.rejectionComments ? (
                            <Typography variant="body1">
                                Voici la raison du rejet :  {data.rejectionComments}.
                                <Typography variant="body1" color="textSecondary">
                                    Assurez-vous de prendre en compte ces points pour améliorer la demande.
                                </Typography>
                            </Typography>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                Aucun commentaire de rejet pour cette demande.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
                <Typography variant="h6" sx={{
                    mb: 2, fontWeight: 'bold', borderRadius: '5px', paddingLeft: '15px', paddingBottom: '5px',
                    color: '#00000',
                    marginTop: '20px'
                }}>
                    Liste des tâches à réaliser
                </Typography>
                <form onSubmit={handleSubmit}>

                    <TableContainer component={Paper} style={{ marginBottom: '20px', border: '1px solid #ddd' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tâche</TableCell>
                                    <TableCell>Échéance</TableCell>
                                    <TableCell>Qui ?</TableCell>
                                    <TableCell>Suivi</TableCell>
                                    <TableCell>Validation</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.map((task, index) => (
                                    <TableRow
                                        key={index}
                                        style={{ backgroundColor: getRowColor(task.echeance, task.suivi) }} // Application de la couleur de fond
                                    >
                                        <TableCell>{task.task}</TableCell>
                                        <TableCell>{task.echeance}</TableCell>
                                        <TableCell>{task.qui}</TableCell>
                                        <TableCell>{task.suivi}</TableCell>
                                        <TableCell>{task.validation}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleDeleteTask(index)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>
                    <Typography variant="h6" gutterBottom>Ajouter une tâche</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tâche"
                                name="task"
                                value={newTask.task}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Échéance"
                                name="echeance"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={newTask.echeance || ''} // Assurez-vous que la valeur n'est jamais nulle
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Suivi"
                                name="suivi"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={newTask.suivi || ''} // Assurez-vous que la valeur n'est jamais nulle
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Qui ?"
                                name="qui"
                                value={newTask.qui}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="validation-label">Validation</InputLabel>
                                <Select
                                    labelId="validation-label"
                                    name="validation"
                                    label="Validation"
                                    value={newTask.validation}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="À faire">À faire</MenuItem>
                                    <MenuItem value="En cours">En cours</MenuItem>
                                    <MenuItem value="Terminé">Terminé</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} container justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddTask}
                                startIcon={<AddIcon />}
                                sx={{
                                    backgroundColor: '#00509E',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        backgroundColor: '#003d7a',
                                        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
                                    },
                                    '&:active': {
                                        backgroundColor: '#002d5e',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                Ajouter
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ marginTop: '20px' }}>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Joindre un fichier (si nécessaire)</InputLabel>
                            <input type="file" onChange={handleFileChange} />
                        </Grid>
                        <Grid item xs={12}>

                            <Paper style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc' }}>
                                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                                    Tableau de Article/Fournisseur
                                </Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell style={{ fontWeight: 'bold' }}>Fournisseur</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Nom Fournisseur 1"
                                                        name="fournisseur1"
                                                        value={data.fournisseur1}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Nom Fournisseur 2"
                                                        name="fournisseur2"
                                                        value={data.fournisseur2}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Nom Fournisseur 3"
                                                        name="fournisseur3"
                                                        value={data.fournisseur3}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: 'bold' }}>Article</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Article 1"
                                                        name="article1"
                                                        value={data.article1}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Article 2"
                                                        name="article2"
                                                        value={data.article2}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Article 3"
                                                        name="article3"
                                                        value={data.article3}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper></Grid>
                        <Grid item xs={12}>
                            <Paper style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc' }}>
                                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                                    Tableau de certificats d'articles
                                </Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell style={{ fontWeight: 'bold' }}>Fournisseur</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Nom Fournisseur 1"
                                                        name="fournisseur11"
                                                        value={data.fournisseur1}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Nom Fournisseur 2"
                                                        name="fournisseur22"
                                                        value={data.fournisseur2}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Nom Fournisseur 3"
                                                        name="fournisseur33"
                                                        value={data.fournisseur3}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: 'bold' }}>Certificat</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Certificat"
                                                        name="certificat1"
                                                        value={data.certificat1}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Certificat"
                                                        name="certificat2"
                                                        value={data.certificat2}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        label="Certificat"
                                                        name="certificat3"
                                                        value={data.certificat3}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper></Grid>

                        <Paper style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', marginLeft: '15px' }}>
                            <Typography variant="h6" style={{ marginBottom: '15px', fontWeight: 'bold' }}>Décision :</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                                            <TableCell style={{ fontWeight: 'bold' }}>Code article</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>Code fournisseur</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>Fournisseur</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>Désignation Article</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>Désignation Fournisseur</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>PU</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>Unités</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>Origine</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>MOQ</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>Seuil d’approvisionnement</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><TextField name="codeArticle" value={data.codeArticle} onChange={handleChange} fullWidth variant="outlined" /></TableCell>
                                            <TableCell><TextField name="codeFournisseur" value={data.codeFournisseur} onChange={handleChange} fullWidth variant="outlined" /></TableCell>
                                            <TableCell><TextField name="fournisseur" value={data.fournisseur} onChange={handleChange} fullWidth variant="outlined" /></TableCell>

                                            <TableCell><TextField name="designationArticle" value={data.designationArticle} onChange={handleChange} fullWidth variant="outlined" /></TableCell>
                                            <TableCell><TextField name="designationFournisseur" value={data.designationFournisseur} onChange={handleChange} fullWidth variant="outlined" /></TableCell>
                                            <TableCell><TextField name="prixUnitaire" type="number" value={data.prixUnitaire} onChange={handleChange} fullWidth variant="outlined" /></TableCell>
                                            <TableCell>
                                                <FormControl fullWidth variant="outlined">
                                                    <Select name="unites" value={data.unites} onChange={handleChange}>
                                                        <MenuItem value="Dollar">Dollar</MenuItem>
                                                        <MenuItem value="Euro">Euro</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell><TextField name="origine" value={data.origine} onChange={handleChange} fullWidth variant="outlined" /></TableCell>
                                            <TableCell><TextField name="moq" type="number" value={data.moq} onChange={handleChange} fullWidth variant="outlined" /></TableCell>
                                            <TableCell><TextField name="seuilAppro" type="number" value={data.seuilAppro} onChange={handleChange} fullWidth variant="outlined" /></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Soumettre
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <ToastContainer />
        </Container>
    );
};

export default Modificationpart3cooPage;
