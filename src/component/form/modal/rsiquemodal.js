import React, { useState } from 'react';
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
const RisqueImpactForm = ({ onRisqueImpactChange }) => {
    const [risquesImpacts, setRisquesImpacts] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [risqueImpact, setRisqueImpact] = useState({ description: '', gravite: '', planAction: '' });
    const [errors, setErrors] = useState({});
    const [hasTouched, setHasTouched] = useState(false);
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
            onRisqueImpactChange(updatedRisquesImpacts); 
            handleClose();
        } else {
            setErrors(newErrors);
        }
    };
    const handleRemoveRisqueImpact = (index) => {
        setRisquesImpacts(risquesImpacts.filter((_, i) => i !== index));
    };
    const validateRisqueImpactField = (data) => {
        const newErrors = {};
        if (!data.description) newErrors.description = 'La description du risque est requise.';
        if (!data.gravite) newErrors.gravite = 'La gravité est requise.';
        if (data.gravite === 'Majeure' && !data.planAction)
            newErrors.planAction = 'Le plan d’action est requis pour les risques majeurs.';
        return newErrors;
    };
    // Gestion des changements dans le formulaire du modal
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
            <TableContainer component={Paper} elevation={1} sx={{ mt: 3, overflow: 'hidden', border: '1px solid #ddd' }}>
                <Table aria-label="data table">
                    <TableHead
                        sx={{
                            height: 20,
                            backgroundColor: '#34495e',
                            color: '#ecf0f1',
                            borderBottom: '2px solid #ecf0f1',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
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

                    <TableBody >
                        {risquesImpacts.map((item, index) => (
                            item ? (
                                <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: '#f9f9f9' }, borderBottom: '1px solid #ddd', height: 20 }}>
                                    <TableCell align="left" sx={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderRight: '1px solid #bdc3c7', p: 1 }}>
                                        <Tooltip title={item.description.length > 100 ? item.description : ''} arrow
                                            placement="top"
                                            componentsProps={{
                                                tooltip: {
                                                    sx: {
                                                        backgroundColor: '#2C3E50',
                                                        color: '#ecf0f1',
                                                        fontSize: '14px',
                                                        marginLeft:'20px',
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
                                            }}>
                                            <span>{item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center" sx={{ maxWidth: '100px', overflow: 'hidden', width: '200px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderRight: '1px solid #bdc3c7', p: 1 }}>
                                        {item.gravite}
                                    </TableCell>
                                    <TableCell align="left" sx={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderRight: '1px solid #bdc3c7', p: 1 }}>
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
                                        }} title={item.planAction.length > 30 ? item.planAction : ''} arrow>
                                            <span>{item.planAction.length > 30 ? item.planAction.substring(0, 30) + '...' : item.planAction}</span>
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
                            ) : null
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
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
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
                </Button></Box>


            <Modal
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        position: 'absolute',
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
                            padding:'10px',
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

                    <Grid container spacing={2} sx={{ mt: 2, p: 1, marginTop: '-5px' }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Description du Risque"
                                value={risqueImpact.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                                multiline
                                rows={2}
                                maxRows={3}
                                error={Boolean(errors.description)}
                                helperText={errors.description}
                                sx={{ mb: 1 }}
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
                                maxRows={3}
                                error={Boolean(errors.planAction)}
                                helperText={errors.planAction}
                                sx={{ mb: 1 }}
                            />
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            display: 'flex',
                            p: 1,
                            justifyContent: 'space-between',
                            mt: 3,
                            marginTop: '-5px'
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClose}
                            sx={{
                                borderRadius: '3px',
                                padding: '3px 9px',
                                ':hover': {
                                    backgroundColor: '#ffcccc',
                                },
                            }}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            sx={{
                                borderRadius: '3px',
                                padding: '3px 9px',
                                display: 'flex',
                                alignItems: 'center',
                                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
                                ':hover': {
                                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                                },
                            }}
                        >
                            <SaveIcon sx={{ mr: 1 }} />
                            Sauvegarder
                        </Button>
                    </Box>
                </Box>
            </Modal>



        </div>
    );
};

export default RisqueImpactForm;
