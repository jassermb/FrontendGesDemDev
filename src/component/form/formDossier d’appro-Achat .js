import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const DevelopmentRequestForm = () => {
    const [formData, setFormData] = useState({
        article: '',
        fournisseur: '',
        codeArticle: '',
        codeFournisseur: '',
        designationArticle: '',
        designationFournisseur: '',
        prixUnitaire: '',
        origine: '',
        moq: '',
        seuilAppro: '',
        validationAcheteur: '',
        validationCoo: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '1500px', margin: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Dossier d’appro-Achat
            </Typography>

            <Paper style={{ marginBottom: '20px', padding: '10px' }}>
                <Typography variant="h6">Tableau de Article/Fournisseur</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Article/Fournisseur</TableCell>
                                <TableCell>
                                    <TextField
                                        label="Nom Fournisseur"
                                        name="fournisseur"
                                        value={formData.fournisseur}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Nom Fournisseur"
                                        name="fournisseur"
                                        value={formData.fournisseur}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Nom Fournisseur"
                                        name="fournisseur"
                                        value={formData.fournisseur}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TextField
                                        label="Article"
                                        name="article"
                                        value={formData.article}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Article"
                                        name="article"
                                        value={formData.article}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Article"
                                        name="article"
                                        value={formData.article}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Article"
                                        name="article"
                                        value={formData.article}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper style={{ marginBottom: '20px', padding: '10px' }}>
                <Typography variant="h6">Tableau de certificats d'articles</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Article/Fournisseur</TableCell>
                                <TableCell>
                                    <TextField
                                        label="Nom Fournisseur"
                                        name="fournisseur"
                                        value={formData.fournisseur}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Nom Fournisseur"
                                        name="fournisseur"
                                        value={formData.fournisseur}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Nom Fournisseur"
                                        name="fournisseur"
                                        value={formData.fournisseur}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TextField
                                        label="Article"
                                        name="article"
                                        value={formData.article}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Article"
                                        name="article"
                                        value={formData.article}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Article"
                                        name="article"
                                        value={formData.article}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Article"
                                        name="article"
                                        value={formData.article}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper style={{ marginBottom: '20px', padding: '10px' }}>
                <Typography variant="h6">Décision :</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Désignation Article</TableCell>
                                <TableCell>Désignation Fournisseur</TableCell>
                                <TableCell>PU</TableCell>
                                <TableCell>Unités</TableCell>
                                <TableCell>Origine</TableCell>
                                <TableCell>MOQ</TableCell>
                                <TableCell>Seuil d’approvisionnement</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TextField
                                        label="Désignation Article"
                                        name="designationArticle"
                                        value={formData.designationArticle}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Désignation Fournisseur"
                                        name="designationFournisseur"
                                        value={formData.designationFournisseur}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Prix Unitaire"
                                        name="prixUnitaire"
                                        type="number"
                                        value={formData.prixUnitaire}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormControl fullWidth>
                                        <InputLabel>Unités</InputLabel>
                                        <Select
                                            label="Unités"
                                            name="Unités"
                                            value={formData.Unités}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Dollar">Dollar</MenuItem>
                                            <MenuItem value="Euro">Euro</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Origine"
                                        name="origine"
                                        value={formData.origine}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        label="MOQ"
                                        name="moq"
                                        type="number"
                                        value={formData.moq}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Seuil d’approvisionnement"
                                        name="seuilAppro"
                                        type="number"
                                        value={formData.seuilAppro}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </form>
    );
};

export default DevelopmentRequestForm;
