import React, { useState } from 'react';
import Button from '@mui/material/Button';
import UserListTable from './tables/UserListTable';
import RestaurantListTable from './tables/RestaurantListTable';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

const MyComponent = () => {
  const [showUserList, setShowUserList] = useState(true);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" align="center" sx={{ flexGrow: 1 }}>
            N11 BOOTCAMP GRADUATION PROJECT
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button variant={showUserList ? "contained" : "outlined"} onClick={() => setShowUserList(true)}>USERS</Button>
          </Grid>
          <Grid item>
            <Button variant={!showUserList ? "contained" : "outlined"} onClick={() => setShowUserList(false)}>RESTAURANTS</Button>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ marginTop: 4 }}>
        {showUserList ? <UserListTable /> : <RestaurantListTable />}
      </Container>
    </Box>
  );
};

export default MyComponent;