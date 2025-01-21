import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DogCard from './DogCard';
import ReactConfetti from 'react-confetti'; // Import react-confetti
import './MatchResults.css'; // For CSS animation

const MatchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = location.state || { favorites: [] };
  const [match, setMatch] = useState(null);
  const [isMatchVisible, setIsMatchVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // State for confetti

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
    setShowConfetti(true); // Trigger confetti
    setTimeout(() => {
      setShowConfetti(false); // Stop confetti after 3 seconds
    }, 6000);
  };

  const handleBackClick = () => {
    navigate('/search'); // Navigate back to the search page
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true); // Show the logout confirmation dialog
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false); // Close the dialog without logging out
  };

  const handleConfirmLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffe5e5', minHeight: '100vh', padding: '20px', position: 'relative' }}>
      {/* Confetti */}
      {showConfetti && <ReactConfetti />}

      {/* Logout Icon Button */}
      <IconButton
        onClick={handleLogoutClick}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: '#ff1744',
        }}
      >
        <LogoutIcon fontSize="large" />
      </IconButton>

      {/* Title */}
      <Typography variant="h4" gutterBottom style={{ color: '#6c63ff', fontWeight: 'bold', textAlign: 'center' }}>
        Your Pawfect Match Result
      </Typography>

      {/* Display Favorite Dogs */}
      {!isMatchVisible && (
        <>
          <Typography variant="h6" gutterBottom style={{ textAlign: 'center' }}>
            Your Favorite Dogs:
          </Typography>
          <Grid container style={{ textAlign: 'center' }} spacing={2}>
            {favorites.map((dog, index) => (
              <Grid item xs={12} sm={6} md={4} key={dog.id || index}>
                <DogCard
                  dog={dog}
                  isFavorite={true}
                  hideFavoriteButton={true}
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
            Your Pawfect Match is:
          </Typography>
          {!isMatchVisible && (
            <Button
              onClick={handleMatchClick}
              style={{
                backgroundColor: '#6c63ff',
                color: '#fff',
                marginBottom: '20px',
              }}
              variant="contained"
            >
              Reveal Your Match
            </Button>
          )}
          <br />
          {isMatchVisible && (
            <div
              className={`match-details ${isMatchVisible ? 'show' : ''}`}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow:
                  'rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px',
                textAlign: 'center',
                maxWidth: '300px',
                margin: '0 auto',
              }}
            >
              <img src={match.img} alt={match.name} style={{ width: '100%', borderRadius: '8px' }} />
              <Typography variant="h2" style={{ marginTop: '10px', fontWeight: 'bold' }}>
                {match.name}
              </Typography>
              <img
                src="https://media.giphy.com/media/AmQYN58W99irb19ot8/giphy.gif?cid=790b7611lh7duxxv17mrbow73lijxodqb3tfq3m2m6gorvno&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                alt="Celebration"
                style={{ width: '100%', marginTop: '20px' }}
              />
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
          }}
        >
          Back to Search
        </Button>
      </Grid>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onClose={handleCancelLogout}>
        <DialogTitle>Leaving so soon, hooman?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="secondary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MatchResults;
