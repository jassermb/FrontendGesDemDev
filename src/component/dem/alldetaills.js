import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Delete } from '@mui/icons-material';
import {
    Typography, Grid, TextField, Button, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, Tooltip,
    TableRow, Paper, InputLabel, FormControl, Select, Box,
    MenuItem, Container
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DevelopmentRequestDetails from '../dem/part2form';
import Developmentpart1RequestDetails from '../dem/part1form';
import { ToastContainer, toast } from 'react-toastify';
import DataDisplayPage from './detailsdemdevpart3'

const Alldetailsdemdev = () => {
    const { id } = useParams();
    
    return (
        <Container maxWidth="xl"  >
            <Developmentpart1RequestDetails requestId={id} />
            <DevelopmentRequestDetails requestId={id} />
            <DataDisplayPage id_demdev={id} />

       
            <ToastContainer />
        </Container>
    );
};

export default Alldetailsdemdev;
