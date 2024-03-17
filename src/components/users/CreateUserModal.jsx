import React, { useState } from 'react';
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

const CreateUserModal = ({ isOpen, onSave, onClose }) => {
  const [newUser, setNewUser] = useState({
    name: '',
    surname: '',
    birthDate: '',
    email: '',
    latitude: '',
    longitude: '',
    gender: ''
  });
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      await baseAxios.post('/api/v1/users', newUser);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
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
        <Typography variant="h6">Create New User</Typography>
        <TextField fullWidth margin="normal" label="Name" name="name" value={newUser.name} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Surname" name="surname" value={newUser.surname} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Birth Date" name="birthDate" value={newUser.birthDate} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={newUser.email} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Latitude" name="latitude" value={newUser.latitude} onChange={handleInputChange} />
        <TextField fullWidth margin="normal" label="Longitude" name="longitude" value={newUser.longitude} onChange={handleInputChange} />
        <FormControl fullWidth margin="normal">
          <InputLabel id="gender-label">Select Gender</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={newUser.gender}
            onChange={handleInputChange}
            name="gender"
          >
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSave}>Save User</Button>
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

export default CreateUserModal;