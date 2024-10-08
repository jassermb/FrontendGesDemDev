import React, { useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import {
    Grid,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    IconButton,
    Button,
    Modal,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
const RisqueImpactFormup = ({ initialRisquesImpacts, onRisqueImpactChange }) => {
    const [risquesImpacts, setRisquesImpacts] = useState(initialRisquesImpacts || []);
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [risqueImpact, setRisqueImpact] = useState({ description: '', gravite: '', planAction: '' });
    const [errors, setErrors] = useState({});
    const [hasTouched, setHasTouched] = useState(false);

    useEffect(() => {
        setRisquesImpacts(initialRisquesImpacts || []);
    }, [initialRisquesImpacts]);

    const handleOpen = (index = null) => {
        if (index !== null && risquesImpacts[index]) {
            setCurrentIndex(index);
            setRisqueImpact(risquesImpacts[index]);
        } else {
            setCurrentIndex(null);
            setRisqueImpact({ description: '', gravite: '', planAction: '' });
        }
        setOpen(true);
        setHasTouched(false);
    };

    const handleClose = () => setOpen(false);

    const handleSave = () => {
        setHasTouched(true);
        const newErrors = validateRisqueImpactField(risqueImpact);
        if (Object.keys(newErrors).length === 0) {
            let updatedRisquesImpacts;
            if (currentIndex !== null) {
                updatedRisquesImpacts = risquesImpacts.map((item, index) =>
                    index === currentIndex ? risqueImpact : item
                );
            } else {
                updatedRisquesImpacts = [...risquesImpacts, risqueImpact];
            }
            setRisquesImpacts(updatedRisquesImpacts);
            onRisqueImpactChange(updatedRisquesImpacts); // Appeler la fonction du parent
            handleClose();
        } else {
            setErrors(newErrors);
        }
    };

    const handleRemoveRisqueImpact = (index) => {
        setRisquesImpacts(risquesImpacts.filter((_, i) => i !== index));
        onRisqueImpactChange(risquesImpacts.filter((_, i) => i !== index)); // Notify parent
    };

    const validateRisqueImpactField = (data) => {
        const newErrors = {};
        if (!data.description) newErrors.description = 'La description du risque est requise.';
        if (!data.gravite) newErrors.gravite = 'La gravité est requise.';
        if (data.gravite === 'Majeure' && !data.planAction)
            newErrors.planAction = 'Le plan d’action est requis pour les risques majeurs.';
        return newErrors;
    };

    const handleChange = (field, value) => {
        setRisqueImpact((prev) => {
            const updatedImpact = { ...prev, [field]: value };
            if (hasTouched) {
                setErrors(validateRisqueImpactField(updatedImpact));
            }
            return updatedImpact;
        });
    };

    return (
        <div>
            <TableContainer component={Paper} elevation={1} sx={{ mt: 3, borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
                <Table aria-label="data table">
                    <TableHead
                        sx={{
                            backgroundColor: '#34495e', // Couleur de fond sombre et moderne
                            color: '#ecf0f1', // Couleur claire pour le texte
                            borderBottom: '2px solid #ecf0f1', // Bordure claire pour bien délimiter l'en-tête
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', p: 1
                        }}
                    >
                        <TableRow sx={{ height: 30 }}>
                            <TableCell
                                align="left"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#ecf0f1',
                                    borderRight: '1px solid #95a5a6',
                                    padding: '6px', p: 1
                                }}
                            >
                                Description
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#ecf0f1',
                                    borderRight: '1px solid #95a5a6',
                                    padding: '6px', p: 1
                                }}
                            >
                                Gravité
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#ecf0f1',
                                    borderRight: '1px solid #95a5a6',
                                    padding: '6px', p: 1
                                }}
                            >
                                Plan d’action
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#ecf0f1',
                                    padding: '6px', p: 1
                                }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {risquesImpacts.map((item, index) => (
                            <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: '#f9f9f9' }, borderBottom: '1px solid #ddd', height: 20 }}>
                                <TableCell align="left" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderRight: '1px solid #bdc3c7', p: 1 }}>
                                    <Tooltip placement="top" componentsProps={{
                                            tooltip: {
                                                sx: {
                                                    backgroundColor: '#2C3E50',
                                                    color: '#ecf0f1',
                                                    fontSize: '14px',
                                                    padding: '10px 16px',
                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                    borderRadius: '8px',
                                                    maxWidth: '400px',
                                                    whiteSpace: 'pre-wrap',
                                                    textAlign: 'center',
                                                },
                                            },
                                            arrow: {
                                                sx: {
                                                    color: '#2C3E50',
                                                },
                                            },
                                        }} title={item.description.length > 100 ? item.description : ''} arrow>
                                        <span>{item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center" sx={{ maxWidth: '100px', overflow: 'hidden', width: '200px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderRight: '1px solid #bdc3c7', p: 1 }}>
                                    {item.gravite}
                                </TableCell>
                                <TableCell align="center" sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderRight: '1px solid #bdc3c7', p: 1 }}>
                                    <Tooltip placement="top" componentsProps={{
                                            tooltip: {
                                                sx: {
                                                    backgroundColor: '#2C3E50',
                                                    color: '#ecf0f1',
                                                    fontSize: '14px',
                                                    padding: '10px 16px',
                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                                    borderRadius: '8px',
                                                    maxWidth: '400px',
                                                    whiteSpace: 'pre-wrap',
                                                    textAlign: 'center',
                                                },
                                            },
                                            arrow: {
                                                sx: {
                                                    color: '#2C3E50',
                                                },
                                            },
                                        }} title={item.planAction.length > 100 ? item.planAction : ''} arrow>
                                        <span>{item.planAction.length > 100 ? item.planAction.substring(0, 100) + '...' : item.planAction}</span>
                                    </Tooltip>
                                </TableCell>

                                <TableCell align="center" sx={{ minWidth: '50px', width: '100px', borderRight: '1px solid #bdc3c7', p: 1 }}>
                                    <Tooltip title="Modifier">
                                        <IconButton size="small" color="primary" onClick={() => handleOpen(index)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Supprimer">
                                        <IconButton size="small" color="error" onClick={() => handleRemoveRisqueImpact(index)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '15px'
                }}
            >
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleOpen}
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
                    <AddIcon fontSize="small" /> {/* Taille de l'icône ajustée */}
                    <span style={{ marginLeft: 0 }}>Ajouter </span> {/* Supprimer le marginLeft */}
                </Button> </Box>
            <Modal
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        position: 'absolute',
                        padding:'10px',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '5px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        width: { xs: '90%', sm: '600px' },

                        p: 3,
                    },
                }}
            >
                <Box
                    component={Paper}
                    sx={{
                        width: '90%',
                        maxWidth: '40%',
                        margin: 'auto',
                        marginTop: '5%',
                        borderRadius: '10px',
                        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.15)',
                        transition: 'transform 0.3s ease-in-out',
                        transform: 'translateY(0)',                      

                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: '#34495e',
                            padding: '10px',
                            color: '#fff',
                            textAlign: 'center',
                            borderRadius: '8px 8px 0 0',
                        }}
                    >
                        <Typography variant="h6" >
                            {currentIndex !== null
                                ? `Modifier Risque & Impact (${currentIndex + 1})`
                                : `Ajouter Risque & Impact`}
                        </Typography>
                    </Box>
                    {/* Contenu du Modal */}
                    <Grid container spacing={3} sx={{ mt: 1.5 ,  padding:'10px',}}>
                        <Grid item xs={12}>
                            <TextField
                                label="Description du Risque"
                                value={risqueImpact.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                                multiline
                                rows={3}
                                maxRows={4}
                                error={Boolean(errors.description)}
                                helperText={errors.description}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel>Gravité</InputLabel>
                                <Select
                                    value={risqueImpact.gravite}
                                    onChange={(e) => handleChange('gravite', e.target.value)}
                                    label="Gravité"
                                    error={Boolean(errors.gravite)}
                                >
                                    <MenuItem value="Mineure">Mineure</MenuItem>
                                    <MenuItem value="Majeure">Majeure</MenuItem>
                                </Select>
                                {errors.gravite && <FormHelperText error>{errors.gravite}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        {/* Affichage conditionnel de Plan d’action si la gravité est Majeure */}

                        <Grid item xs={12}>
                            <TextField
                                label="Plan d’action"
                                value={risqueImpact.planAction}
                                onChange={(e) => handleChange('planAction', e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                                multiline
                                rows={3}
                                maxRows={4}
                                error={Boolean(errors.planAction)}
                                helperText={errors.planAction}
                            />
                        </Grid>

                    </Grid>
                    {/* Boutons d'action avec styles modernes */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            paddingBottom:'10px',
                            mt: 3,
                            gap: 40,
                            marginBottom: '10px',
                        }}
                    >
                        <Button style={{ height: '30px' }} variant="outlined" color="error" onClick={handleClose}>
                            Annuler
                        </Button>
                        <Button style={{ height: '30px' }} variant="contained" color="primary" onClick={handleSave}>
                            <SaveIcon sx={{ mr: 1 }} />
                            Sauvegarder
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default RisqueImpactFormup;
