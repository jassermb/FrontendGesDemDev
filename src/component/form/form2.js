import React, { useState, useEffect, useCallback } from 'react';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import RisqueImpactForm from '../form/modal/rsiquemodal'
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import {
  Table, TableBody, InputAdornment, TableCell, TableContainer, TableHead, TableRow, Modal, Box, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Divider, Paper, Container, Dialog, DialogActions, FormHelperText, DialogContent, DialogTitle
} from '@mui/material';
import Developmentpart1RequestDetails from '../dem/part1form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
const FormComponent = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openupdate, setOpenupdate] = useState(false);
  const [risquesImpacts, setRisquesImpacts] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleRisqueImpactChange = (updatedRisquesImpacts) => {
    setRisquesImpacts(updatedRisquesImpacts);
  };

  const [tableData, setTableData] = useState([]);
  const [openGuide, setOpenGuide] = useState(false);
  const [baseDataError, setBaseDataError] = useState('');
  const [risquesImpactsError, setRisquesImpactsError] = useState('');
  const handleOpenGuide = () => {
    setOpenGuide(true);
  };
  const handleCloseGuide = () => {
    setOpenGuide(false);
  };
  const [formData, setFormData] = useState({
    productFamily: '',
    gravite: '',
    planAction: '',
    estimationGain: '',
    estimationVente: '',
    selectedUnitG: 'EUR (€)',
    selectedUnitV: 'EUR (€)',
    unitsG: ['unité','EUR (€)', 'USD ($)', 'GBP (£)', 'TND'],
    unitsV: ['unité','EUR (€)', 'USD ($)', 'GBP (£)', 'TND'],
    RisqueImpact: [''],
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { estimationGain, estimationVente } = formData;

    if (!estimationVente) {
      newErrors.estimationVente = 'Estimation de vente doit être un nombre.';
    }
    if (!estimationGain) {
      newErrors.estimationGain = 'Estimation de Gain est requise.';
    }

    if (tableData.length === 0) {
      newErrors.baseDataError = 'Le tableau de données de base doit contenir au moins une ligne.';
    }
    if (risquesImpacts.length === 0) {
      newErrors.risquesImpactsError = 'Le tableau des risques et impacts doit contenir au moins une ligne.';
    }

    setErrors(newErrors);
    setBaseDataError(newErrors.baseDataError || '');
    setRisquesImpactsError(newErrors.risquesImpactsError || '');

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isSubmitted) {
      validateForm();
    }
  }, [tableData, risquesImpacts, formData, isSubmitted]);
  const handleSubmit = async (event) => {
    setIsSubmitted(true);
    event.preventDefault();
    try {
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

      setBaseDataError('');
      setRisquesImpactsError('');
      const id_demdev = id;
      const estimationVenteValue = formData.estimationVente;

      const baseDataArray = tableData.map(row => ({
        Codewindeco: row.Codewindeco,
        designation: row.designation,
        consommationAnnuelle: row.consommationAnnuelle,
        prixActuel: row.prixActuel,
        fournisseur: row.fournisseur,
        designationFrs: row.designationFrs,
        documentsQualite: row.documentsQualite,
        unitePrixActuel: row.unitePrixActuel,
      }));

      console.log('p', baseDataArray);
      await axios.post(`http://localhost:5000/api/demdev/donneesbase/${id_demdev}`, baseDataArray);
      await axios.put(`http://localhost:5000/api/demdev/demandes/${id}`, {
        estimationGain: formData.estimationGain,
        validationCOO: 'en attente2',
        RisqueImpact: risquesImpacts,
        estimationVente: estimationVenteValue,
        unitsG: formData.selectedUnitG,
        unitsV: formData.selectedUnitV,
        status: 'À valider (COO)',
      });
      toast.success('Demande envoyée pour validation COO avec succès.', {
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
          receiverRole: 'coo',
          type: 'Development Request part 2',
          message: `La deuxième partie de la demande de développement est prête pour votre validation.`,
          id_dem: id,
        })
      });

      if (!notificationResponse.ok) {
        throw new Error('Failed to send notification');
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenupdate = () => setOpenupdate(true);
  const handleCloseupdate = () => setOpenupdate(false);


  const handleRemoveRow = (index) => {
    setTableData(prevData => prevData.filter((_, i) => i !== index));
  };
  const MyModalComponent = ({ open, handleClose }) => {
    const [modalData, setModalData] = useState({
      Codewindeco: '',
      designation: '',
      consommationAnnuelle: '',
      prixActuel: '',
      fournisseur: '',
      designationFrs: '',
      documentsQualite: '',
      estimationVente: '',
      unitePrixActuel: '',
    });

    const handleModalChange = (event) => {
      const { name, value } = event.target;
      setModalData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    };

    const validateForm = () => {
      const {
        Codewindeco,
        designation,
        consommationAnnuelle,
        prixActuel,
        fournisseur,
        designationFrs,
        documentsQualite,
        unitePrixActuel
      } = modalData;
      const isFormValid =
        Codewindeco.trim() !== '' &&
        designation.trim() !== '' &&
        !isNaN(consommationAnnuelle) && consommationAnnuelle.trim() !== '' &&
        !isNaN(prixActuel) && prixActuel.trim() !== '' &&
        fournisseur.trim() !== '' &&
        designationFrs.trim() !== '' &&
        documentsQualite.trim() !== '' &&
        unitePrixActuel.trim() !== '';
      return isFormValid;
    };
    const handleSaveModal = () => {
      if (validateForm()) {
        setTableData(prevTableData => [...prevTableData, modalData]);
        console.log('datatable', tableData);
        setModalData({
          Codewindeco: '',
          designation: '',
          consommationAnnuelle: '',
          prixActuel: '',
          fournisseur: '',
          designationFrs: '',
          documentsQualite: '',
          unitePrixActuel: '',
        });
        handleClose();
      } else {
        toast.error('Please fill in all required fields correctly.', {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    };

    return (
      <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: '5px', maxWidth: 'lg', width: '90%', boxShadow: 24 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2">Créer une nouvelle ligne</Typography>
            <IconButton onClick={handleClose} color="error">
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="Codewindeco"
                label="Code Windeco *"
                value={modalData.Codewindeco || ''}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="designation"
                label="Désignation *"
                value={modalData.designation || ''}
                onChange={handleModalChange}
                variant="outlined"
                multiline
                rows={2}
                placeholder="Entrez une description détaillée ici"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} >
              <TextField
                fullWidth
                label="Désignation fournisseur *"
                name="designationFrs"
                value={modalData.designationFrs || ''}
                placeholder="Entrez une Désignation fournisseur détaillée"
                multiline
                rows={2}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Consommation annuelle 2024 (stores) *"
                name="consommationAnnuelle"
                type="number"
                value={modalData.consommationAnnuelle || ''}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fournisseur *"
                name="fournisseur"
                value={modalData.fournisseur || ''}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prix actuel *"
                name="prixActuel"
                type="number"
                value={modalData.prixActuel || ''}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small" sx={{ borderRadius: '8px' }}>
                <InputLabel id="unitePrixActuel">Unité de Prix actuel *</InputLabel>
                <Select
                  name="unitePrixActuel"
                  label="Unité de Prix actuel *"
                  labelId="unitePrixActuel"
                  value={modalData.unitePrixActuel || ''}
                  onChange={handleModalChange}
                >
                  <MenuItem value="€/mL">€/mL</MenuItem>
                  <MenuItem value="$/mL">$/mL</MenuItem>
                  <MenuItem value="€/kg">€/kg</MenuItem>
                  <MenuItem value="$/kg">$/kg</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} >
              <TextField
                fullWidth
                label="Documents qualité *"
                name="documentsQualite"
                value={modalData.documentsQualite || ''}
                placeholder="Entrez une Documents qualité détaillée"
                multiline
                rows={2}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 3 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="error"
              sx={{
                height: 30,
                minWidth: 200,
                borderRadius: '6px',
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                px: 3,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                }
              }}
            >
              Annuler
            </Button>

            <Button
              onClick={handleSaveModal}
              variant="contained"
              color="primary"
              sx={{
                height: 30,
                minWidth: 200,
                borderRadius: '6px',
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                px: 3,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(0, 123, 255, 0.9)',
                }
              }}
            >
              <SaveIcon sx={{ mr: 1 }} />
              Sauvegarder
            </Button>
          </Box>

        </Box>
      </Modal>

    );
  };
  const [modalDataup, setModalDataup] = useState({
    Codewindeco: '',
    designation: '',
    consommationAnnuelle: '',
    prixActuel: '',
    fournisseur: '',
    designationFrs: '',
    documentsQualite: '',
    unitePrixActuel: '',
  });

  const handleEditRow = (index) => {
    const selectedRowData = tableData[index];
    setModalDataup({ ...selectedRowData, rowIndex: index });
    setOpenupdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenupdate(false);
    setModalDataup({
      Codewindeco: '',
      designation: '',
      consommationAnnuelle: '',
      prixActuel: '',
      fournisseur: '',
      designationFrs: '',
      documentsQualite: '',
      unitePrixActuel: '',
    });
  };

  const MyModalComponentUpdate = ({ open, handleClose, modalDataup, setModalDataup }) => {
    const [modalDatauplocal, setModalDatauplocal] = useState(modalDataup);

    useEffect(() => {
      setModalDatauplocal(modalDataup);
    }, [modalDataup]);

    const handleModalChange = (event) => {
      const { name, value } = event.target;
      setModalDatauplocal(prevData => ({
        ...prevData,
        [name]: value,
      }));
    };

    const validateForm = () => {
      const {
        Codewindeco,
        designation,
        consommationAnnuelle,
        prixActuel,
        fournisseur,
        designationFrs,
        documentsQualite,
        unitePrixActuel,
      } = modalDatauplocal;
      return (
        Codewindeco.trim() !== '' &&
        designation.trim() !== '' &&
        !isNaN(consommationAnnuelle) && consommationAnnuelle.trim() !== '' &&
        !isNaN(prixActuel) && prixActuel.trim() !== '' &&
        fournisseur.trim() !== '' &&
        designationFrs.trim() !== '' &&
        documentsQualite.trim() !== '' &&
        unitePrixActuel.trim() !== ''
      );
    };

    const handleSaveModal = () => {
      if (validateForm()) {
        const updatedTableData = [...tableData];
        updatedTableData[modalDatauplocal.rowIndex] = { ...modalDatauplocal };
        setTableData(updatedTableData);
        handleClose();
      } else {
        toast.error('Veuillez remplir tous les champs obligatoires.', {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    };
    return (
      <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: '5px', maxWidth: 'lg', width: '90%', boxShadow: 24 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2">Modifier la ligne</Typography>
            <IconButton onClick={handleClose} color="error">
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="Codewindeco"
                label="Code Windeco *"
                value={modalDatauplocal.Codewindeco || ''}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="designation"
                label="Désignation *"
                value={modalDatauplocal.designation || ''}
                onChange={handleModalChange}
                variant="outlined"
                multiline
                rows={2}
                placeholder="Enter a detailed description here"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} >
              <TextField
                fullWidth
                label="Désignation fournisseur *"
                name="designationFrs"
                value={modalDatauplocal.designationFrs || ''}
                onChange={handleModalChange}
                placeholder="Entrez une Désignation fournisseur détaillée"
                multiline
                rows={2}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Consommation annuelle 2024 (stores) *"
                name="consommationAnnuelle"
                type="number"
                value={modalDatauplocal.consommationAnnuelle || ''}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fournisseur *"
                name="fournisseur"
                value={modalDatauplocal.fournisseur || ''}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prix actuel *"
                name="prixActuel"
                type="number"
                value={modalDatauplocal.prixActuel || ''}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small" sx={{ borderRadius: '8px' }}>
                <InputLabel id="unitePrixActuel">Unité de Prix actuel *</InputLabel>
                <Select
                  name="unitePrixActuel"
                  label="Unité de Prix actuel *"
                  labelId="unitePrixActuel"
                  value={modalDatauplocal.unitePrixActuel || ''}
                  onChange={handleModalChange}
                >
                  <MenuItem value="€/mL">€/mL</MenuItem>
                  <MenuItem value="$/mL">$/mL</MenuItem>
                  <MenuItem value="€/kg">€/kg</MenuItem>
                  <MenuItem value="$/kg">$/kg</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} >
              <TextField
                fullWidth
                label="Documents qualité *"
                name="documentsQualite"
                value={modalDatauplocal.documentsQualite || ''}
                placeholder="Entrez une Désignation fournisseur détaillée"
                multiline
                rows={2}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 3 }}>
            <Button onClick={handleClose} variant="outlined" color="error" sx={{
              height: 30,
              minWidth: 200,
              borderRadius: '6px',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              px: 3,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'rgba(0, 123, 255, 0.9)',
              }
            }}>
              Annuler
            </Button>
            <Button onClick={handleSaveModal} variant="contained" color="primary" sx={{
              height: 30,
              minWidth: 200,
              borderRadius: '6px',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              px: 3,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'rgba(0, 123, 255, 0.9)',
              }
            }}>
              <SaveIcon sx={{ mr: 1 }} />
              Sauvegarder
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };



  return (
    <Container maxWidth="xl" style={{
      borderRadius: '10px'
    }}>
      {id ? <Developmentpart1RequestDetails requestId={id} /> : <p>Aucun identifiant fourni.</p>}
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', borderRadius: '10px', marginBottom: '10px', borderBottom: '1px solid #09193f', }}>
        <form onSubmit={handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
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
                Donnée de base
                <Button
                  variant="outlined"
                  onClick={handleOpenGuide}
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

              </Typography>
            </Grid>


          </Grid>
          <Divider />
          <Grid container spacing={3} style={{ marginTop: '-10px' }}>
            <Grid item xs={12} sm={12}>
              <Grid item xs={12} sm={12}>
                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: '2px', overflow: 'hidden' }}>
                  <Table aria-label="data table">
                    <TableHead
                      sx={{
                        backgroundColor: '#34495e',
                        color: '#ecf0f1',
                        borderBottom: '2px solid #ecf0f1',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <TableRow>
                        {['Code windeco', 'Désignation', 'Consommation annuelle 2024 (stores)', 'Prix actuel', 'Fournisseur', 'Désignation fournisseur', 'Documents qualité', 'Actions'].map((text) => (
                          <TableCell key={text} sx={{ borderRight: '1px solid #95a5a6', p: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ecf0f1' }}>{text}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:nth-of-type(even)': {
                              backgroundColor: '#f9f9f9'
                            },
                            '&:hover': {
                              backgroundColor: '#f1f1f1'
                            }
                          }}
                        >
                          <TableCell sx={{ borderRight: '1px solid #bdc3c7' }}>{row.Codewindeco}</TableCell>
                          <TableCell style={{
                            borderRight: '1px solid #bdc3c7',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            padding: '8px',
                            position: 'relative'
                          }}>
                            <Tooltip
                              title={row.designation}
                              arrow
                              placement="bottom"
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    backgroundColor: '#2C3E50',
                                    color: '#ecf0f1',
                                    fontSize: '14px',
                                    padding: '10px 16px',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '8px',
                                    maxWidth: '300px',
                                    whiteSpace: 'pre-wrap',
                                    textAlign: 'center',
                                  },
                                },
                                arrow: {
                                  sx: {
                                    color: '#2C3E50',
                                  },
                                },
                              }}
                            >
                              <Typography variant="body2" style={{
                                margin: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {row.designation}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #bdc3c7', maxWidth: '200px', p: 1 }}>
                            {row.consommationAnnuelle}
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #bdc3c7', maxWidth: '200px', p: 1 }}>
                            {row.prixActuel} {row.unitePrixActuel}
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #bdc3c7', maxWidth: '200px', p: 1 }}>
                            {row.fournisseur}
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: '1px solid #bdc3c7',
                              maxWidth: '300px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              padding: '8px',
                              position: 'relative',
                            }}
                          >
                            <Tooltip
                              title={row.designationFrs}
                              arrow
                              placement="bottom"
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    backgroundColor: '#2C3E50',
                                    color: '#ecf0f1',
                                    fontSize: '14px',
                                    padding: '10px 16px',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '8px',
                                    maxWidth: '250px',
                                    whiteSpace: 'pre-wrap',
                                    textAlign: 'center',
                                  },
                                },
                                arrow: {
                                  sx: {
                                    color: '#2C3E50',
                                  },
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                style={{
                                  margin: 0,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  fontWeight: '500',
                                }}
                              >
                                {row.designationFrs}
                              </Typography>
                            </Tooltip>
                          </TableCell>

                          <TableCell style={{
                            borderRight: '1px solid #bdc3c7',
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            padding: '8px',
                            position: 'relative'
                          }}>
                            <Tooltip
                              title={row.documentsQualite}
                              arrow
                              placement="bottom"
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    backgroundColor: '#2C3E50',
                                    color: '#ecf0f1',
                                    fontSize: '14px',
                                    padding: '10px 16px',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '8px',
                                    maxWidth: '250px',
                                    whiteSpace: 'pre-wrap',
                                    textAlign: 'center',
                                  },
                                },
                                arrow: {
                                  sx: {
                                    color: '#2C3E50',
                                  },
                                },
                              }}
                            >
                              <Typography variant="body2" style={{
                                margin: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {row.documentsQualite}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell sx={{ display: 'flex', justifyContent: 'center', justifyItems: 'center', p: 1.5 }}>
                            <Tooltip title="Modifier">
                              <IconButton color="primary" size="small" onClick={() => handleEditRow(index)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton color="error" size="small" onClick={() => handleRemoveRow(index)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>


                </TableContainer>
                {baseDataError && (
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
                      {baseDataError}
                    </Typography>
                  </Box>
                )}
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
                <MyModalComponent
                  open={open}
                  handleClose={handleClose}
                />
              </Grid>
            </Grid>
            <MyModalComponentUpdate
              open={openupdate}
              handleClose={handleCloseupdate}
              modalDataup={modalDataup}
              setModalDataup={setModalDataup}
            />
            <Grid item xs={12}>
              <Typography variant="h7" gutterBottom>Estimation de vente :</Typography>
            </Grid>

            <Grid container spacing={1} style={{ margin: '10px' }} alignItems="center">
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" size="small" error={Boolean(errors.estimationVente)}>
                  <TextField
                    fullWidth
                    name="estimationVente"
                    type="number"
                    value={formData.estimationVente}
                    onChange={handleChange}
                    error={Boolean(errors.estimationVente)}
                    helperText={errors.estimationVente}

                    variant="outlined"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <FormControl size="small">
                            <Select
                              name="selectedUnitV"
                              value={formData.selectedUnitV}
                              onChange={handleChange}
                              IconComponent={() => (
                                <Tooltip title="Sélectionner l'unité">
                                  <ExpandMoreIcon
                                    sx={{ cursor: 'pointer' }}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      event.currentTarget.parentNode.click();
                                    }}
                                  />
                                </Tooltip>
                              )}
                              displayEmpty
                              sx={{
                                minWidth: 60,
                                '& .MuiSelect-select': { paddingRight: 0 },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  border: 'none',
                                  borderLeft: '1px solid black'
                                },
                              }}
                            >
                              {formData.unitsV.map((unit, index) => (
                                <MenuItem key={index} value={unit}>
                                  {unit}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-root': { fontSize: '14px', borderRadius: '4px', paddingRight: '8px' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
                        '&:hover fieldset': { borderColor: '#3f51b5' },
                        '&.Mui-focused fieldset': { borderColor: '#3f51b5' },
                      },
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>


            <Grid item xs={12}>
              <Typography variant="h7" gutterBottom>Etude des risques & impacts :</Typography>
              <RisqueImpactForm onRisqueImpactChange={handleRisqueImpactChange} />

              {risquesImpactsError && (
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
                    {risquesImpactsError}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h7" gutterBottom>Estimation de Gain :</Typography>
            </Grid>

            <Grid container spacing={1} style={{ margin: '10px' }} alignItems="center">
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" size="small" error={Boolean(errors.estimationGain)}>
                  <TextField
                    fullWidth
                    name="estimationGain"
                    type="number"
                    value={formData.estimationGain}
                    onChange={handleChange}
                    error={Boolean(errors.estimationGain)}
                    helperText={errors.estimationGain}

                    variant="outlined"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <FormControl size="small">
                            <Select
                              name="selectedUnitG"
                              value={formData.selectedUnitG}
                              onChange={handleChange}
                              IconComponent={() => (
                                <Tooltip title="Sélectionner l'unité">
                                  <ExpandMoreIcon
                                    sx={{ cursor: 'pointer' }}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      event.currentTarget.parentNode.click();
                                    }}
                                  />
                                </Tooltip>
                              )}
                              displayEmpty
                              sx={{
                                minWidth: 60,
                                '& .MuiSelect-select': { paddingRight: 0 },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  border: 'none',
                                  borderLeft: '1px solid black'
                                },
                              }}
                            >
                              {formData.unitsG.map((unit, index) => (
                                <MenuItem key={index} value={unit}>
                                  {unit}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-root': { fontSize: '14px', borderRadius: '4px', paddingRight: '8px' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
                        '&:hover fieldset': { borderColor: '#3f51b5' },
                        '&.Mui-focused fieldset': { borderColor: '#3f51b5' },
                      },
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
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
        open={openGuide}
        onClose={handleCloseGuide}
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
        }}
        PaperProps={{
          sx: {
            position: 'absolute',
            top: { xs: '20%', sm: '30%' },
            left: { xs: '10%', sm: '50%' },
            transform: { xs: 'translate(0, 0)', sm: 'translate(-50%, -50%)' },
            borderRadius: '12px',
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#34495e',
            color: '#fff',
            fontWeight: 'bold',
            padding: '16px 24px',
            fontSize: '18px',
          }}
        >
          Instructions pour remplir le formulaire
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#fafafa', padding: '24px 32px', marginTop: '10px' }}>
          <Typography
            variant="body1"
            color="textSecondary"
            paragraph
            sx={{ fontSize: '15px', lineHeight: 1.6 }}
          >
            Les champs marqués d'un astérisque (*) sont obligatoires. Assurez-vous de remplir toutes les informations nécessaires pour que votre demande soit complète.
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            paragraph
            sx={{ fontSize: '15px', lineHeight: 1.6 }}
          >
            <strong>Gravité :</strong>
            <ul style={{ marginTop: '8px', paddingLeft: '20px', marginBottom: '16px' }}>
              <li>
                <strong>Majeure :</strong> nécessite un plan d’action détaillé pour résoudre les problèmes identifiés.
              </li>
              <li>
                <strong>Mineure :</strong> ne nécessite pas de plan d’action mais doit être pris en compte.
              </li>
            </ul>
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            paragraph
            sx={{ fontSize: '15px', lineHeight: 1.6 }}
          >
            Lorsque vous cliquez sur "Soumettre", la demande sera envoyée au COO pour approbation. Assurez-vous que toutes les informations sont correctes avant de soumettre.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#e0f7fa', padding: '16px', justifyContent: 'center' }}>
          <Button
            onClick={handleCloseGuide}
            variant="contained"
            sx={{
              backgroundColor: '#00796b',
              color: '#fff',
              textTransform: 'none',
              padding: '5px 12px',
              borderRadius: '12px',
              boxShadow: 'none',
              ':hover': {
                backgroundColor: '#004d40',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // ombre subtile
              },
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer/>
    </Container>
  );
};

export default FormComponent;
