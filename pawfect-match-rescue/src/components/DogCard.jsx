import React from 'react';
import { Card, CardContent, CardMedia, Button, Typography } from '@mui/material';

const DogCard = ({ dog, onFavoriteToggle, isFavorite, hideFavoriteButton }) => { 
    return (
      <Card
        sx={{
          width: '100%',
          boxShadow: 3,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#fafafa',
        }}
      >
        <CardMedia
          component="img"
          image={dog.img}
          alt={dog.name}
          sx={{ height: 200, objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom style={{ color: '#6c63ff' }}>
            {dog.name}
          </Typography>
          <Typography variant="body1">Name: {dog.name}</Typography>
          <Typography variant="body1">Personality: {dog.personality}</Typography>
          <Typography variant="body1">Age: {dog.age}</Typography>
          <Typography variant="body1">Zip Code: {dog.zip_code}</Typography>
  
          {/* Conditionally render the Favorite button */}
          {!hideFavoriteButton && (
            <Button
              onClick={() => onFavoriteToggle(dog)}  // Pass the entire dog object
              style={{
                backgroundColor: isFavorite ? '#ff4081' : '#6c63ff',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#5a54e0',
                },
                width: '100%',
                marginTop: '10px',
              }}
              variant="contained"
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };
  
  export default DogCard;
  