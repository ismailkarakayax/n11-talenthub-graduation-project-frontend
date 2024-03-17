import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button , Alert} from '@mui/material';
import { baseAxios } from '../../utils/base-axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CreateRestaurantModal =({ isOpen, onSave, onClose }) => {
    const [newRestaurant, setNewRestaurant] = useState({
      name: '',
      latitude: '',
      longitude: ''
    });
    const [error, setError] = useState(null);


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewRestaurant({ ...newRestaurant, [name]: value });
    };

    const handleSave = async () => {
        try {
          await baseAxios.post('/api/v1/restaurants', newRestaurant);
          onSave();
          onClose();
        } catch (error) {
          console.error('Error saving user:', error);
          if (error.response && error.response.data && error.response.data.data && error.response.data.data.description) {
            setError(error.response.data.data.description);
          } else {
            setError('Bir hata oluştu.');
          }
        }
    };

    const handleCloseError = () => {
      setError(null);
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
          <Box sx={style}>
            <Typography variant="h6">Yeni Restaurant Oluştur</Typography>
            <TextField fullWidth margin="normal" label="Restoran adı" name="name" value={newRestaurant.name} onChange={handleInputChange} />
            <TextField fullWidth margin="normal" label="Enlem" name="latitude" value={newRestaurant.latitude} onChange={handleInputChange} />
            <TextField fullWidth margin="normal" label="Boylam" name="longitude" value={newRestaurant.longitude} onChange={handleInputChange} />
            <Button variant="contained" onClick={handleSave}>Restoranı Kaydet</Button>
            <Button variant="contained" onClick={onClose}>Kapat</Button>
            {error && 
        <Alert severity="error" onClose={handleCloseError}>
          {error.replace('[', '').replace(']', '').split(',').map((errorMsg, index) => (
            <div key={index}>{errorMsg.trim()}</div>
          ))}
        </Alert>
        }
          </Box>
        </Modal>
      );
    
};
export default CreateRestaurantModal;