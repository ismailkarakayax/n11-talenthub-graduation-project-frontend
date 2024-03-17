import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Alert } from '@mui/material';
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

const UpdateRestaurantModal = ({ isOpen, restaurant, onUpdate, onClose }) => {
  const [updatedRestaurant, setUpdatedRestaurant] = useState(restaurant);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUpdatedRestaurant(restaurant);
  }, [restaurant]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedRestaurant({ ...updatedRestaurant, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await baseAxios.put(`/api/v1/restaurants/${updatedRestaurant.id}`, updatedRestaurant);
      onUpdate();
      onClose();
    } catch (error) {
      console.error(`Error updating restaurant with ID ${updatedRestaurant.id}:`, error);
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
        <Typography variant="h6">Update Restaurant</Typography>
        <TextField fullWidth margin="normal" label="Restaurant Name" name="name" value={updatedRestaurant?.name || ''} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Latitude" name="latitude" value={updatedRestaurant?.latitude || ''} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Longitude" name="longitude" value={updatedRestaurant?.longitude || ''} onChange={handleInputChange} />
        <Button variant="contained" onClick={handleUpdate}>Save Restaurant</Button>
        <Button variant="contained" onClick={onClose}>Close</Button>
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

export default UpdateRestaurantModal;