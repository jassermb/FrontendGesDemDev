
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Divider, Paper, Container, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Developmentpart1RequestDetails from './part1form';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RisqueImpactField from './risqueupdate';
const EditDevelopmentRequest = () => {
  const { id } = useParams();
  const [openGuide, setOpenGuide] = useState(false);
  const [developmentNumber, setDevelopmentNumber] = useState(1);
  const [formData, setFormData] = useState({
    code: '',
    productFamily: '',
    gravite: '',
    planAction: '',
    estimationGain: '',
    RisqueImpact: [{ description: '', gravite: '', planAction: '' }],
    rejectionComments: '',
    designationFrs: '',
    donneeBase: {
      designation: '',
      consommationAnnuelle: '',
      prixActuel: '',
      unitePrixActuel: '',
      fournisseur: '',
      designationFournisseur: '',
      documentsQualite: '',
      estimationVente: '',
    },
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/demdev/demdev2/${id}`);
        const data = response.data[0];;
        const [prix, unite] = (data.prixActuel || '').split(' ');
        data.RisqueImpact = Array.isArray(data.RisqueImpact) ? data.RisqueImpact : JSON.parse(data.RisqueImpact || "[]");

        setFormData({
          code: data.code || '',
          productFamily: data.productFamily || '',
          gravite: data.gravite || '',
          planAction: data.planAction || '',
          estimationGain: data.estimationDeGain || '',
          RisqueImpact: data.RisqueImpact,
          donneeBase: {
            designation: data.designation || '',
            consommationAnnuelle: data.consommationAnnuelle2024 || '',
            prixActuel: prix || '',
            unitePrixActuel: unite || '',
            fournisseur: data.fournisseur || '',
            designationFournisseur: data.designationFournisseur || '',
            documentsQualite: data.documentsQualite || '',
            estimationVente: data.estimationDeVente || '',
          },
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        toast.error('Une erreur est survenue lors de la récupération des données.');
      }
    };
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
    fetchData();
  }, [id]);
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
    const year = new Date().getFullYear().toString().slice(-2);
    const code = `${formData.productFamily}-${year}-${developmentNumber.toString().padStart(3, '0')}`;
    setFormData(prevState => ({ ...prevState, code }));
  }, [formData.productFamily, developmentNumber]);
  useEffect(() => {
    fetchLastSerialNumber(formData.productFamily);
  }, [formData.productFamily]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleDonneeBaseChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      donneeBase: {
        ...prevState.donneeBase,
        [name]: value,
      },
    }));
  };
  const handleUniteChange = (event) => {
    const { value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      donneeBase: {
        ...prevState.donneeBase,
        unitePrixActuel: value,
      },
    }));
  };
  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRisqueImpactChange = (index, field, value) => {
    setFormData(prevState => {
      const updatedRisquesImpacts = prevState.RisqueImpact.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return {
        ...prevState,
        RisqueImpact: updatedRisquesImpacts
      };
    });
  };

  const handleAddRisqueImpact = () => {
    setFormData(prevState => ({
      ...prevState,
      RisqueImpact: [...prevState.RisqueImpact, { description: '', gravite: '', planAction: '' }]
    }));
  };

  const handleRemoveRisqueImpact = (index) => {
    setFormData(prevState => ({
      ...prevState,
      RisqueImpact: prevState.RisqueImpact.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { donneeBase, gravite, planAction, estimationGain } = formData;
    if (!donneeBase.designation) newErrors['donneeBase.designation'] = 'Désignation est requise.';
    if (donneeBase.consommationAnnuelle && isNaN(donneeBase.consommationAnnuelle)) newErrors['donneeBase.consommationAnnuelle'] = 'Consommation annuelle doit être un nombre.';
    if (donneeBase.prixActuel && isNaN(parseFloat(donneeBase.prixActuel))) newErrors['donneeBase.prixActuel'] = 'Prix actuel doit être un nombre.';
    if (donneeBase.estimationVente && isNaN(donneeBase.estimationVente)) newErrors['donneeBase.estimationVente'] = 'Estimation de vente doit être un nombre.';
    if (gravite === 'Majeure' && !planAction) newErrors.planAction = 'Plan d\'action est requis pour une gravité majeure.';
    if (!estimationGain) newErrors.estimationGain = 'Estimation de Gain est requise.';
    if (formData.RisqueImpact.length === 0) newErrors.RisqueImpact = 'Risque et Impact sont requis.';
    if (!donneeBase.designationFournisseur) newErrors['donneeBase.designationFournisseur'] = 'Désignation du Fournisseur est requise.';
    if (!donneeBase.unitePrixActuel) newErrors['donneeBase.unitePrixActuel'] = 'Unité de Prix actuel est requise.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }
    try {
      const id_demdev = id;
      const prixActuelUnite = `${formData.donneeBase.prixActuel} ${formData.donneeBase.unitePrixActuel}`;
      const updatedFormData = {
        ...formData.donneeBase,
        prixActuelUnite,
      };

      await axios.put(`http://localhost:5000/api/demdev/putdonneesbase/${id_demdev}`, updatedFormData);
      await axios.put(`http://localhost:5000/api/demdev/demandes/${id}`, {
        code: formData.code,
        estimationGain: formData.estimationGain,
        validationCOO: 'en attente2',
        RisqueImpact: formData.RisqueImpact,
        status: 'prise en charge'
      });
      toast.success('La demande de développement a été mise à jour avec succès.');
      setTimeout(() => {
        navigate('/tableau');
        window.location.reload();
      }, 3000);

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
      toast.error('Une erreur est survenue lors de la mise à jour de la demande de développement.');
    }
  };


  const handleOpenGuide = () => {
    setOpenGuide(true);
  };

  const handleCloseGuide = () => {
    setOpenGuide(false);
  };
  const RisqueImpactField = ({ index, item, handleRisqueImpactChange, handleRemoveRisqueImpact }) => {
    return (
      <Box
        sx={{
          mb: 1,
          p: 1,
          border: '0.5px solid #ddd',
          borderRadius: '8px',
          boxShadow: 1,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Description du Risque"
            name={`description-${index}`}
            value={item.description || ''}
            onChange={(e) => handleRisqueImpactChange(index, 'description', e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            multiline
            rows={2}
          />
  
          <FormControl variant="outlined" size="small" > 
            <InputLabel>Gravité</InputLabel>
            <Select
              value={item.gravite || ''}
              onChange={(e) => handleRisqueImpactChange(index, 'gravite', e.target.value)}
              label="Gravité"
              name={`gravite-${index}`}
              rows={2}
              fullWidth


            >
              <MenuItem value="Mineure">Mineure</MenuItem>
              <MenuItem value="Majeure">Majeure</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Plan d'Action"
            name={`planAction-${index}`}
            value={item.planAction || ''}
            onChange={(e) => handleRisqueImpactChange(index, 'planAction', e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            multiline
            rows={2}
          />
          
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleRemoveRisqueImpact(index)}
            startIcon={<DeleteIcon />}
          >
            Supprimer
          </Button>
        </Stack>
      </Box>
    );
  };










  return (
    <Container maxWidth="xl">
      <Developmentpart1RequestDetails requestId={id} />

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginBottom: '30px' }}>
                Correction de la Demande de Développement après Rejet
              </Typography>
            </Grid>

            <Grid item>
              <Button
                variant="outlined"
                onClick={handleOpenGuide}
                style={{
                  borderRadius: '8px',
                  borderColor: '#FF5733',
                  color: '#C70039',
                  padding: '8px 16px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
              >
                Voir les instructions
              </Button>
            </Grid>
          </Grid>
          <Divider />
          <Grid item>

          </Grid>
          <Grid item xs={12}>
            {/* <Typography variant="h6">Commentaires du chef de produit</Typography> */}
            <Paper elevation={2} style={{ padding: '15px', backgroundColor: '#f5f5f5' }}>
              {formData.rejectionComments ? (
                <Typography variant="body1">
                  Voici la raison du rejet :  {formData.rejectionComments}.
                  <Typography variant="body1" color="textSecondary">
                    Assurez-vous de prendre en compte ces points pour améliorer la demande.
                  </Typography>
                </Typography>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  Aucun commentaire de rejet pour cette demande.
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="productFamily-label">Famille du produit *</InputLabel>
                <Select
                  labelId="productFamily-label *"
                  label="Famille du produit"
                  name="productFamily"
                  value={formData.productFamily || ''}
                  onChange={handleChange}
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
                id="code"
                name="code"
                label="Code"
                value={formData.code}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="designation"
                name="designation"
                label="Désignation"
                value={formData.donneeBase.designation}
                onChange={handleDonneeBaseChange}
                error={!!errors['donneeBase.designation']}
                helperText={errors['donneeBase.designation']}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="consommationAnnuelle"
                name="consommationAnnuelle"
                label="Consommation Annuelle"
                type="number"
                value={formData.donneeBase.consommationAnnuelle}
                onChange={handleDonneeBaseChange}
                error={!!errors['donneeBase.consommationAnnuelle']}
                helperText={errors['donneeBase.consommationAnnuelle']}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                id="prixActuel"
                name="prixActuel"
                label="Prix Actuel"
                type="number"
                value={formData.donneeBase.prixActuel}
                onChange={handleDonneeBaseChange}
                error={!!errors['donneeBase.prixActuel']}
                helperText={errors['donneeBase.prixActuel']}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="unitePrixActuel">Unité de Prix actuel *</InputLabel>
                <Select
                  name="unitePrixActuel"
                  label="Unité de Prix actuel *"
                  labelId="unitePrixActuel"
                  value={formData.donneeBase.unitePrixActuel || ''}
                  onChange={handleUniteChange}
                  error={Boolean(errors['donneeBase.unitePrixActuel'])}
                >
                  <MenuItem value="€/mL">€/mL</MenuItem>
                  <MenuItem value="$/mL">$/mL</MenuItem>
                  <MenuItem value="€/kg">€/kg</MenuItem>
                  <MenuItem value="$/kg">$/kg</MenuItem>
                </Select>
                {errors['donneeBase.unitePrixActuel'] && <Typography color="error">{errors['donneeBase.unitePrixActuel']}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="fournisseur"
                name="fournisseur"
                label="Fournisseur"
                value={formData.donneeBase.fournisseur}
                onChange={handleDonneeBaseChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="designationFournisseur"
                name="designationFournisseur"
                label="Désignation Fournisseur"
                value={formData.donneeBase.designationFournisseur}
                onChange={handleDonneeBaseChange}
                error={!!errors.designationFournisseur}
                helperText={errors.designationFournisseur}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="documentsQualite"
                name="documentsQualite"
                label="Documents Qualité"
                value={formData.donneeBase.documentsQualite}
                onChange={handleDonneeBaseChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="estimationVente"
                name="estimationVente"
                label="Estimation de Vente"
                type="number"
                value={formData.donneeBase.estimationVente}
                onChange={handleDonneeBaseChange}
              />
            </Grid>
            <Typography variant="h6" style={{ marginLeft: '10px', margin: '20px' }} gutterBottom>Etude des risques & impacts :</Typography>
            <Grid item xs={12}>
              {formData.RisqueImpact.map((item, index) => (
                <RisqueImpactField
                  key={index}
                  index={index}
                  item={item}
                  handleRisqueImpactChange={handleRisqueImpactChange}
                  handleRemoveRisqueImpact={handleRemoveRisqueImpact}
                />
              ))}


              <Button
                variant="outlined"
                onClick={handleAddRisqueImpact}
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Ajouter Risque
              </Button>
            </Grid>


            <Grid item xs={12}>
              <TextField
                fullWidth
                id="estimationGain"
                name="estimationGain"
                label="Estimation de Gain"
                type="number"
                value={formData.estimationGain}
                onChange={handleChange}
                error={!!errors.estimationGain}
                helperText={errors.estimationGain}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '20px', display: 'block', width: '100%', maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto' }}
              >
                Envoyer pour Validation

              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog open={openGuide} onClose={handleCloseGuide}>
        <DialogTitle>Instructions pour remplir le formulaire</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            Les champs marqués d'un astérisque (*) sont obligatoires. Assurez-vous de remplir toutes les informations nécessaires pour que votre demande soit complète.
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Gravité :
            <br />
            - Majeure : nécessite un plan d’action détaillé pour résoudre les problèmes identifiés.
            <br />
            - Mineure : ne nécessite pas de plan d’action mais doit être pris en compte.
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Lorsque vous cliquez sur "Envoyer pour Validation", la demande sera envoyée au COO pour approbation. Assurez-vous que toutes les informations sont correctes avant de soumettre.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGuide} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Container>
  );
};

export default EditDevelopmentRequest;
