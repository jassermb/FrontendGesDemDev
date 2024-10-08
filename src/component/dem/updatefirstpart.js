import React, { useState, useEffect } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import {
  Container, Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Grid,
  Paper, FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, FormHelperText, DialogContent, DialogTitle,

} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FileIcon from '@mui/icons-material/AttachFile';
import axios from 'axios';

const EditDevelopmentRequest1 = () => {
  const [developmentNumber, setDevelopmentNumber] = useState(1);

  const [formData, setFormData] = useState({
    date: '',
    dateObjectif: '',
    raisonDeveloppement: [],
    problematique: '',
    code: '',
    objectifDeveloppement: '',
    files: {},
    rejectionComments: '',
  });
  useEffect(() => {
    const year = new Date().getFullYear().toString().slice(-2);
    const code = `${formData.productFamily}-${year}-${developmentNumber.toString().padStart(3, '0')}`;
    if (formData.productFamily && formData.productFamily.trim() !== '') {

      setFormData(prevState => ({ ...prevState, code }));
    }
  }, [formData.productFamily, developmentNumber]);
  useEffect(() => {
    if (formData.productFamily && formData.productFamily.trim() !== '') {
      fetchLastSerialNumber(formData.productFamily);
    }
  }, [formData.productFamily]);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchLastSerialNumber = async (code) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/demdev/dernier-numero/${code}`);
      if (response.data.success) {
        const lastSerialNumber = response.data.lastSerialNumber;
        const lastNumber = parseInt(lastSerialNumber.split('-').pop(), 10);
        setDevelopmentNumber(lastNumber + 1);
      } else {
        setDevelopmentNumber(1);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier numéro de série:', error);
      setDevelopmentNumber(1);
    }
  };

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/demdev/demande1-developpement/${id}`);
        const data = await response.json();
        setFormData(prevFormData => ({
          ...prevFormData,
          date: new Date(data.dateCreation).toISOString().split('T')[0],
          dateObjectif: data.dateObjectifMiseEnIndustrialisation.split('T')[0],
          problematique: data.problematique,
          code: data.code,
          objectifDeveloppement: data.objectifDevelopment,
          raisonDeveloppement: JSON.parse(data.raisonDevelopment || '[]'),
          files: {}
        }));
      } catch (error) {
        toast.error(`Erreur lors de la récupération des données : ${error.message}`);
      }
    };

    const fetchRejectionComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/rejection-comments/${id}`);
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

    fetchRequestData();
    fetchRejectionComments();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setFormData(prevData => ({
      ...prevData,
      raisonDeveloppement: checked
        ? [...prevData.raisonDeveloppement, { raison: value, file: prevData.files[value] ? prevData.files[value].name : null }]
        : prevData.raisonDeveloppement.filter(raison => raison.raison !== value),
    }));
  };

  const handleFileChange = (raison, event) => {
    const file = event.target.files[0];
    setFormData(prevData => ({
      ...prevData,
      files: {
        ...prevData.files,
        [raison]: file,
      },
      raisonDeveloppement: prevData.raisonDeveloppement.map(item =>
        item.raison === raison ? { ...item, file: file.name } : item
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) {
      newErrors.date = 'La date est obligatoire';
    }
    if (!formData.dateObjectif) {
      newErrors.dateObjectif = 'La date objectif est obligatoire';
    }
    if (formData.raisonDeveloppement.length === 0) {
      newErrors.raisonDeveloppement = 'Au moins une raison du développement doit être sélectionnée';
    }
    if (!formData.problematique) {
      newErrors.problematique = 'La problématique est obligatoire';
    }
    if (!formData.objectifDeveloppement) {
      newErrors.objectifDeveloppement = 'L\'objectif de développement est obligatoire';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Veuillez remplir tous les champs obligatoires avant de soumettre.');
      return;
    }
    const status = 'Non pris en charge';

    const formDataToSend = new FormData();
    formDataToSend.append('dateObjectifMiseEnIndustrialisation', formData.dateObjectif);
    formDataToSend.append('problematique', formData.problematique);
    formDataToSend.append('objectifDevelopment', formData.objectifDeveloppement);
    formDataToSend.append('code', formData.code);

    formDataToSend.append('status', status);

    const raisonDeveloppementJSON = JSON.stringify(formData.raisonDeveloppement);

    formDataToSend.append('raisonDeveloppement', raisonDeveloppementJSON);
    Object.keys(formData.files).forEach((key) => {
      formDataToSend.append('files', formData.files[key]);
    });

    try {
      const response = await fetch(`http://localhost:5000/api/demdev/demande1-developpement/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const responseData = await response.json();
      if (response.ok) {
        toast.success('Demande de développement mise à jour avec succès', {
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
        await Promise.all([
          sendNotification('coo', id, 'Demande de Développement : Partie 1 Rejetée', 'Une demande de développement a été corrigée après rejet.'),
          sendNotification('chefdeproduit', id, 'Demande de Développement : Partie 1 Rejetée', 'Une demande a été corrigée après rejet et est prête pour examen.')
        ]);
      } else {
        toast.error(`Échec de la mise à jour des données du formulaire : ${responseData.message}`, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(`Une erreur est survenue lors de la mise à jour du formulaire : ${error.message}`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const sendNotification = async (receiverRole, requestId, type, message) => {
    try {
      const notificationResponse = await fetch('http://localhost:5000/api/users/create-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: userId,
          role: role,
          receiverRole: receiverRole,
          type: type,
          message: message,
          id_dem: requestId,
        }),
      });
      // if (notificationResponse.ok) {
      //   toast.success(`Notification envoyée avec succès à ${receiverRole}`);
      // } else {
      //   const notificationError = await notificationResponse.text();
      //   toast.error(`Échec de la création de la notification : ${notificationError}`);
      // }
    } catch (error) {
      toast.error(`Une erreur est survenue lors de la création de la notification : ${error.message}`);
    }
  };

  useEffect(() => {
    const year = new Date().getFullYear().toString().slice(-2);
    const code = `${formData.productFamily}-${year}-${developmentNumber.toString().padStart(3, '0')}`;
    setFormData(prevState => ({ ...prevState, code }));
  }, [formData.productFamily, developmentNumber]);
  const handleChange2 = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    if (name === 'productFamily') {
      setDevelopmentNumber(prevNumber => prevNumber + 1);
    }
  };
  const [openGuide, setOpenGuide] = useState(false);
  const handleOpenGuide = () => {
    setOpenGuide(true);
  };
  const handleCloseGuide = () => {
    setOpenGuide(false);
  };
  return (
    <Container maxWidth="xl">
      <Paper elevation={3} style={{
        padding: '20px', marginTop: '20px', marginBottom: '20px', borderRadius: '10px', borderBottom: '2px solid #243242'
      }}>
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
          Correction de la Demande de Développement après Rejet
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
        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
          <Grid container spacing={3}>




            <Grid item xs={12}> <Paper elevation={3} sx={{ padding: '10px', backgroundColor: '#FDF1B8 ', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: '7px', display: 'flex', flexDirection: 'column', gap: '1px', border: '1px solid #e0e0e0', }} > {formData.rejectionComments ? (<> <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', }} > <Typography variant="h6" sx={{ color: '#C62828', fontWeight: '600', display: 'flex', alignItems: 'center', }} > <ErrorOutlineIcon sx={{ marginRight: '5px', fontSize: '18px', color: '#C62828' }} /> Raison du rejet : </Typography> <Typography variant="body1" sx={{ lineHeight: '1.6', color: '#4f4f4f', backgroundColor: '#f5f5f5', padding: '8px 12px', borderRadius: '6px', fontSize: '0.95rem', }} > {formData.rejectionComments} </Typography> </Box> <Typography variant="body2" color="textSecondary" sx={{ paddingLeft: '8px', fontStyle: 'italic', marginTop: '6px', color: '#757575', }} > Merci de prendre en compte ces points pour améliorer la demande. </Typography> </>) : (<Typography variant="body1" color="textSecondary" textAlign="center" sx={{ padding: '10px 0', fontSize: '0.95rem', color: '#757575', }} > Aucun commentaire de rejet pour cette demande. </Typography>)} </Paper> </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                label="Date de création *"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onClick={(e) => e.target.focus()}
                InputLabelProps={{
                  shrink: true,
                  style: { fontSize: '1rem', color: '#555' },
                }}
                error={!!errors.date}
                helperText={errors.date}
                inputProps={{
                  style: {
                    cursor: 'pointer',
                    height: '45px',
                    padding: '0 12px',
                  },
                }}
                InputProps={{
                  style: {
                    borderRadius: '6px',
                    backgroundColor: '#f9f9f9',
                  },
                }}
                FormHelperTextProps={{
                  style: { fontSize: '0.75rem', color: '#d32f2f', marginTop: '4px' },
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                label="Date Objectif de Mise en industrialisation *"
                name="dateObjectif"
                value={formData.dateObjectif}
                onChange={handleChange}
                onClick={(e) => e.target.focus()}
                InputLabelProps={{
                  shrink: true,
                  style: { fontSize: '1rem', color: '#555' },
                }}
                error={!!errors.dateObjectif}
                helperText={errors.dateObjectif}
                inputProps={{
                  style: {
                    cursor: 'pointer',
                    height: '45px',
                    padding: '0 12px',
                  },
                }}
                InputProps={{
                  style: {
                    borderRadius: '6px',
                    backgroundColor: '#f9f9f9',
                  },
                }}
                FormHelperTextProps={{
                  style: { fontSize: '0.75rem', color: '#d32f2f', marginTop: '4px' },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Raison du développement *</Typography>
              {errors.raisonDeveloppement && (
                <Typography color="error" variant="body2">
                  {errors.raisonDeveloppement}
                </Typography>
              )}
            </Grid>
            <Grid container spacing={2} style={{
              borderRadius: '10px',
              marginTop: '10px',
              border: '0.5px solid #C0C0C0',
              marginLeft: '25px',
              padding: '10px',
              justifyContent: 'center',
              alignItems: 'flex-start',
              backgroundColor: '#f9f9f9' // Ajoute un fond clair pour améliorer la visibilité
            }}>
              <Grid container spacing={2} style={{ marginLeft: '30px' }}>
                {['Une demande du client', 'Une analyse de produit', 'Analyse des coûts', 'Un changement de fournisseur', 'Une analyse de la concurrence', 'Une analyse de la prospection'].map((raison) => (
                  <Grid item xs={12} md={6} key={raison}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.raisonDeveloppement.some(item => item.raison === raison)}
                          onChange={handleCheckboxChange}
                          name="raisonDeveloppement"
                          value={raison}
                        />
                      }
                      label={raison}
                    />
                    {formData.raisonDeveloppement.some(item => item.raison === raison) && (
                      <Button
                        variant="contained"
                        component="label"
                        startIcon={<FileIcon />}
                        style={{
                          marginTop: '10px',
                          padding: '4px 10px', // Réduit le padding pour un bouton plus petit
                          fontSize: '12px',   // Réduit la taille de la police
                          minWidth: '120px',  // Définir une largeur minimale pour le bouton
                          borderRadius: '4px', // Ajuste les coins du bouton
                          display: 'flex'
                        }}
                      >
                        modifier le fichier
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileChange(raison, e)}
                        />
                      </Button>
                    )}
                    {formData.raisonDeveloppement
                      .filter(item => item.raison === raison && item.file)
                      .map(item => (
                        <Button
                          key={item.file}
                          variant="outlined"
                          target="_blank"

                          component={Link}
                          to={`http://localhost:5000/${item.file}`}
                          style={{ marginTop: '10px', display: 'flex', padding: '4px 10px', }}
                        >
                          Voir le fichier
                        </Button>
                      ))}
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="productFamily-label">Famille du produit *</InputLabel>
                <Select
                  labelId="productFamily-label *"
                  label="Famille du produit *"
                  name="productFamily"
                  value={formData.productFamily || ''}
                  onChange={handleChange}
                  error={Boolean(errors.productFamily)}
                >
                  <MenuItem value="COC">COC: Collection Technique</MenuItem>
                  <MenuItem value="COX">COX: Collection Textile</MenuItem>
                  <MenuItem value="ROL">ROL: Store enrouleur</MenuItem>
                  <MenuItem value="ROM">ROM: Store Bateau</MenuItem>
                  <MenuItem value="VER">VER: Store Vertical</MenuItem>
                  <MenuItem value="DUO">DUO: Store Duo</MenuItem>
                  <MenuItem value="CRT">CRT: Rideaux</MenuItem>
                  <MenuItem value="VIT">VIT: Voilage</MenuItem>
                  <MenuItem value="ACC">ACC: Accessoires</MenuItem>
                </Select>
                {errors.productFamily && <Typography color="error">{errors.productFamily}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code *"
                name="code"
                value={formData.code || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Problématique *"
                name="problematique"
                value={formData.problematique}
                onChange={handleChange}
                error={!!errors.problematique}
                helperText={errors.problematique}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Objectif de développement *"
                name="objectifDeveloppement"
                value={formData.objectifDeveloppement}
                onChange={handleChange}
                error={!!errors.objectifDeveloppement}
                helperText={errors.objectifDeveloppement}
              />
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
      <ToastContainer />
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
          >Lorsque vous cliquez sur 'Soumettre', la demande sera envoyée au chef de produit pour qu'il prenne en charge. Assurez-vous que toutes les informations sont correctes avant de soumettre.
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
    </Container>
  );
};

export default EditDevelopmentRequest1;
