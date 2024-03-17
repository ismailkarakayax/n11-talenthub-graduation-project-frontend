import React, { useState, useEffect } from 'react';
import { Modal, Table, TableHead, TableBody, TableRow, TableCell, Box, Typography, Chip, Button, TextField, MenuItem, Select, Alert } from '@mui/material';
import { baseAxios } from '../../utils/base-axios';
import StarIcon from '@mui/icons-material/Star';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ReviewModal = ({ restaurant, onClose, isOpen }) => {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editIndex, setEditIndex] = useState(-1); // Index of the review being edited
  const [editedReview, setEditedReview] = useState(null); // Hold edited review data
  const [error, setError] = useState(null);

  useEffect(() => {
    if (restaurant) {
      getReviewsByRestaurantId(restaurant);
      fetchUsers();
    }
  }, [restaurant]);

  const fetchUsers = async () => {
    try {
      const response = await baseAxios.get(`/api/v1/users`);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getReviewsByRestaurantId = async (restaurant) => {
    try {
      console.log('Restaurant ID:', restaurant.id);
      const response = await baseAxios.get(`/api/v1/reviews/restaurantId/${restaurant.id}`);
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleScoreChange = (event) => {
    setScore(event.target.value);
  };

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await baseAxios.post(`/api/v1/reviews`, {
        userId: userId,
        restaurantId: restaurant.id,
        score: score,
        comment: comment
      });
      getReviewsByRestaurantId(restaurant);
      setComment('');
      setScore(0);
      setUserId('');
      setIsAddingReview(false);
    } catch (error) {
      console.error('Error adding review:', error);
      if (error.response && error.response.data && error.response.data.data && error.response.data.data.description) {
        setError(error.response.data.data.description);
      } else {
        setError('Bir hata oluştu.');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await baseAxios.delete(`/api/v1/reviews/${reviewId}`);
      getReviewsByRestaurantId(restaurant);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedReview(reviews[index]); // Store the original review data
  };

  const handleSaveEdit = async (reviewId, updatedReview) => {
    try {
      await baseAxios.put(`/api/v1/reviews/${reviewId}`, updatedReview);
      getReviewsByRestaurantId(restaurant);
      setEditIndex(-1);
    } catch (error) {
      console.error('Error updating review:', error);
      if (error.response && error.response.data && error.response.data.data && error.response.data.data.description) {
        setError(error.response.data.data.description);
      } else {
        setError('Bir hata oluştu.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(-1);
    // Reset edited review data to revert changes
    setEditedReview(null);
  };
  const handleCloseError = () => {
    setError(null);
  };

return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">Yorumlar</Typography>
        {isAddingReview ? (
          <Box mt={2}>
            <Typography variant="h6">Yorum Ekle</Typography>
            <Select
              value={userId}
              onChange={handleUserIdChange}
              fullWidth
            >
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  id:{user.id} name:{user.name} {user.surname}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Yorum"
              multiline
              rows={4}
              value={comment}
              onChange={handleCommentChange}
            />
            <TextField
              label="Puan"
              type="number"
              value={score}
              onChange={handleScoreChange}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Gönder</Button>
            <Button variant="contained" color="secondary" onClick={() => setIsAddingReview(false)}>İptal</Button>
          </Box>
        ) : (
          <Button variant="contained" color="primary" onClick={() => setIsAddingReview(true)}>Yorum Ekle</Button>
        )}
        
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell >İsim</TableCell>
              <TableCell>Puan</TableCell>
              <TableCell>Yorum</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review, index) => (
              <TableRow key={review.id}>
                <TableCell>{review.userId}</TableCell>
                <TableCell>{review.userFullName}</TableCell>
                <TableCell>
                  {editIndex === index ? (
                    <TextField
                      type="number"
                      value={editedReview ? editedReview.score : review.score}
                      onChange={(e) => {
                        const updatedReviews = [...reviews];
                        updatedReviews[index].score = parseInt(e.target.value);
                        setReviews(updatedReviews);
                      }}
                    />
                  ) : (
                    <Chip
                      icon={<StarIcon />}
                      label={review.score}
                      color="primary"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {editIndex === index ? (
                    <TextField
                      value={editedReview ? editedReview.comment : review.comment}
                      onChange={(e) => {
                        const updatedReviews = [...reviews];
                        updatedReviews[index].comment = e.target.value;
                        setReviews(updatedReviews);
                      }}
                    />
                  ) : (
                    review.comment
                  )}
                </TableCell>
                <TableCell>
                  {editIndex === index ? (
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveEdit(review.id, reviews[index])}
                      >
                        Kaydet
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCancelEdit}
                      >
                        İptal
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleEdit(index)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Sil
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

export default ReviewModal; 
