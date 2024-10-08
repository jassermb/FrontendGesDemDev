import React, { useState } from 'react';
import { Modal, Box, TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

const TaskModal = ({ open, handleClose, taskData, setTaskData, handleSaveTask }) => {
    const [errors, setErrors] = useState({}); // Pour stocker les erreurs de validation

    const validate = (name, value) => {
        let newErrors = { ...errors }; // Copiez les erreurs existantes

        switch (name) {
            case 'task':
                newErrors.task = value ? '' : "Le champ Tâche est requis";
                break;
            case 'echeance':
                newErrors.echeance = value ? '' : "Le champ Échéance est requis";
                break;
            case 'suivi':
                newErrors.suivi = value ? '' : "Le champ Suivi est requis";
                break;
            case 'qui':
                newErrors.qui = value ? '' : "Le champ Qui ? est requis";
                break;
            case 'validation':
                newErrors.validation = value ? '' : "Le champ Validation est requis";
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleSave = () => {
        if (validateAll()) {
            handleSaveTask();
            handleClose();
        }
    };

    const validateAll = () => {
        let valid = true;
        const newErrors = {};

        // Validation des champs
        if (!taskData.task) {
            newErrors.task = "Le champ Tâche est requis";
            valid = false;
        }
        if (!taskData.echeance) {
            newErrors.echeance = "Le champ Échéance est requis";
            valid = false;
        }
        if (!taskData.suivi) {
            newErrors.suivi = "Le champ Suivi est requis";
            valid = false;
        }
        if (!taskData.qui) {
            newErrors.qui = "Le champ Qui ? est requis";
            valid = false;
        }
        if (!taskData.validation) {
            newErrors.validation = "Le champ Validation est requis";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTaskData((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
        validate(name, value); // Valider le champ au changement
    };
    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '95%', sm: 600 }, // Responsive width
                    maxWidth: 1000, // Max width
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 2,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Tâche"
                            name="task"
                            value={taskData.task}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                            error={!!errors.task}
                            helperText={errors.task}
                            sx={{ mb: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Échéance"
                            name="echeance"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={taskData.echeance}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                            error={!!errors.echeance}
                            helperText={errors.echeance}
                            sx={{ mb: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Suivi"
                            name="suivi"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={taskData.suivi}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                            error={!!errors.suivi}
                            helperText={errors.suivi}
                            sx={{ mb: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Qui ?"
                            name="qui"
                            value={taskData.qui}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                            error={!!errors.qui}
                            helperText={errors.qui}
                            sx={{ mb: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined" size="small" error={!!errors.validation}>
                            <InputLabel id="validation-label">Validation</InputLabel>
                            <Select
                                labelId="validation-label"
                                name="validation"
                                value={taskData.validation}
                                onChange={handleInputChange}
                                label="Validation"
                            >
                                <MenuItem value="À faire">À faire</MenuItem>
                                <MenuItem value="En cours">En cours</MenuItem>
                                <MenuItem value="Terminé">Terminé</MenuItem>
                            </Select>
                            <FormHelperText>{errors.validation}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} container justifyContent="center">
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            sx={{
                                mt: 2,
                                borderRadius: 8,
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
                            Sauvegarder
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default TaskModal;
