import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, TableHead, TableBody, TableRow, TableCell, Box, Typography } from '@mui/material';
import { baseAxios } from '../../utils/base-axios';
import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const RecommendModal = ({ userId, onClose, isOpen }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (userId) {
      getRecommendations(userId);
    }
  }, [userId]);

  const getRecommendations = async (userId) => {
    try {
      const response = await baseAxios.get(`/api/v1/recommendations/${userId}`);
      setRecommendations(response.data.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };


  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Typography  variant="h6">Recommendations</Typography>
        <Button onClick={onClose}>Close</Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Restaurant Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Average Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recommendations.map(recommendation => (
              <TableRow key={recommendation.id}>
                <TableCell>{recommendation.name}</TableCell>
                <TableCell>{recommendation.location}</TableCell>
                <TableCell >
                    <Rating
                        name={`rating-${recommendation.id}`}
                        value={recommendation.averageScore}
                        precision={0.5}
                        readOnly
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    />
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
};

export default RecommendModal;