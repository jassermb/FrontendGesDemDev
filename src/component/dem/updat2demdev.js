import React, { useState, useEffect } from 'react';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import RisqueImpactFormup from '../form/modal/risqueimpactupdate'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';

import {
  Table, TableBody, InputAdornment, TableCell, TableContainer, TableHead, TableRow, Modal, Box, Stack, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Divider, Paper, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import { useParams, useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Developmentpart1RequestDetails from './part1form';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
const EditDevelopmentRequest = () => {
  const { id } = useParams();
  const [openGuide, setOpenGuide] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [baseDataError, setBaseDataError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [risquesImpactsError, setRisquesImpactsError] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    productFamily: '',
    gravite: '',
    planAction: '',
    estimationGain: '',
    estimationVente: '',
    selectedUnitG: 'EUR (€)',
    selectedUnitV: 'EUR (€)',
    unitsG: ['unité', 'EUR (€)', 'USD ($)', 'GBP (£)', 'TND'],
    unitsV: ['unité', 'EUR (€)', 'USD ($)', 'GBP (£)', 'TND'],
    RisqueImpact: [{ description: '', gravite: '', planAction: '' }],
    rejectionComments: '',
    donneeBase: {
      designation: '',
      consommationAnnuelle: '',
      prixActuel: '',
      unitePrixActuel: '',
      fournisseur: '',
      designationFournisseur: '',
      documentsQualite: '',
    },
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openupdate, setOpenupdate] = useState(false);
  const handleRisqueImpactChange = (newData) => {
    setFormData((prev) => ({
      ...prev,
      RisqueImpact: newData,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/demdev/demdev2/${id}`);
        const data = response.data;
  
        // Parse 'RisqueImpact' (if necessary)
        const risqueImpactArray = Array.isArray(data.RisqueImpact)
          ? data.RisqueImpact
          : JSON.parse(data.RisqueImpact || '[]');
  
        // Handle 'donneesDeBase' and split 'prixActuel' to get unit
        const donneeBase = data.donneesDeBase.map(item => {
          const [prix, unite] = (item.prixActuel || '').split(' ');
          return {
            designation: item.designation || '',
            Codewindeco: item.Codewindeco || '',
            consommationAnnuelle: item.consommationAnnuelle2024 || '',
            prixActuel: prix || '',
            unitePrixActuel: unite || '',
            fournisseur: item.fournisseur || '',
            designationFournisseur: item.designationFournisseur || '',
            documentsQualite: item.documentsQualite || '',
            id: item.id || '',
          };
        });
  
        // Extract estimation and units
        const extractEstimationAndUnits = (value) => {
          if (value && typeof value === 'string') {
            const match = value.match(/^(\d+(?:\.\d+)?)\s+(.+)$/);
            if (match) {
              return [match[1], match[2]];
            }
          }
          return [value, ''];
        };
  
        const [estimationGain, unitsG] = extractEstimationAndUnits(data.estimationDeGain || '');
        const [estimationVente, unitsV] = extractEstimationAndUnits(data.estimationDeVente || '');
  
        // Update formData with retrieved data
        setFormData(prevFormData => ({
          ...prevFormData,
          code: data.code || '',
          productFamily: data.productFamily || '',
          gravite: data.gravite || '',
          estimationVente: estimationVente || '',
          selectedUnitV: prevFormData.unitsV.includes(unitsV) ? unitsV : 'EUR (€)', 
          estimationGain: estimationGain || '',
          selectedUnitG: prevFormData.unitsG.includes(unitsG) ? unitsG : 'EUR (€)', 
          planAction: data.planAction || '',
          RisqueImpact: risqueImpactArray,
          donneeBase: donneeBase[0] || {},
        }));
  
        setTableData(donneeBase);
        const fetchRejectionComments = async () => {
          try {
              const response = await fetch(`http://localhost:5000/api/users/rejection-commentscoo/${id}`);
              const data = await response.json();
              const comments = data.map(comment => comment.reason).join('; ');
              setFormData(prevFormData => ({
                  ...prevFormData,
                  rejectionComments: comments
              }));
          } catch (error) {
              toast.error(`Erreur lors de la récupération des commentaires de rejet : ${error.message}`);
          }
      };
      fetchRejectionComments();
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        toast.error('Une erreur est survenue lors de la récupération des données.');
      }
    };
  
    fetchData();
  }, [id]);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenupdate = () => setOpenupdate(true);
  const handleCloseupdate = () => setOpenupdate(false);
  const handleChange = (event) => {
    const { name, value } = event.target;
    const errorMessage = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const validateField = (name, value) => {
    switch (name) {

      case 'code':
        if (!value) {
          return 'Le code est requis.';
        }
        break;
      case 'estimationVente':
        if (!value) {
          return 'Estimation de Vente est requis.';
        }
        break;
      case 'estimationGain':
        if (!value) {
          return 'L\'estimation de gain est requise.';
        }
        break;
      case 'designation':
        if (!value) {
          return 'La désignation est requise.';
        }
        break;
      case 'consommationAnnuelle':
        if (!value) {
          return 'La consommation annuelle est requise.';
        }
        break;
      case 'prixActuel':
        if (!value) {
          return 'Le prix actuel est requis.';
        }
        break;
      case 'unitePrixActuel':
        if (!value) {
          return 'L’unité de prix actuel est requise.';
        }
        break;
      case 'fournisseur':
        if (!value) {
          return 'Le fournisseur est requis.';
        }
        break;
      case 'designationFournisseur':
        if (!value) {
          return 'La désignation du fournisseur est requise.';
        }
        break;
      case 'documentsQualite':
        if (!value) {
          return 'Les documents de qualité sont requis.';
        }
        break;
      default:
        return '';
    }
    return '';
  };



  const validateForm = () => {
    const newErrors = {};
    const { estimationGain, estimationVente, RisqueImpact } = formData;

    if (!estimationVente) {
      newErrors.estimationVente = 'Estimation de vente doit être un nombre.';
    }
    if (!estimationGain) {
      newErrors.estimationGain = 'Estimation de Gain est requise.';
    }

    if (tableData.length === 0) {
      newErrors.baseDataError = 'Le tableau de données de base doit contenir au moins une ligne.';
    }
    if (RisqueImpact.length === 0) {
      newErrors.risquesImpactsError = 'Le tableau des risques et impacts doit contenir au moins une ligne.';
    }

    // Mettre à jour les états d'erreur
    setErrors(newErrors);
    setBaseDataError(newErrors.baseDataError || '');
    setRisquesImpactsError(newErrors.risquesImpactsError || '');

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isSubmitted) {
      validateForm();
    }
  }, [tableData, formData, isSubmitted]);


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

      const baseDataArray = Array.isArray(tableData) ? tableData.map(row => ({
        Codewindeco: row.Codewindeco,
        designation: row.designation,
        consommationAnnuelle: row.consommationAnnuelle,
        prixActuel: row.prixActuel,
        fournisseur: row.fournisseur,
        designationFournisseur: row.designationFournisseur,
        documentsQualite: row.documentsQualite,
        unitePrixActuel: row.unitePrixActuel,
        id: row.id,
      })) : [];

      console.log('updatedFormData', baseDataArray);
      await axios.put(`http://localhost:5000/api/demdev/putdonneesbase/${id_demdev}`, baseDataArray);
      await axios.put(`http://localhost:5000/api/demdev/demandes/${id}`, {
        code: formData.code,
        estimationGain: formData.estimationGain,
        validationCOO: 'en attente2',
        RisqueImpact: formData.RisqueImpact,
        estimationVente: formData.estimationVente,
        unitsG: formData.selectedUnitG,
        unitsV: formData.selectedUnitV,
        status: 'Pris en charge'
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
          receiverRole: 'coo',
          type: 'Demande de Développement : Partie 2 Rejetée',
          message: 'La deuxième partie de La demande corrigée est prête pour révision et validation.',
          id_dem: id,
        })
      });
      if (!notificationResponse.ok) {
        throw new Error('Échec de l\'envoi de la notification');
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

  const handleEditRow = (index) => {
    const selectedRowData = tableData[index];
    setModalDataup({ ...selectedRowData, rowIndex: index });
    setOpenupdate(true);
  };
  const handleOpenGuide = () => {
    setOpenGuide(true);
  };

  const handleCloseGuide = () => {
    setOpenGuide(false);
  };
  const [modalDataup, setModalDataup] = useState({
    Codewindeco: '',
    designation: '',
    consommationAnnuelle: '',
    prixActuel: '',
    fournisseur: '',
    designationFournisseur: '',
    documentsQualite: '',
    unitePrixActuel: '',
  });
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
      designationFournisseur: '',
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
        designationFournisseur,
        documentsQualite,
        unitePrixActuel
      } = modalData;
      const isFormValid =
        Codewindeco.trim() !== '' &&
        designation.trim() !== '' &&
        !isNaN(consommationAnnuelle) && consommationAnnuelle.trim() !== '' &&
        !isNaN(prixActuel) && prixActuel.trim() !== '' &&
        fournisseur.trim() !== '' &&
        designationFournisseur.trim() !== '' &&
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
          designationFournisseur: '',
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
        <Box sx={{ p: 4, backgroundColor: 'background.paper', borderRadius: '12px', maxWidth: 'lg', width: '90%', boxShadow: 24 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2">Créer une nouvelle ligne</Typography>
            <IconButton onClick={handleClose} color="error">
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="Codewindeco"
                label="Code Windeco"
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
                label="Désignation"
                value={modalData.designation || ''}
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
                name="designationFournisseur"
                value={modalData.designationFournisseur || ''}
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
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 100 }}>
            <Button style={{ height: '30px' }} onClick={handleClose} variant="outlined" color="error" sx={{ textTransform: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
              Annuler
            </Button>
            <Button style={{ height: '30px' }} onClick={handleSaveModal} variant="contained" color="primary" sx={{ borderRadius: '8px', textTransform: 'none', display: 'flex', alignItems: 'center' }}>
              <SaveIcon sx={{ mr: 1 }} />
              Sauvegarder
            </Button>
          </Box>
        </Box>
      </Modal>

    );
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
        designationFournisseur,
        documentsQualite,
        unitePrixActuel,
      } = modalDatauplocal;
      return (
        Codewindeco.trim() !== '' &&
        designation.trim() !== '' &&
        !isNaN(consommationAnnuelle) && consommationAnnuelle !== '' &&
        !isNaN(prixActuel) && prixActuel !== '' &&
        fournisseur.trim() !== '' &&
        designationFournisseur.trim() !== '' &&
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
        toast.error('Please fill in all required fields correctly.', {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    };
    return (
      <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ p: 4, backgroundColor: 'background.paper', borderRadius: '12px', maxWidth: 'lg', width: '90%', boxShadow: 24 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2">Modifier la ligne</Typography>
            <IconButton onClick={handleClose} color="error">
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="Codewindeco"
                label="Code Windeco"
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
                label="Désignation"
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
                name="designationFournisseur"
                value={modalDatauplocal.designationFournisseur || ''}
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
                placeholder="Entrez une Documents qualité  détaillée"
                multiline
                rows={2}
                onChange={handleModalChange}
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 100 }}>
            <Button onClick={handleClose} variant="outlined" color="error" sx={{
              height: 30,
              minWidth: 120,
              borderRadius: '6px',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              px: 3,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
              }
            }}>
              Annuler
            </Button>
            <Button onClick={handleSaveModal} variant="contained" color="primary" sx={{
              height: 30,
              minWidth: 160,
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
    <Container maxWidth="xl">
      <Developmentpart1RequestDetails requestId={id} />

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', marginBottom: '10px', borderBottom: '2px solid #243242' }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5"
            gutterBottom
            style={{
              backgroundColor: '#243242',
              color: '#FFFFFF',
              borderTopLeftRadius: '7px',
              borderTopRightRadius: '7px',
              borderBottom: '2px solid black',
              padding: '7px',
              margin: '-20px',
              paddingLeft: '20px',
              marginBottom: '20px'
            }}>
            Correction de la Demande de Développement après Rejet
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '-30px'
              }}
            >
              <Button
                variant="outlined"
                onClick={handleOpenGuide}
                sx={{

                  borderRadius: '5px',
                  borderColor: '#fff',
                  color: '#fff',
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
              </Button></Box>

          </Typography>
          <Grid container justifyContent="space-between" alignItems="center">




            <Grid item>

            </Grid>
          </Grid>
          <Divider />
          <Grid item>

          </Grid>

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
              {formData.rejectionComments ? (
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
                      {formData.rejectionComments}
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





          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            <Grid item xs={12} sm={12}>
              <Grid item xs={12} sm={12}>
                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
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
                            <Tooltip title={row.designation} arrow arrowplacement="bottom"
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
                              }}>
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
                          <TableCell sx={{ borderRight: '1px solid #bdc3c7', maxWidth: '150px', p: 1 }}>
                            {row.consommationAnnuelle}
                          </TableCell>        <TableCell sx={{ borderRight: '1px solid #bdc3c7', p: 1 }}>
                            {row.prixActuel} {row.unitePrixActuel}
                          </TableCell>
                          <TableCell sx={{ borderRight: '1px solid #bdc3c7', p: 1 }}>
                            {row.fournisseur}
                          </TableCell>
                          <TableCell style={{
                            borderRight: '1px solid #bdc3c7',
                            maxWidth: '100px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            position: 'relative'
                          }}>
                            <Tooltip title={row.designationFournisseur} arrow placement="bottom"
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    backgroundColor: '#2C3E50',
                                    color: '#ecf0f1',
                                    fontSize: '14px',
                                    padding: '10px 16px',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '8px',
                                    maxWidth: '150px',
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
                              <Typography variant="body2" style={{
                                margin: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {row.designationFournisseur}
                              </Typography>
                            </Tooltip></TableCell>
                          <TableCell style={{
                            borderRight: '1px solid #bdc3c7',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            position: 'relative'
                          }}>
                            <Tooltip title={row.documentsQualite} arrow placement="bottom"
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    backgroundColor: '#2C3E50',
                                    color: '#ecf0f1',
                                    fontSize: '14px',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '8px',
                                    maxWidth: '150px',
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
                            <Tooltip title="Modifier" placement="bottom"
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
                              }}>
                              <IconButton color="primary" size="small" onClick={() => handleEditRow(index)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer" placement="bottom"
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
                              }}>
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
                    <AddIcon fontSize="small" />
                    <span style={{ marginLeft: 0 }}>Ajouter</span>
                  </Button>
                </Box>
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
                <FormControl fullWidth variant="outlined" size="small">
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
                                  borderLeft: '1px solid black',
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
              <RisqueImpactFormup
                initialRisquesImpacts={formData.RisqueImpact || []}
                onRisqueImpactChange={handleRisqueImpactChange}
              />
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
              )}       </Grid>
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
            Lorsque vous cliquez sur "Envoyer pour Validation", la demande sera envoyée au COO pour approbation. Assurez-vous que toutes les informations sont correctes avant de soumettre.
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
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* <ToastContainer /> */}
    </Container>
  );
};

export default EditDevelopmentRequest;
