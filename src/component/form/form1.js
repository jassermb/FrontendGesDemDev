import React, { useState, useEffect } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import {
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Grid, Dialog, DialogActions, FormHelperText, DialogContent, DialogTitle,
  Paper, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FormDemandeDeveloppement = () => {
  const [developmentNumber, setDevelopmentNumber] = useState(1);
  const navigate = useNavigate();
  const [openGuide, setOpenGuide] = useState(false);
  const handleOpenGuide = () => {
    setOpenGuide(true);
  };
  const handleCloseGuide = () => {
    setOpenGuide(false);
  };
  const [formData, setFormData] = useState({
    chefDeProduit: '',
    date: '',
    dateObjectif: '',
    raisonDeveloppement: [],
    problematique: '',
    objectifDeveloppement: '',
    productFamily: '',
    code: '',
    donneeBase: '',
    estimationVente: '',
    gravite: '',
    risqueImpact: '',
    planAction: '',
    estimationGain: '',
    files: {}
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '' // Reset l'erreur pour ce champ
    }));
  };
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

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      raisonDeveloppement: checked
        ? [...prevData.raisonDeveloppement, value]
        : prevData.raisonDeveloppement.filter((raison) => raison !== value),
    }));
  };
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

  const handleFileChange = (raison, event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      files: {
        ...prevData.files,
        [raison]: file,
      },
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
    if (!formData.productFamily) newErrors.productFamily = 'Famille du produit est requise.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Veuillez remplir tous les champs obligatoires avant de soumettre.');
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append('id_demondeur', userId);
    formDataToSend.append('role', role);
    formDataToSend.append('dateObjectifMiseEnIndustrialisation', formData.dateObjectif);
    formDataToSend.append('problematique', formData.problematique);
    formDataToSend.append('code', formData.code);

    formDataToSend.append('objectifDevelopment', formData.objectifDeveloppement);
    const raisonDeveloppementJSON = JSON.stringify(formData.raisonDeveloppement.map(raison => ({
      raison,
      file: formData.files[raison] ? formData.files[raison].name : null
    })));
    formDataToSend.append('raisonDeveloppement', raisonDeveloppementJSON);
    Object.keys(formData.files).forEach((key) => {
      formDataToSend.append('files', formData.files[key]);
    });
    try {
      const response = await fetch('http://localhost:5000/api/demdev/demande1-developpement', {
        method: 'POST',
        body: formDataToSend,
      });
      const responseData = await response.json();
      if (response.ok) {
        const requestId = responseData.requestId;
        toast.success('Demande de développement enregistrée avec succès', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate('/tableau');
          window.location.reload();
        }, 3000);
        await Promise.all([
          sendNotification('coo', requestId, 'Development Request part 1', `Une nouvelle demande de développement a été créée `),
          sendNotification('chefdeproduit', requestId, 'Development Request part 1', `une nouvelle demande est prête pour examen `)
        ]);
      } else {
        toast.error(`Échec de l'envoi des données du formulaire : ${responseData.message}`, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(`Une erreur est survenue lors de l'envoi du formulaire : ${error.message}`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

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
      if (notificationResponse.ok) {
        toast.success(`Notification envoyée avec succès à ${receiverRole}`);
      } else {
        const notificationError = await notificationResponse.text();
        toast.error(`Échec de la création de la notification : ${notificationError}`);
      }
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

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', marginBottom: '10px', borderRadius: '10px',borderBottom:'1px solid #09193f' }}>
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
              Développement Produit 
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
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} style={{ paddingTop: '10px' }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                label="Date de création"
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
                label="Date Objectif de Mise en industrialisation"
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
              <Typography variant="h6">Raison du développement</Typography>
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
              backgroundColor: '#f9f9f9' 
            }}>
              {['Une demande du client', 'Une analyse de produit', 'Analyse des coûts', 'Un changement de fournisseur', 'Une analyse de la concurrence', 'Une analyse de la prospection'].map((raison, index) => (
                <Grid item xs={12} md={4} key={raison} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="raisonDeveloppement"
                        value={raison}
                        checked={formData.raisonDeveloppement.includes(raison)}
                        onChange={handleCheckboxChange}
                        color="primary"
                      />
                    }
                    label={raison}
                    style={{ marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}
                  />
                  {formData.raisonDeveloppement.includes(raison) && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '5px',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      backgroundColor: '#fff',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}>
                      <label htmlFor={`file-upload-${raison}`} style={{ marginRight: '10px', fontSize: '0.8rem', color: '#333', flex: '1' }}>
                        Télécharger le fichier:
                      </label>
                      <input
                        id={`file-upload-${raison}`}
                        type="file"
                        onChange={(event) => handleFileChange(raison, event)}
                        style={{
                          flex: '2',
                          fontSize: '0.8rem',
                          padding: '4px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          maxWidth: '100%',
                          outline: 'none',
                          transition: 'border-color 0.3s ease',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#ddd'}
                      />
                    </div>
                  )}
                </Grid>
              ))}
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
                label="Code"
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
                label="Problématique"
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
                label="Objectif du développement"
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
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // ombre subtile
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

export default FormDemandeDeveloppement;
