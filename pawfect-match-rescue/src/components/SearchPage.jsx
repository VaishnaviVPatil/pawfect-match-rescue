import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DogCard from './DogCard';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [dogs, setDogs] = useState([]);
  const [breed, setBreed] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [favorites, setFavorites] = useState([]); // Store full dog object in favorites
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [breeds, setBreeds] = useState([]);
  const navigate = useNavigate();

  // Fetch breeds from the API
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          credentials: 'include',
        });
        const breedData = await response.json();
        setBreeds(breedData); // Assuming breedData is an array of breed names
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    };

    fetchBreeds();
  }, []);

  // Fetch dogs based on breed and sort order
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        if (breed) {
          const query = `https://frontend-take-home-service.fetch.com/dogs/search?sort=breed:${sortOrder}&breeds=${breed}&page=${page}`;
          const response = await fetch(query, { credentials: 'include' });
          const dogsData = await response.json();

          const ids = dogsData.resultIds.slice(0, 10); // Example: fetching first 10 results
          const detailsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ids),
            credentials: 'include',
          });
          const detailedDogs = await detailsResponse.json();

          setDogs(detailedDogs);
          setTotalPages(Math.max(1, Math.ceil(dogsData.total / 10)));
        }
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };

    fetchDogs();
  }, [breed, sortOrder, page]);

  const handleFavoriteToggle = (dog) => {
    setFavorites((prevFavorites) => {
      // If the dog is already in favorites, remove it
      const dogExists = prevFavorites.some((favDog) => favDog.id === dog.id);

      if (dogExists) {
        // Remove the dog from the favorites list
        return prevFavorites.filter((favDog) => favDog.id !== dog.id);
      } else {
        // Otherwise, add the whole dog object to favorites
        return [...prevFavorites, dog];
      }
    });
  };

  const handleGenerateMatch = () => { 
    navigate('/match-result', { state: { favorites, hideFavoriteButton: true } });
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff' }}>
      <Grid container justifyContent="center" alignItems="center">
        <Typography variant="h4" gutterBottom style={{ color: '#6c63ff', fontWeight: 'bold' }}>
          Search for your FURRY FRIEND
        </Typography>
      </Grid>

      {/* Check if no breed is selected */}
      {!breed && (
        <div style={{ textAlign: 'center' }}>
          <img src="/Images/undraw_dog_jfxm.svg" alt="No Breed Selected" style={{ width: '80%', maxWidth: '400px' }} />
        </div>
      )}

      {/* Generate Match Button */}
      {favorites.length > 0 && (
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <Button
            onClick={handleGenerateMatch}
            variant="contained"
            style={{
              backgroundColor: '#ff4081',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#e02b5e',
              },
            }}
          >
            Generate Match
          </Button>
        </Grid>
      )}
    </div>
  );
};

export default SearchPage;
