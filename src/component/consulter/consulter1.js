import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Grid, Paper, Container, Divider, Button, Link, Box } from '@mui/material';
import { Description as FileIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';

const Consulter1 = () => {
  const [data, setData] = useState(null);
  const { id } = useParams(); // On récupère l'id depuis l'URL
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/demdev/demande1-developpement/${id}`
        );
        setData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };
    fetchData();
  }, [id]); // Utilise l'id ici dans la dépendance

  if (!data) {
    return <Typography variant="h6">Chargement...</Typography>;
  }

  const raisonDevelopment = JSON.parse(data.raisonDevelopment);
  const formattedDateObjectif = format(
    new Date(data.dateObjectifMiseEnIndustrialisation),
    'dd/MM/yyyy'
  );
  const formattedDateCreation = format(new Date(data.dateCreation), 'dd/MM/yyyy');

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, backgroundColor: '#f0f4f7', borderTop: '2px solid #00509E' }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            borderBottom: '1px solid #00509E',
            pb: 1,
          }}
        >
          Développement Produit
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 1.5, backgroundColor: '#fff', borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
              <Typography variant="subtitle2" color="textSecondary">Date Objectif Mise en Industrialisation</Typography>
              <Typography variant="body2">{formattedDateObjectif}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 1.5, backgroundColor: '#fff', borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
              <Typography variant="subtitle2" color="textSecondary">Date de Création</Typography>
              <Typography variant="body2">{formattedDateCreation}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ p: 1.5, backgroundColor: '#fff', borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
              <Typography variant="subtitle2" color="textSecondary">Raison du Développement</Typography>
              {raisonDevelopment.map((item, index) => (
                <Paper key={index} sx={{ p: 1.5, mt: 1, border: 1, borderColor: 'grey.200' }}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body2">{item.raison}</Typography>
                    </Grid>
                    {item.file && (
                      <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<FileIcon />}
                          component={Link}
                          href={`http://localhost:5000/${item.file}`}
                          target="_blank"
                          rel="noopener"
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.8rem',
                          }}
                        >
                          Télécharger
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              ))}
            </Box>
          </Grid>

          {[
            { title: 'Problématique', content: data.problematique },
            { title: 'Objectif du Développement', content: data.objectifDevelopment },
            { title: 'Code', content: data.code },
          ].map((item, index) => (
            <Grid item xs={12} key={index}>
              <Box sx={{ p: 1.5, backgroundColor: '#fff', borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
                <Typography variant="subtitle2" color="textSecondary">{item.title}</Typography>
                <Typography variant="body2">{item.content}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Consulter1;
