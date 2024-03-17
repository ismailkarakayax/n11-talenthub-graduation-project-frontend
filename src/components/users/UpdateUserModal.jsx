import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Alert } from '@mui/material';
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

const UpdateUserModal = ({ isOpen, user, onUpdate, onClose }) => {
  const [updatedUser, setUpdatedUser] = useState(user);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUpdatedUser(user);
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await baseAxios.put(`/api/v1/users/${updatedUser.id}`, updatedUser);
      onUpdate();
      onClose();
    } catch (error) {
      console.error(`Error updating user with ID ${updatedUser.id}:`, error);
      if (error.response && error.response.data && error.response.data.data && error.response.data.data.description) {
        setError(error.response.data.data.description);
      } else {
        setError('An error occurred.');
      }
    }
  };
  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">Update User</Typography>
        <TextField fullWidth margin="normal" label="Name" name="name" value={updatedUser?.name || ''} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Surname" name="surname" value={updatedUser?.surname || ''} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Birth Date" name="birthDate" value={updatedUser?.birthDate || ''} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={updatedUser?.email || ''} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Latitude" name="latitude" value={updatedUser?.latitude || ''} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Longitude" name="longitude" value={updatedUser?.longitude || ''} onChange={handleInputChange} />
        <FormControl fullWidth margin="normal">
          <InputLabel id="gender-label">Select Gender</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={updatedUser?.gender || ''}
            onChange={handleInputChange}
            name="gender"
          >
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleUpdate}>Update User</Button>
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

export default UpdateUserModal;