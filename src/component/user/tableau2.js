import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, IconButton, Box, Typography, Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';

const Tableau2 = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/demdev/development-list');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  //   const getDateCloture = (params) => {
  //     if (!params || params.value !== null) {
  //         return null; // Afficher 'null' ou une chaîne vide lorsque la valeur existe
  //     }
  //     return params.value; 
  // };






  const handleAddClick = () => {
    navigate('/form1');
  };
  const handleViewClick = (id, status) => {
    if (status === 'Non traité' || status === 'Non pris en charge') {
      navigate(`/demdev1coo/${id}`);
    } else if (status === 'Pris en charge' || status === 'À valider (COO)' || status === 'validé (COO)' || status === 'Non validé (COO)') {
      navigate(`/Consulter2/${id}`);
    } else if (status === 'Validé (Responsable Achat)' || status === 'Non validé (Responsable Achat)') {
      navigate(`/Consulter3/${id}`);
    } else if (status === 'Clôturée (COO)' || status === 'Refus de clôture COO' || status === 'Clôturée par chef produit') {
    navigate(`/Consulterddd/${id}`);
  }else {
    return ;
}
  };
const renderDateCloture = (params) => {
  return params.value ? params.value : 'Pas encore défini';
};

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Développements');
  XLSX.writeFile(workbook, 'development_list.xlsx');
};

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'Code', headerName: 'Code', width: 120 },
  { field: 'Demandeur', headerName: 'Demandeur', width: 250 },
  {
    field: 'Date de creation',
    headerName: 'Date de création',
    width: 150,
  },
  {
    field: 'Date d\'objectif d\'industrialisation',
    headerName: 'Date d\'objectif d\'industrialisation',
    width: 250,
  },
  { field: 'status', headerName: 'Status', width: 200 },
  {
    headerName: 'Date de Clôture',
    field: 'Date de cloture',
    width: 200,
    renderCell: renderDateCloture, // Utilisation de la fonction de rendu
  }
  ,
  {
    field: 'actions',
    headerName: 'Actions',
    width: 400,
    renderCell: (params) => (
      <div>
        <IconButton
          color="primary"
          aria-label="view"
          onClick={() => handleViewClick(params.row.id, params.row.status)}
        >
          <VisibilityIcon style={{ color: '#09193f' }} />
        </IconButton>
      </div>
    ),
  }
];

return (
  <div style={{
    backgroundColor: '#f0f0f0',
    height: '750px',
    padding: '1px',
    marginBottom: '10px'
  }}>
    <div style={{
      backgroundColor: '#fff',
      height: 800,
      width: '97%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '10px',
      marginTop: '10px',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'black', mb: 2 }}>
          {/* Liste de Développement */}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }} alignItems="center">
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="contained"
              startIcon={<DescriptionIcon />}
              onClick={exportToExcel}
              sx={{
                backgroundColor: '#09193f',
                color: 'white',
                borderRadius: '5px',
                padding: '5px 10px',
                '&:hover': {
                  backgroundColor: '#115293',
                },
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}>
              Exporter en Excel
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{
                backgroundColor: '#09193f',
                color: 'white',
                borderRadius: '5px',
                padding: '5px 10px',
                '&:hover': {
                  backgroundColor: '#115293',
                },
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Box>

      <div style={{ height: 'calc(100% - 52px)', width: '100%', height: '600px' }}>
        <DataGrid
          rows={data}
          columns={columns}
          components={{
            Toolbar: GridToolbar,
          }}
          pagination
          rowsPerPageOptions={[5, 10, 20]}
          sx={{
            '& .MuiDataGrid-root': {
              border: '2px solid #000',
              '&::-webkit-scrollbar': {
                width: '8px',
                backgroundColor: '#f0f0f0',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#1976d2',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#115293',
              },
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              color: '#fff',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#000',
              minHeight: '38px',
              color: '#fff',
            },
            '& .MuiDataGrid-iconButtonContainer': {
              color: '#fff',
            },
            '& .MuiSvgIcon-root': {
              color: '#fff',
            },
            '& .MuiDataGrid-sortIcon': {
              color: '#fff',
            },
            '& .MuiDataGrid-menuIcon': {
              color: '#fff',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #000',
              color: '#000',
              borderLeft: '1px solid #ccc',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#808080',
              color: '#fff',
              height: '86px',
              padding: '0 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflow: 'hidden',

            }, '& .MuiTablePagination-toolbar': {
              fontSize: '1rem',
              fontWeight: 'bold',
              height: '26px',
              overflow: 'hidden',

            },
            '& .MuiDataGrid-toolbarContainer': {
              backgroundColor: '#f5f5f5',
              color: '#000',
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(even)': {
                backgroundColor: '#f9f9f9',
              },
              '&:nth-of-type(odd)': {
                backgroundColor: '#fff',
              },
              '&:hover': {
                backgroundColor: '#e6e6e6',
              },
            },
          }}
        />
      </div>

    </div>
  </div>
);
};

export default Tableau2;
