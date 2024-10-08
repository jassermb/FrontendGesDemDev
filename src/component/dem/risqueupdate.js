import React from 'react';
import { Box, Stack, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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

        <FormControl variant="outlined" size="small">
          <InputLabel>Gravité</InputLabel>
          <Select
            value={item.gravite || ''}
            onChange={(e) => handleRisqueImpactChange(index, 'gravite', e.target.value)}
            label="Gravité"
            name={`gravite-${index}`}
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

export default RisqueImpactField;
