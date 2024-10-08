import React, { useState } from 'react';
import {
    Modal, Box, Typography, TextField, Button, FormControl, Select, MenuItem, InputLabel, IconButton
} from '@mui/material';
import { Save, Close } from '@mui/icons-material';

const RowModal = ({ open, handleClose, decisions, handleChangedes, handleSave, editIndex, errors, setErrors }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validate = () => {
        const newErrors = {};

        const requiredFields = [
            "codeArticle",
            "codeFournisseur",
            "fournisseur",
            "designationArticle",
            "designationFournisseur",
            "prixUnitaire",
            "unites",
            "origine",
            "moq",
            "seuilAppro"
        ];

        requiredFields.forEach(field => {
            if (!decisions[field] || decisions[field].toString().trim() === '') {
                newErrors[field] = `Ce champ  est obligatoire`;
            }
        });

        setErrors(newErrors); // Met à jour les erreurs ici
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveWithValidation = () => {
        setIsSubmitted(true);

        if (validate()) {
            handleSave();
        }
    };
    return (
        <Modal open={open} onClose={handleClose} closeAfterTransition>
            <Box sx={modalStyle} >
                <Box sx={modalHeaderStyle}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {editIndex !== null ? 'Modifier' : 'Ajouter'} une ligne
                    </Typography>
                    <IconButton onClick={handleClose} aria-label="close" size="small">
                        <Close />
                    </IconButton>
                </Box>

                <Box sx={modalContentStyle}>
                    {[
                        { label: "Code Article", name: "codeArticle" },
                        { label: "Code Fournisseur", name: "codeFournisseur" },
                        { label: "Fournisseur", name: "fournisseur" },
                        { label: "Désignation Article", name: "designationArticle", multiline: true, rows: 2 },
                        { label: "Désignation Fournisseur", name: "designationFournisseur", multiline: true, rows: 2 },
                    ].map(({ label, name, multiline, rows }) => (
                        <TextField
                            key={name}
                            label={label}
                            name={name}
                            value={decisions[name] || ''}
                            onChange={handleChangedes}
                            error={!!errors[name]}
                            helperText={errors[name]} 
                            fullWidth
                            variant="outlined"
                            multiline={multiline}
                            rows={rows}
                            sx={inputFieldStyle}
                        />
                        
                    ))}

                    <Box sx={dualInputBoxStyle}>
                        <TextField
                            label="Prix Unitaire"
                            name="prixUnitaire"
                            type="number"
                            value={decisions.prixUnitaire || ''}
                            onChange={handleChangedes}
                            error={ !!errors.prixUnitaire}
                            helperText={errors.prixUnitaire}
                            fullWidth
                            variant="outlined"
                            sx={inputFieldStyle}
                        />
                        <FormControl fullWidth variant="outlined" sx={inputFieldStyle} error={!!errors.unites}>
                            <InputLabel>Unités</InputLabel>
                            <Select
                                name="unites"
                                value={decisions.unites || ''}
                                onChange={handleChangedes}
                                label="Unités"
                            >
                                <MenuItem value="Dollar">Dollar</MenuItem>
                                <MenuItem value="Euro">Euro</MenuItem>
                            </Select>
                            { errors.unites && <Typography variant="caption" color="error">{errors.unites}</Typography>}
                        </FormControl>
                    </Box>

                    {[
                        { label: "Origine", name: "origine" },
                        { label: "MOQ", name: "moq", type: 'number' },
                        { label: "Seuil d’approvisionnement", name: "seuilAppro", type: 'number' },
                    ].map(({ label, name, type }) => (
                        <TextField
                            key={name}
                            label={label}
                            name={name}
                            type={type || 'text'}
                            value={decisions[name] || ''}
                            onChange={handleChangedes}
                            error={!!errors[name]}
                            helperText={errors[name]}
                            fullWidth
                            variant="outlined"
                            sx={inputFieldStyle}
                        />
                    ))}

                    <Button
                        onClick={handleSaveWithValidation} variant="contained"
                        startIcon={<Save />}
                        fullWidth
                        sx={saveButtonStyle}
                    >
                        {editIndex !== null ? 'Modifier' : 'Ajouter'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '600px', md: '700px' },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    outline: 'none',
    paddingRight: '20px'
};

const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '10px',
    borderBottom: '1px solid #e0e0e0',
};

const modalContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '20px 0',
};

const inputFieldStyle = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderRadius: '3px',
            borderColor: '#c0c0c0',
        },
        '&:hover fieldset': {
            borderColor: '#1976d2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#1976d2',
        },
    },
    '& .MuiInputLabel-root': {
        fontSize: '14px',
        color: '#444',
    },
    '& .MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
    },
};

const dualInputBoxStyle = {
    display: 'flex',
    gap: '10px',
};

const saveButtonStyle = {

    fontWeight: 'bold',
    height: '35px',
    backgroundColor: '#1976d2',
    ':hover': {
        backgroundColor: '#115293',
    },
    textTransform: 'none',
    borderRadius: '8px',
    marginTop: '10px',
};

export default RowModal;
