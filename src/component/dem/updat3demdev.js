import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import {
    Typography, Grid, TextField, Button, IconButton, Box,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, InputLabel, FormControl, Select, Tooltip,
    MenuItem, Container, FormHelperText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import TaskModal from '../form/modal/taskmodal'
import EditIcon from '@mui/icons-material/Edit';
import RowModal from '../form/modal/modalform32'
import { Description as FileIcon } from '@mui/icons-material';
import { Edit, Delete } from '@mui/icons-material';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
const Modificationpart3Page = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const { id } = useParams();
    const [selectedFile, setSelectedFile] = useState(null);

    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [rows, setRows] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [fileName, setFileName] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [errors, setErrors] = useState({}); // Pour stocker les erreurs spécifiques des champs
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [taskData, setTaskData] = useState({
        task: '',
        echeance: '',
        qui: '',
        suivi: '',
        validation: '',
    });
    const [decisions, setdecision] = useState([]);
    const handleChangedes = (event) => {
        const { name, value } = event.target;
        setdecision((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };
        if (!value || value.toString().trim() === '') {
            newErrors[name] = `Ce champ  est obligatoire`;
        } else {
            delete newErrors[name];
        }
        setErrors(newErrors);
        setIsSubmitted(false);
    };


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
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const [newTask, setNewTask] = useState({
        task: '',
        echeance: '',
        qui: '',
        suivi: '',
        validation: '',
    });
    const [file, setFile] = useState(null);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [articles, setArticles] = useState([]);
    const [certificats, setCertificats] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:5000/api/demdevp3/soumettre-demandepart3/${id}`)
            .then(response => {
                console.log('API Response:', response.data);
                setRows(response.data.decisions || []);
                setTasks(response.data.tasks || []);
                setFournisseurs(response.data.fournisseurs || []);
                setArticles(response.data.articles || []);
                setCertificats(response.data.certificats || []);
                console.log(rows)
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
    useEffect(() => {
        console.log('taskData updated:', taskData);
        console.log('tasks:', tasks);
        console.log('rows:', rows)

    }, [taskData]);
    const handleOpenModal = (task = {}, index = null) => {
        setTaskData(task);
        setEditingIndex(index);
        setIsEditing(!!task.task);
        setOpenModal(true);
    };


    const handleChangef = (event) => {
        const { name, value } = event.target;
        const index = parseInt(name.replace('fournisseur', '')) - 1;

        if (index >= 0 && index < 3) {
            setFournisseurs((prevFournisseurs) => {
                const newFournisseurs = [...prevFournisseurs];

                newFournisseurs[index] = {
                    ...newFournisseurs[index],
                    nom_fournisseur: value,
                };
                return newFournisseurs;

            });
        }
        validateForm();

    };

    const handleChangea = (event) => {
        const { name, value } = event.target;
        const index = parseInt(name.replace('article', '')) - 1;

        setArticles(prevArticles => {
            const newArticles = [...prevArticles];
            if (index >= 0 && index < newArticles.length) {
                newArticles[index] = {
                    ...newArticles[index],
                    nom_article: value
                };
            }
            return newArticles;

        });
        validateForm();

    };

    const handleChangec = (event) => {
        const { name, value } = event.target;
        const index = parseInt(name.replace('certificat', '')) - 1;

        setCertificats(prevCertificats => {
            const newCertificats = [...prevCertificats];
            if (index >= 0 && index < newCertificats.length) {
                newCertificats[index] = {
                    ...newCertificats[index],
                    nom_certificat: value
                };
            }
            return newCertificats;

        });
        validateForm();

    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setSelectedFile(file); // Mémoriser le fichier sélectionné
        }
    };
    const getFileNameFromPath = (filePath) => {
        return filePath.split('\\').pop();
    };
    const handleDeleteTask = (index) => {
        setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
    };
    const [decisionsError, setdecisionsError] = useState('');
    const [tasksError, settasksError] = useState('');
    const [fileError, setfileError] = useState('');



    const validateForm = () => {
        const newErrors = {};

        fournisseurs.forEach((fournisseur, index) => {
            if (!fournisseur.nom_fournisseur) {
                newErrors[`fournisseur${index + 1}`] = 'Ce champ est requis';
            }
        });

        certificats.forEach((certificat, index) => {
            if (!certificat.nom_certificat) {
                newErrors[`certificat${index + 1}`] = 'Ce champ est requis';
            }
        });
        articles.forEach((article, index) => {
            if (!article.nom_article) {
                newErrors[`article${index + 1}`] = 'Ce champ est requis';
            }
        });
        if (!firstTaskWithAttachment.piecesJointes) {
            newErrors.fileError = 'Fiche de test et validation du prototype est requise.';
        }
        if (rows.length === 0) {
            newErrors.decisionsError = 'Le tableau de décisions doit contenir au moins une ligne.';
        }
        if (tasks.length === 0) {
            newErrors.tasksError = 'Le tableau des tâches doit contenir au moins une ligne.';
        }
        setErrors(newErrors);
        setdecisionsError(newErrors.decisionsError || '');
        setfileError(newErrors.fileError || '');
        settasksError(newErrors.tasksError || '');

        return Object.keys(newErrors).length === 0;
    };


    useEffect(() => {
        if (isSubmitted) {
            validateForm();
        }
    }, [tasks, rows, data, isSubmitted, file]);

    const handleSubmit = async (event) => {
        setIsSubmitted(true);
        event.preventDefault();
        if (!validateForm()) {
            toast.error('Veuillez corriger les erreurs dans le formulaire.', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        setdecisionsError('');
        settasksError('');
        setfileError('');
        setErrors('');

     


        const decisions = rows.map((row, index) => ({
            codeArticle: row.codeArticle,
            codeFournisseur: row.codeFournisseur,
            fournisseur: row.fournisseur,
            designationArticle: row.designationArticle,
            designationFournisseur: row.designationFournisseur,
            prixUnitaire: row.prixUnitaire,
            unites: row.unites,
            origine: row.origine,
            moq: row.moq,
            seuilAppro: row.seuilAppro,
            decision: selectedRow === index ? 1 : 0,
            id_demdev: id
        }));

        const formattedTasks = tasks.map(task => ({
            task: task.task,
            echeance: task.echeance,
            qui: task.qui,
            suivi: task.suivi,
            validation: task.validation,
            id_demdev: id,
            id: task.id

        }));
        console.log('formattedTasks', formattedTasks)
        console.log('decisions', decisions)


        const fd = new FormData();
        fd.append('tasks', JSON.stringify(formattedTasks));
        fd.append('decisions', JSON.stringify(decisions));

        if (selectedFile) {
            fd.append('file', selectedFile);
        }

        try {
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
                    message: `La troisième partie de la demande corrigée est prête pour révision et validation.`,
                    id_dem: id,
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

    const [selectedRow, setSelectedRow] = useState(null);
    const handleCheckboxChange = (e, index) => {
        const updatedRows = [...rows];

        updatedRows.forEach((row, i) => {
            if (i !== index) {
                row.decision = 0;
            }
        });

        updatedRows[index].decision = updatedRows[index].decision === 1 ? 0 : 1;

        setRows(updatedRows);
    };



    const handleOpenModal2 = (index = null) => {
        if (index !== null) {
            setdecision(rows[index]);
            setEditIndex(index);
        } else {
            setdecision({});
            setEditIndex(null);
        }
        setOpenModal2(true);
    };

    const handleCloseModal2 = () => {
        setOpenModal2(false);
        setdecision({});
    };
    const handleSave2 = () => {
        if (editIndex !== null) {
            const updatedRows = [...rows];
            updatedRows[editIndex] = decisions;
            setRows(updatedRows);

        } else {
            setRows([...rows, decisions]);

        }
        setOpenModal2(false);
    };

    const handleDelete2 = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };
    const isValidDate = (dateString) => {
        if (!dateString) return false;
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
    const handleCloseModal = () => setOpenModal(false);
    const handleSaveTask = (taskData, editingIndex = null) => {
        if (editingIndex !== null && editingIndex !== undefined) {
            const updatedTasks = [...tasks];
            updatedTasks[editingIndex] = taskData;
            setTasks(updatedTasks);
        } else {
            setTasks([...tasks, taskData]);
        }
        setOpenModal(false);
    };
    const firstTaskWithAttachment = Array.isArray(tasks) ? tasks.find(task => task.piecesJointes) : undefined;
    if (!data) return <Typography>Loading...</Typography>;
    const getFileName = (originalFilePath) => {
        if (fileName) {
            const baseName = fileName.split('.').slice(0, -1).join('.');
            if (baseName.includes('Tissus')) {
                return 'FOR-PRD-Collection Tissus';
            } else if (baseName.includes('Accessoires')) {
                return 'FOR-PRD-Collection Accessoires';
            }
            return baseName;
        }
        if (originalFilePath) {
            const originalBaseName = originalFilePath.split('/').pop().split('.').slice(0, -1).join('.');
            if (originalBaseName.includes('Tissus')) {
                return 'FOR-PRD-Collection Tissus';
            } else if (originalBaseName.includes('Accessoires')) {
                return 'FOR-PRD-Collection Accessoires';
            }
            return originalBaseName;
        }
        return 'Pièce jointe';
    };
    return (
        <Container maxWidth="xl">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', marginBottom: '5px', backgroundColor: '#FFFAFA', borderRadius: '10px' }}>
                <Grid container justifyContent="space-between" gap={40} alignItems="center">
                    <Grid item xs={12} sm={12}>
                        <Typography variant="h5"
                            gutterBottom
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#243242',
                                color: '#FFFFFF',
                                borderTopLeftRadius: '10px',
                                borderTopRightRadius: '10px',
                                borderBottom: '2px solid black',
                                padding: '7px',
                                margin: '-20px',
                                paddingLeft: '20px',
                                marginBottom: '20px'
                            }}>
                            Correction de la Demande de Développement après Rejet de Responsable achats
                            <Button
                                variant="outlined"
                                onClick={handleOpenDialog}
                                sx={{
                                    borderRadius: '8px',
                                    borderColor: '#FFFFFF',
                                    color: '#FFFFFF',

                                    padding: '5px 10px',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#FF0000',

                                    },
                                }}
                            >
                                Voir les instructions
                            </Button>
                        </Typography>
                    </Grid> </Grid>

                <Grid item xs={12}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: '10px',
                            backgroundColor: '#FDF1B8 ',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                            borderRadius: '7px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1px',
                            border: '1px solid #e0e0e0',
                        }}
                    >
                        {data.rejectionComments ? (
                            <>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: '#C62828',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <ErrorOutlineIcon sx={{ marginRight: '5px', fontSize: '18px', color: '#C62828' }} />
                                        Raison du rejet :
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            lineHeight: '1.6',
                                            color: '#4f4f4f',
                                            backgroundColor: '#f5f5f5',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        {data.rejectionComments}
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{
                                        paddingLeft: '8px',
                                        fontStyle: 'italic',
                                        marginTop: '6px',
                                        color: '#757575',
                                    }}
                                >
                                    Merci de prendre en compte ces points pour améliorer la demande.
                                </Typography>
                            </>
                        ) : (
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                textAlign="center"
                                sx={{
                                    padding: '10px 0',
                                    fontSize: '0.95rem',
                                    color: '#757575',
                                }}
                            >
                                Aucun commentaire de rejet pour cette demande.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                <Typography variant="h6" sx={{
                    mb: 2, borderRadius: '5px', paddingLeft: '15px', paddingBottom: '5px',
                    color: '#00000',
                    marginTop: '20px'
                }}>
                    Liste des tâches à réaliser
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TableContainer component={Paper} style={{ marginBottom: '20px', border: '1px solid #ddd' }}>
                        <Table sx={{
                            borderRadius: '10px'
                        }}>
                            <TableHead
                                sx={{
                                    backgroundColor: '#1a294c',
                                }}
                            >
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            color: '#f0f0f0',
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                        }}
                                    >
                                        Tâche
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: '#f0f0f0',
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                        }}
                                    >
                                        Échéance
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: '#f0f0f0',
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                        }}
                                    >
                                        Qui ?
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: '#f0f0f0',
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                        }}
                                    >
                                        Suivi
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: '#f0f0f0',
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                        }}
                                    >
                                        Validation
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: '#f0f0f0',
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                        }}
                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.map((task, index) => (
                                    <TableRow
                                        key={index}
                                        style={{ backgroundColor: getRowColor(task.echeance, task.suivi) }}
                                    >
                                        <TableCell sx={{
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                        }}>{task.task}</TableCell>
                                        <TableCell sx={{
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                        }}>{task.echeance}</TableCell>
                                        <TableCell sx={{
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                        }}>{task.qui}</TableCell>
                                        <TableCell sx={{
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                        }}>{task.suivi}</TableCell>
                                        <TableCell sx={{
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                        }}>{task.validation}</TableCell>
                                        <TableCell sx={{
                                            borderLeft: '0.5px solid white',
                                            padding: '6px 10px',
                                            textAlign: 'center',
                                            width: '150px'
                                        }}>
                                            <IconButton onClick={() => handleOpenModal(task, index)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteTask(index)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {tasksError && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#fdecea',
                                border: '1px solid #f5c6cb',
                                borderRadius: '5px',
                                padding: '8px 12px',
                                mt: 2,
                                maxWidth: '100%',
                                marginBottom: '5px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <ErrorOutlineIcon sx={{ color: '#e74c3c', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
                                {tasksError}
                            </Typography>
                        </Box>
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            padding: '10px', marginTop: '-10px'
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpenModal}
                            startIcon={<AddIcon style={{ fontSize: '16px' }} />}
                            sx={{
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 10px',
                                gap: '2px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
                                },
                            }}
                        >
                            Ajouter
                        </Button>
                    </Box>
                    <TaskModal
                        open={openModal}
                        handleClose={handleCloseModal}
                        taskData={taskData}
                        setTaskData={setTaskData}
                        handleSaveTask={() => handleSaveTask(taskData, editingIndex)}
                    />
                    <Grid item xs={12} sm={6}>
                        {firstTaskWithAttachment && (
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    marginBottom: '8px',
                                    marginTop: '8px',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    backgroundColor: '#f0f0f0',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Grid item xs={6} sx={{ textAlign: 'left' }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '0.95rem',
                                            color: '#333',
                                        }}
                                    >
                                        Fiche de test et validation du prototype : {fileName || getFileName(firstTaskWithAttachment.piecesJointes)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', lineHeight: '1.5' }}>
                                        Nom de fichier généré automatiquement : <strong>{getFileName(firstTaskWithAttachment.piecesJointes)}</strong>
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    container
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    sx={{ gap: '12px' }}
                                >
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
                                            fontSize: '0.8rem',
                                            padding: '4px 6px',
                                            boxShadow: 'none',
                                            borderRadius: '4px',
                                            backgroundColor: '#3f51b5',
                                            '&:hover': {
                                                backgroundColor: '#2c387e',
                                            },
                                        }}
                                    >
                                        Consulter
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<EditIcon />}
                                        component="label"
                                        sx={{
                                            textTransform: 'none',
                                            fontSize: '0.8rem',
                                            padding: '4px 6px',
                                            boxShadow: 'none',
                                            borderRadius: '4px',
                                            backgroundColor: '#f50057',
                                            '&:hover': {
                                                backgroundColor: '#ab003c',
                                            },
                                        }}
                                    >
                                        Remplacer
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                </Grid>
                            </Grid>
                        )}


                    </Grid>

                    <Typography variant="h6" sx={{
                        mb: 2, fontWeight: 'bold', borderRadius: '5px', paddingLeft: '15px', paddingBottom: '5px',
                        color: '#00000',
                        borderBottom: '2px solid #00509E', marginTop: '40px'
                    }}>
                        Dossier d’appro-Achat
                    </Typography>
                    <Grid container spacing={2} style={{ marginTop: '20px' }}>

                        <RowModal
                            open={openModal2}
                            handleClose={handleCloseModal2}
                            decisions={decisions}
                            handleChangedes={handleChangedes}
                            handleSave={handleSave2}
                            editIndex={editIndex}
                            errors={errors}
                            setErrors={setErrors}
                        />
                        <Grid item xs={12}>

                            <Paper style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>

                                <TableContainer style={{ marginBottom: '10px', border: '1px solid white', borderRadius: '5px' }} >
                                    <Table sx={{
                                        borderRadius: '10px'
                                    }}>
                                        <TableHead sx={{
                                            backgroundColor: '#1a294c',
                                            borderRadius: '10px'
                                        }}>
                                            <TableRow>
                                                <TableCell sx={{
                                                    color: '#f0f0f0',
                                                    borderLeft: '0.5px solid white',
                                                    padding: '6px 10px',
                                                    width: '100px',
                                                    whiteSpace: 'nowrap'
                                                }}>Code Article</TableCell>
                                                <TableCell sx={{
                                                    color: '#f0f0f0',
                                                    borderLeft: '0.5px solid white',
                                                    padding: '6px 10px',
                                                    width: '120px',
                                                    whiteSpace: 'nowrap'
                                                }}>Code Fournisseur</TableCell>
                                                <TableCell sx={{
                                                    color: '#f0f0f0',
                                                    borderLeft: '0.5px solid white',
                                                    padding: '6px 10px',
                                                    width: '150px',
                                                    whiteSpace: 'nowrap'
                                                }}>Fournisseur</TableCell>
                                                <TableCell sx={{
                                                    color: '#f0f0f0',
                                                    borderLeft: '0.5px solid white',
                                                    padding: '6px 10px',
                                                    width: '200px',
                                                    whiteSpace: 'nowrap'
                                                }}>Désignation Article</TableCell>
                                                <TableCell sx={{
                                                    color: '#f0f0f0',
                                                    borderLeft: '0.5px solid white',
                                                    padding: '6px 10px',
                                                    width: '200px',
                                                    whiteSpace: 'nowrap'
                                                }}>Désignation Fournisseur</TableCell>
                                                <TableCell sx={{
                                                    color: '#f0f0f0',
                                                    borderLeft: '0.5px solid white',
                                                    padding: '6px 10px',
                                                    width: '80px',
                                                    whiteSpace: 'nowrap'
                                                }}>PU</TableCell>
                                                <TableCell sx={{
                                                    color: '#f0f0f0',
                                                    borderLeft: '0.5px solid white',
                                                    padding: '6px 10px',
                                                    width: '100px',
                                                    whiteSpace: 'nowrap'
                                                }}>Origine</TableCell>
                                                <TableCell sx={{
                                                    color: '#f0f0f0',
                                                    borderLeft: '0.5px solid white',
                                                    padding: '6px 10px',
                                                    width: '80px',
                                                    whiteSpace: 'nowrap'
                                                }}>MOQ</TableCell>
                                                <TableCell sx={{
                                                    color: '#f0f0f0',
                                                    borderLeft: '0.5px solid white',
                                                    padding: '6px 10px',
                                                    width: '160px',
                                                    whiteSpace: 'nowrap'
                                                }}>Seuil d’approvisionnement</TableCell>
                                                <TableCell sx={{
                                                    color: '#f0f0f0',
                                                    borderLeft: '0.5px solid white',
                                                    padding: '6px 10px',
                                                    width: '160px',
                                                    whiteSpace: 'nowrap', textAlign: 'center'
                                                }}>Actions</TableCell>
                                                <TableCell sx={{
                                                    color: '#f0f0f0',
                                                    borderLeft: '0.5px solid white',
                                                    padding: '6px 10px',
                                                    width: '80px',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    Décision
                                                </TableCell>

                                            </TableRow>
                                        </TableHead>

                                        <TableBody sx={{
                                            backgroundColor: '#EDEDED '
                                        }}>
                                            {rows.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ borderLeft: '0.5px solid #ddd', padding: '6px 10px' }}>
                                                        <Tooltip
                                                            title={row.codeArticle}
                                                            arrow componentsProps={{
                                                                tooltip: {
                                                                    sx: {
                                                                        backgroundColor: '#2C3E50',
                                                                        color: 'white',
                                                                        fontSize: '14px',
                                                                        padding: '8px 12px',
                                                                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                                                        borderRadius: '4px',
                                                                        arrow: {
                                                                            sx: {
                                                                                color: '#2C3E50',
                                                                            },
                                                                        },
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <span style={{ cursor: 'pointer' }}>
                                                                {row.codeArticle.length > 6 ? row.codeArticle.substring(0, 6) + '...' : row.codeArticle}
                                                            </span>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        borderLeft: '0.5px solid #ddd',
                                                        padding: '6px 10px',
                                                    }}>
                                                        <Tooltip title={row.codeFournisseur} arrow componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: '#2C3E50',
                                                                    color: 'white',
                                                                    fontSize: '14px',
                                                                    padding: '8px 12px',
                                                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                                                    borderRadius: '4px',
                                                                    arrow: {
                                                                        sx: {
                                                                            color: '#2C3E50',
                                                                        },
                                                                    },
                                                                }
                                                            }
                                                        }}
                                                        >
                                                            <span style={{ cursor: 'pointer' }}>
                                                                {row.codeFournisseur.length > 7 ? row.codeFournisseur.substring(0, 7) + '...' : row.codeFournisseur}</span>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        borderLeft: '0.5px solid #ddd',
                                                        padding: '6px 10px',
                                                    }}>
                                                        <Tooltip title={row.fournisseur} arrow componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: '#2C3E50',
                                                                    color: 'white',
                                                                    fontSize: '14px',
                                                                    padding: '8px 12px',
                                                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                                                    borderRadius: '4px',
                                                                    arrow: {
                                                                        sx: {
                                                                            color: '#2C3E50',
                                                                        },
                                                                    },
                                                                }
                                                            }
                                                        }}
                                                        >
                                                            <span style={{ cursor: 'pointer' }}>
                                                                {row.fournisseur.length > 7 ? row.fournisseur.substring(0, 7) + '...' : row.fournisseur}</span>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        borderLeft: '0.5px solid #ddd',
                                                        padding: '6px 10px',
                                                    }}>
                                                        <Tooltip title={row.designationArticle} arrow componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: '#2C3E50',
                                                                    color: 'white',
                                                                    fontSize: '14px',
                                                                    padding: '8px 12px',
                                                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                                                    borderRadius: '4px',
                                                                    arrow: {
                                                                        sx: {
                                                                            color: '#2C3E50',
                                                                        },
                                                                    },
                                                                }
                                                            }
                                                        }}
                                                        >
                                                            <span style={{ cursor: 'pointer' }}>
                                                                {row.designationArticle.length > 7 ? row.designationArticle.substring(0, 7) + '...' : row.designationArticle}</span>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        borderLeft: '0.5px solid #ddd',
                                                        padding: '6px 10px',
                                                    }}>
                                                        <Tooltip title={row.designationFournisseur} arrow componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: '#2C3E50',
                                                                    color: 'white',
                                                                    fontSize: '14px',
                                                                    padding: '8px 12px',
                                                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                                                    borderRadius: '4px',
                                                                    arrow: {
                                                                        sx: {
                                                                            color: '#2C3E50',
                                                                        },
                                                                    },
                                                                }
                                                            }
                                                        }}
                                                        >
                                                            <span style={{ cursor: 'pointer' }}>
                                                                {row.designationFournisseur.length > 7 ? row.designationFournisseur.substring(0, 7) + '...' : row.designationFournisseur}</span>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderLeft: '0.5px solid #ddd',
                                                            padding: '6px 10px',
                                                        }}
                                                    >
                                                        <Tooltip arrow
                                                            title={`${row.prixUnitaire} ${row.unites}`}
                                                            componentsProps={{
                                                                tooltip: {
                                                                    sx: {
                                                                        backgroundColor: '#2C3E50',
                                                                        color: 'white',
                                                                        fontSize: '14px',
                                                                        padding: '8px 12px',
                                                                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                                                        borderRadius: '4px',
                                                                        arrow: {
                                                                            sx: {
                                                                                color: '#2C3E50',
                                                                            },
                                                                        },
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                                <span style={{ marginRight: '5px' }}>
                                                                    {row.prixUnitaire.toString().length > 7
                                                                        ? row.prixUnitaire.toString().substring(0, 7) + '...'
                                                                        : row.prixUnitaire}
                                                                </span>
                                                                <span style={{ color: '#555', fontSize: '0.875rem' }}>
                                                                    ({row.unites.length > 7 ? row.unites.substring(0, 7) + '...' : row.unites})
                                                                </span>
                                                            </span>
                                                        </Tooltip>
                                                    </TableCell>


                                                    <TableCell sx={{
                                                        borderLeft: '0.5px solid #ddd',
                                                        padding: '6px 10px',
                                                    }}>
                                                        <Tooltip title={row.origine} arrow componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: '#2C3E50',
                                                                    color: 'white',
                                                                    fontSize: '14px',
                                                                    padding: '8px 12px',
                                                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                                                    borderRadius: '4px',
                                                                    arrow: {
                                                                        sx: {
                                                                            color: '#2C3E50',
                                                                        },
                                                                    },
                                                                }
                                                            }
                                                        }}
                                                        >
                                                            <span style={{ cursor: 'pointer' }}>
                                                                {row.origine.length > 7 ? row.origine.substring(0, 7) + '...' : row.origine}</span>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        borderLeft: '0.5px solid #ddd',
                                                        padding: '6px 10px',
                                                    }}>
                                                        <Tooltip title={row.moq.toString()} arrow componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: '#2C3E50',
                                                                    color: 'white',
                                                                    fontSize: '14px',
                                                                    padding: '8px 12px',
                                                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                                                    borderRadius: '4px',
                                                                    arrow: {
                                                                        sx: {
                                                                            color: '#2C3E50',
                                                                        },
                                                                    },
                                                                }
                                                            }
                                                        }}
                                                        >
                                                            <span style={{ cursor: 'pointer' }}>
                                                                {row.moq.toString().length > 7 ? row.moq.toString().substring(0, 7) + '...' : row.moq}</span>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        borderLeft: '0.5px solid #ddd',
                                                        padding: '6px 10px',
                                                    }}>
                                                        <Tooltip title={row.seuilAppro.toString()} arrow componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    backgroundColor: '#2C3E50',
                                                                    color: 'white',
                                                                    fontSize: '14px',
                                                                    padding: '8px 12px',
                                                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                                                    borderRadius: '4px',
                                                                    arrow: {
                                                                        sx: {
                                                                            color: '#2C3E50',
                                                                        },
                                                                    },
                                                                }
                                                            }
                                                        }}
                                                        >
                                                            <span style={{ cursor: 'pointer' }}>
                                                                {row.seuilAppro.toString().length > 7 ? row.seuilAppro.toString().substring(0, 7) + '...' : row.seuilAppro}</span>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{ borderLeft: '0.5px solid #ddd', padding: '4px 8px', height: '40px', textAlign: 'center' }}>

                                                        <IconButton color="primary" onClick={() => handleOpenModal2(index)}>
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton color="error" onClick={() => handleDelete2(index)}>
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell key={index} sx={{ borderLeft: '0.5px solid #ddd', padding: '4px 8px', height: '40px', textAlign: 'center' }}>
                                                        <label className="container" style={{ cursor: 'pointer', padding: '0' }}>
                                                            <input
                                                                type="checkbox"
                                                                id={`select-row-${index}`}
                                                                checked={row.decision === 1} // Marks checkbox if decision equals 1
                                                                onChange={(e) => handleCheckboxChange(e, index)} // Handles checkbox state change
                                                                style={{ display: 'none' }}
                                                            />
                                                            <svg viewBox="0 0 64 64" height="1.3em" width="1.3em" style={{ overflow: 'visible' }}>
                                                                <path
                                                                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                                                    pathLength="575.0541381835938"
                                                                    className="path"
                                                                    style={{
                                                                        fill: 'none',
                                                                        stroke: 'black',
                                                                        strokeWidth: '6',
                                                                        strokeLinecap: 'round',
                                                                        strokeLinejoin: 'round',
                                                                        transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease',
                                                                        strokeDasharray: row.decision === 1 ? '70.5096664428711 9999999' : '241 9999999',
                                                                        strokeDashoffset: row.decision === 1 ? '-262.2723388671875' : '0',
                                                                    }}
                                                                ></path>
                                                            </svg>
                                                        </label>
                                                    </TableCell>


                                                </TableRow>
                                            ))}
                                        </TableBody>


                                    </Table>

                                </TableContainer>
                                {decisionsError && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: '#fdecea',
                                            border: '1px solid #f5c6cb',
                                            borderRadius: '5px',
                                            padding: '8px 12px',
                                            mt: 2,
                                            maxWidth: '100%',
                                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <ErrorOutlineIcon sx={{ color: '#e74c3c', mr: 1 }} />
                                        <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
                                            {decisionsError}
                                        </Typography>
                                    </Box>
                                )}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        padding: '10px',
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenModal2()} startIcon={<AddIcon style={{ fontSize: '16px' }} />}
                                        sx={{
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 10px',
                                            gap: '2px',
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            backgroundColor: '#1976d2',
                                            color: '#fff',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            '&:hover': {
                                                backgroundColor: '#1565c0',
                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
                                            },
                                        }}                   >
                                        Ajouter
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
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
                    </Grid>
                </form>
            </Paper>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        backgroundColor: '#f7f7f7',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <DialogTitle sx={{
                    bgcolor: '#34495e',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '10px 24px',
                    fontSize: '18px', marginBottom: '10px'
                }}>
                    <Typography variant="h6" align="center" >
                        Instructions
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="body1" gutterBottom>
                            Veuillez vous assurer que tous les champs requis sont remplis avant de soumettre le formulaire.
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="success" />
                                </ListItemIcon>
                                <ListItemText primary="Les tableaux de décisions et de tâches doivent contenir au moins une ligne." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="success" />
                                </ListItemIcon>
                                <ListItemText primary="Fiche de test et validation est requise." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="success" />
                                </ListItemIcon>
                                <ListItemText primary=" les Fournisseurs  sont requis." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="success" />
                                </ListItemIcon>
                                <ListItemText primary=" les Articles  sont requis." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="success" />
                                </ListItemIcon>
                                <ListItemText primary=" les Certificats sont requis." />
                            </ListItem>


                        </List>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ backgroundColor: '#E4E4E4', justifyContent: 'center' }}>
                    <Button
                        onClick={handleCloseDialog}
                        color="primary"
                        variant="contained"
                    >
                        Fermer
                    </Button>
                </DialogActions>

            </Dialog>
        </Container>
    );
};

export default Modificationpart3Page;
