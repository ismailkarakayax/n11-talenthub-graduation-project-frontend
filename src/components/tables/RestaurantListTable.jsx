import React, { useState, useEffect } from 'react';
import { Button, IconButton, TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import { baseAxios } from '../../utils/base-axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CreateRestaurantModal from '../restaurants/CreateRestaurantModal';
import UpdateRestaurantModal from '../restaurants/UpdateRestaurantModal';
import ReviewModal from '../restaurants/ReviewModal';
import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Grid from '@mui/material/Grid';


const RestaurantListTable = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await baseAxios.get('/api/v1/restaurants');
            setRestaurants(response.data.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    const toggleCreateModal = () => {
        setCreateModalOpen(!createModalOpen);
    };

    const toggleUpdateModal = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setUpdateModalOpen(!updateModalOpen);
    };

    const confirmAndDeleteRestaurant = async (restaurantId) => {
        const confirmed = window.confirm('Are you sure you want to delete this restaurant?');
        if (confirmed) {
            try {
                await baseAxios.delete(`/api/v1/restaurants/${restaurantId}`);
                fetchRestaurants();
            } catch (error) {
                console.error(`Error deleting restaurant with ID ${restaurantId}:`, error);
            }
        }
    };

    const handleOpenReviewModal = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setReviewModalOpen(false);
    };


    return (
        <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h5" align="center" gutterBottom>Restaurant List</Typography>
            <Grid container spacing={2} justifyContent="center"> 
                <Grid item>
            <Button variant="contained" onClick={fetchRestaurants} >Refresh Restaurants</Button>
            </Grid>
          <Grid item>
            <Button variant="contained" onClick={toggleCreateModal} style={{ marginLeft: 10 }}>Create Restaurant</Button>
            </Grid>
            </Grid>
            <CreateRestaurantModal isOpen={createModalOpen} onSave={fetchRestaurants} onClose={toggleCreateModal} />
            <UpdateRestaurantModal isOpen={updateModalOpen} restaurant={selectedRestaurant} onUpdate={fetchRestaurants} onClose={toggleUpdateModal} />
            <ReviewModal restaurant={selectedRestaurant} onClose={handleCloseReviewModal} isOpen={reviewModalOpen} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Latitude</TableCell>
                            <TableCell align="center">Longitude</TableCell>
                            <TableCell align="center">Average Score</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {restaurants.map(restaurant => (
                            <TableRow key={restaurant.id}>
                                <TableCell align="center">{restaurant.name}</TableCell>
                                <TableCell align="center">{restaurant.latitude}</TableCell>
                                <TableCell align="center">{restaurant.longitude}</TableCell>
                                <TableCell align="center">
                                    <Rating
                                        name={`rating-${restaurant.id}`}
                                        value={restaurant.averageScore}
                                        precision={0.5}
                                        readOnly
                                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => confirmAndDeleteRestaurant(restaurant.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton onClick={() => toggleUpdateModal(restaurant)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenReviewModal(restaurant)}>
                                        <RateReviewIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default RestaurantListTable;