import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Delete } from '@mui/icons-material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import '../../css/form3.css';
import { CFormCheck } from '@coreui/react';
import {
    Typography, Grid, TextField, Button, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, Tooltip,
    TableRow, Paper, InputLabel, FormControl, Select, Box,
    MenuItem, Container
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DevelopmentRequestDetails from '../dem/part2form';
import Developmentpart1RequestDetails from '../dem/part1form';
import { ToastContainer, toast } from 'react-toastify';
import TaskModal from '../form/modal/taskmodal'
import EditIcon from '@mui/icons-material/Edit';
import RowModal from '../form/modal/modalform32'
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TaskFormComponent = () => {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFiless, setSelectedFiless] = useState([]);

    const [filesError, setFilesError] = useState('');


    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const [editIndex, setEditIndex] = useState(null);
    const [taskData, setTaskData] = useState({
        task: '',
        echeance: '',
        qui: '',
        suivi: '',
        validation: '',
    });
    const handleFileChangesert = (event) => {
        const files = Array.from(event.target.files);

        if (files.length > 5) {
            setFilesError('Vous ne pouvez sélectionner que 5 fichiers au maximum.');
            setSelectedFiles([]);
        } else if (files.length > 0) {
            setSelectedFiles(files);
        } else {
            setFilesError('Aucun fichier sélectionné.');
        }
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
    const handleOpenModal = (task = {}, index = null) => {
        setTaskData(task);
        setEditingIndex(index);
        setIsEditing(!!task.task);
        setOpenModal(true);
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
    const handleDeleteTask = (index) => {
        setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    };
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        fournisseur1: '',
        fournisseur2: '',
        fournisseur3: '',
        article1: '',
        article2: '',
        article3: '',
        certificat1: '',
        certificat2: '',
        certificat3: '',
        validationAcheteur: false,
        validationCoo: false,
        id_demdev: id
    });
    const [decisions, setdecision] = useState({
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
        des: '',
        id_demdev: id
    })
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
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

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const [decisionsError, setdecisionsError] = useState('');
    const [tasksError, settasksError] = useState('');
    const [fileError, setfileError] = useState('');
    const [filessError, setfilessError] = useState('');

    const validateForm = () => {
        const newErrors = {};



        if (!file) {
            newErrors.fileError = 'Fiche de test et validation du prototyp est requise.';
        }
        if (!selectedFiles || selectedFiles.length === 0) {
            newErrors.filessError = 'Les fichiers de certification des articles sont requis.';
        }
        
        if (rows.length === 0) {
            newErrors.decisionsError = 'Le tableau de decisions doit contenir au moins une ligne.';
        }
        if (tasks.length === 0) {
            newErrors.tasksError = 'Le tableau des tasks doit contenir au moins une ligne.';
        }

        setErrors(newErrors);
        setdecisionsError(newErrors.decisionsError || '');
        setfileError(newErrors.fileError || '');
        setFilesError(newErrors.filessError || '');
        settasksError(newErrors.tasksError || '');

        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (isSubmitted) {
            validateForm();
        }
    }, [tasks, rows, formData, isSubmitted, file,selectedFiles]);

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
        setfilessError('');
        settasksError('');

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
            id_demdev: id
        }));

        console.log('tasks:', formattedTasks);
        console.log('decisions:', decisions);

        const fd = new FormData();
        fd.append('tasks', JSON.stringify(formattedTasks));
        fd.append('decisions', JSON.stringify(decisions));

        if (file) {
            fd.append('file', file);
        }
        selectedFiles.forEach((file) => {
            fd.append('certificationsart', file);
        });

        console.log('fd:', fd);
        for (var pair of fd.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        try {
            const response = await axios.post('http://localhost:5000/api/demdevp3/soumettre-demandepart3', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Demande envoyée avec succès pour validation au responsable d\'achat.', {
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
                    message: `La troisième partie de la demande de développement est prête pour votre validation.`,
                    id_dem: formData.id_demdev,
                })
            });

            if (!notificationResponse.ok) {
                throw new Error('Erreur lors de la création de la notification.');
            }

        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
            toast.error('Une erreur est survenue lors de la mise à jour de la demande de développement.', {
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

    const handleSelectRow = (e, index) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            if (selectedRow !== null) {
            }
            setSelectedRow(index);
        } else {
            setSelectedRow(null);
        }
    };



    const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
    };

    const getRowColor = (echeance, suivi) => {
        const echeanceDate = isValidDate(echeance) ? new Date(echeance) : null;
        const suiviDate = isValidDate(suivi) ? new Date(suivi) : null;
        if (!echeanceDate || !suiviDate) {
            console.error('Invalid date:', echeanceDate, suiviDate);
            return 'transparent';
        }
        return echeanceDate <= suiviDate ? '#d4edda' : '#f8d7da';
    };


    return (
        <Container maxWidth="xl"  >
            <Developmentpart1RequestDetails requestId={id} />
            <DevelopmentRequestDetails requestId={id} />
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', marginBottom: '5px', backgroundColor: '#FFFAFA', borderTop: '2px solid #00509E', borderBottom: '2px solid #00509E' }}>
                <Grid container justifyContent="space-between" gap={40} alignItems="center">
                    <Grid item xs={12} sm={12}>
                        <Typography
                            variant="h6"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 2,
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                paddingLeft: '15px',
                                paddingBottom: '2px',
                                color: '#2C3E50',
                                borderBottom: '3px solid #1A5276',
                                backgroundColor: '#F4F6F7',
                            }}
                        >

                            Liste des tâches à réaliser
                            <Button
                                variant="outlined"
                                onClick={handleOpenDialog}
                                sx={{
                                    borderRadius: '8px',
                                    borderColor: '#FF0000',
                                    color: '#C70039',

                                    padding: '5px 10px',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#FF0000',
                                        borderColor: '#FF0000',
                                        color: '#fff',
                                    },
                                }}
                            >
                                Voir les instructions
                            </Button>
                        </Typography> </Grid> </Grid>
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
                                            fontFamily: "'Times New Roman', Times,serif",
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

                    <Grid item xs={12} sm={6} sx={{
                        mt: 2,
                        mb: 3,
                        p: 2,
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}>
                        <Typography variant="h7" sx={{ mb: 3, color: '#34495e' }}>
                            Fiche de test et validation du prototype
                        </Typography>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                            onChange={handleFileChange}
                            style={{
                                mb: '12px',
                                display: 'block',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                width: '100%',
                                cursor: 'pointer',
                                transition: 'border-color 0.3s',
                                marginTop: '5px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                        {/* <Typography variant="body2" sx={{ color: '#555', lineHeight: '1.5', paddingTop: '10px' }}>
                            Nom de fichier généré automatiquement : <strong>{getFileName()}</strong>
                        </Typography> */}
                        {fileError && (
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
                                    {fileError}
                                </Typography>
                            </Box>
                        )}
                    </Grid>

                    <Typography variant="h6" sx={{
                        mb: 2,
                        borderRadius: '5px',
                        fontWeight: 'bold',

                        marginTop: '20px',
                        paddingLeft: '15px',
                        paddingBottom: '8px',
                        color: '#2C3E50',
                        borderBottom: '3px solid #1A5276',
                        backgroundColor: '#F4F6F7',
                    }}>
                        Dossier d’appro-Achat
                    </Typography>
                  
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
                                                        checked={selectedRow === index}
                                                        onChange={(e) => handleSelectRow(e, index)}
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
                                                                strokeDasharray: selectedRow === index ? '70.5096664428711 9999999' : '241 9999999',
                                                                strokeDashoffset: selectedRow === index ? '-262.2723388671875' : '0',
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

                    <Grid item xs={12} sm={6} sx={{
                        mt: 2,
                        mb: 3,
                        p: 2,
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}>
                        <Typography variant="h7" sx={{ mb: 3, color: '#34495e' }}>
                            Fichiers de Certification des Articles
                        </Typography>

                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                            onChange={handleFileChangesert}
                            style={{
                                mb: '12px',
                                display: 'block',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                width: '100%',
                                cursor: 'pointer',
                                transition: 'border-color 0.3s',
                                marginTop: '5px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            multiple
                        />

                        {selectedFiles.length > 0 && (
                            <Box sx={{ mb: 2, mt: 2 }}>
                                <Typography variant="h7" sx={{ mb: 1, color: '#34495e' }}>
                                    Fichiers sélectionnés :
                                </Typography>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {selectedFiles.map((file, index) => (
                                        <li key={index} style={{
                                            background: '#f9f9f9',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            marginBottom: '5px',
                                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Typography variant="body2" sx={{ color: '#34495e' }}>
                                                {file.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                                {Math.round(file.size / 1024)} KB
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        )}

                        {filesError && (
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
                                    {filesError}
                                </Typography>
                            </Box>
                            
                        )}
                                  {filessError && (
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
                                    {filessError}
                                </Typography>
                            </Box>
                        )}
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

                </form>
            </Paper>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        backgroundColor: '#f7f7f7', // Couleur de fond
                        borderRadius: '8px', // Coins arrondis
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Ombre
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

export default TaskFormComponent;
