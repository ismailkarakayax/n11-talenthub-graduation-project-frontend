import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { baseAxios } from '../../utils/base-axios';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Typography } from '@mui/material';
import CreateUserModal from '../users/CreateUserModal'; 
import UpdateUserModal from '../users/UpdateUserModal';
import RecommendModal from '../users/RecommendModal';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Grid from '@mui/material/Grid';


const UserListTable = () => {
  const [users, setUsers] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [recommendModalOpen, setRecommendModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await baseAxios.get('/api/v1/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  
  const toggleCreateModal = () => {
    setCreateModalOpen(!createModalOpen);
  };

  const toggleUpdateModal = (user) => {
    setSelectedUser(user);
    setUpdateModalOpen(!updateModalOpen);
  };

  const confirmAndDeleteUser = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      try {
        await baseAxios.delete(`/api/v1/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
      }
    }
  };

  const handleOpenRecommendModal = (userId) => {
    setSelectedUser(userId);
    setRecommendModalOpen(true);
  };

  const handleCloseRecommendModal = () => {
    setRecommendModalOpen(false);
  };

  return (
    <Paper elevation={3} style={{ padding: 20 }} >
      
      
      <Typography variant="h5" align="center" gutterBottom>User List</Typography>
        <Grid container spacing={2} justifyContent="center"> 
          <Grid item>
      <Button variant="contained" onClick={fetchUsers}>Refresh Users</Button>
      </Grid>
          <Grid item>
      <Button variant="contained" onClick={toggleCreateModal} style={{ marginLeft: 10 }}>Create User</Button>
      </Grid>
        </Grid>
      <CreateUserModal isOpen={createModalOpen} onSave={fetchUsers} onClose={toggleCreateModal} />
      <UpdateUserModal isOpen={updateModalOpen} user={selectedUser} onUpdate={fetchUsers} onClose={toggleUpdateModal} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Surname</TableCell>
            <TableCell align="center">Latitude</TableCell>
            <TableCell align="center">Longitude</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell align="center">{user.name}</TableCell>
              <TableCell align="center">{user.surname}</TableCell>
              <TableCell align="center">{user.latitude}</TableCell>
              <TableCell align="center">{user.longitude}</TableCell>
              <TableCell>
                <IconButton onClick={() => confirmAndDeleteUser(user.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => toggleUpdateModal(user)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleOpenRecommendModal(user.id)}>
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <RecommendModal userId={selectedUser} onClose={handleCloseRecommendModal} isOpen={recommendModalOpen} />
    </Paper>
  );
};

export default UserListTable;