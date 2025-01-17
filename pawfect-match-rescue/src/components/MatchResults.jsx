import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@mui/material';
import DogCard from './DogCard';
import './MatchResults.css'; // For CSS animation

const MatchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = location.state || { favorites: [] };
  const [match, setMatch] = useState(null);
  const [isMatchVisible, setIsMatchVisible] = useState(false);

  console.log(location.state);

  // Find a match based on the favorites
  useEffect(() => {
    const findMatch = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(favorites),
          credentials: 'include',
        });

        const data = await response.json();
        setMatch(data.match);
      } catch (error) {
        console.error('Error finding match:', error);
      }
    };

    if (favorites.length > 0) {
      findMatch();
    }
  }, [favorites]);

  const handleMatchClick = () => {
    setIsMatchVisible(true);
  };

  const handleBackClick = () => {
    navigate('/'); // Navigate back to the search page
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ color: '#6c63ff', fontWeight: 'bold', textAlign: 'center' }}>
        Your Pawfect Match Result
      </Typography>

      {/* Display Favorite Dogs only if match is not revealed */}
      {!isMatchVisible && (
        <>
          <Typography variant="h6" gutterBottom style={{ textAlign: 'center' }}>
            Your Favorite Dogs:
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {favorites.map((dog, index) => (
              <Grid item xs={12} sm={6} md={4} key={dog.id || index}>
                <DogCard
                  dog={dog} // Pass the full dog object to DogCard
                  isFavorite={true} // Just to indicate that it's a favorite
                  hideFavoriteButton={true} // Hide the favorite button
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Display Matched Dog */}
      {match && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            You are matched with:
          </Typography>
          {!isMatchVisible && (
          <Button
            onClick={handleMatchClick}
            style={{
              backgroundColor: '#6c63ff',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#5a54e0',
              },
              marginBottom: '20px',
            }}
            variant="contained"
          >
            Reveal Your Match
          </Button>)}
          <br />

          {isMatchVisible && (
            <div
              className={`match-details ${isMatchVisible ? 'show' : ''}`}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: 'rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px',
                textAlign: 'center',
                maxWidth: '300px',
                margin: '0 auto',
              }}
            >
              <img src={match.img} alt={match.name} style={{ width: '100%', borderRadius: '8px' }} />
              <Typography variant="body1" style={{ marginTop: '10px', fontWeight: 'bold' }}>
                {match.name}
              </Typography>
            </div>
          )}
          <br />
        </div>
      )}

      {/* Back to Search Button */}
      <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
        <Button
          onClick={handleBackClick}
          variant="contained"
          style={{
            backgroundColor: '#ff4081',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#e02b5e',
            },
          }}
        >
          Back to Search
        </Button>
      </Grid>
    </div>
  );
};

export default MatchResults;
