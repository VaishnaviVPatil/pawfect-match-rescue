import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  OutlinedInput,
  Menu,
  MenuItem as MuiMenuItem
} from '@mui/material';
import DogCard from './DogCard';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('All Breeds');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [sortCriteria, setSortCriteria] = useState({ field: 'name', direction: 'asc' });
  const [zipCodes, setZipCodes] = useState([]);
  const [selectedZipCodes, setSelectedZipCodes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // For Menu anchor
  const [isZipMenuOpen, setIsZipMenuOpen] = useState(false); // Track the open state of zip code menu
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          credentials: 'include',
        });
        const data = await response.json();
        setBreeds(['All Breeds', ...data]);
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const queryParams = new URLSearchParams({
          sort: `${sortCriteria.field}:${sortCriteria.direction}`,
          size: 10,
          from: (page - 1) * 10,
          ageMin: ageMin || undefined,
          ageMax: ageMax || undefined,
        });

        if (selectedBreed !== 'All Breeds') {
          queryParams.append('breeds', selectedBreed);
        }

        if (selectedZipCodes.length > 0) {
          queryParams.append('zipCodes', JSON.stringify(selectedZipCodes));
        }

        const searchResponse = await fetch(
          `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`,
          { credentials: 'include' }
        );
        const searchData = await searchResponse.json();

        const ids = searchData.resultIds;
        const dogsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ids),
          credentials: 'include',
        });
        const detailedDogs = await dogsResponse.json();
        setDogs(detailedDogs);
        setTotalPages(Math.ceil(searchData.total / 10));

        const allZipCodes = detailedDogs.map((dog) => dog.zip_code);
        setZipCodes([...new Set(allZipCodes)]);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };
    fetchDogs();
  }, [page, sortCriteria, selectedBreed, ageMin, ageMax, selectedZipCodes]);

  const handleFavoriteToggle = (dog) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === dog.id)
        ? prevFavorites.filter((fav) => fav.id !== dog.id)
        : [...prevFavorites, dog]
    );
  };

  const handleGenerateMatch = () => {
    navigate('/match-result', { state: { favorites, hideFavoriteButton: true } });
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handleZipCodeChange = (event) => {
    setSelectedZipCodes(event.target.value);
  };

  const handleMenuClose = () => {
    setIsZipMenuOpen(false);
    setPage(1); // Reset to first page after zip code change
  };

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortSelect = (field, direction) => {
    setSortCriteria({ field, direction });
    setAnchorEl(null); // Close the menu after selection
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff' }}>
      <Typography variant="h2" gutterBottom style={{ textAlign: 'center', color: '#6c63ff', fontWeight: 'bold' }}>
        Pawfect Match Rescue
      </Typography>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', color: '#ba0001', fontWeight: 'bold' }}>
        Search for your furry friend! 🐶
      </Typography>

      <Grid container justifyContent="center" alignItems="center" direction="column" style={{ marginTop: '20px' }}>
        <img src="/Images/undraw_dog_jfxm.svg" alt="Dog Illustration" style={{ width: '200px', marginBottom: '20px' }} />
        <Typography variant="body1" sx={{ color: '#666', marginTop: '10px' }}>
          Select a breed you're looking for!
        </Typography>
        <br />
      </Grid>

      <Grid container spacing={2} justifyContent="center" style={{ marginBottom: '20px' }}>
        <Grid item>
          <FormControl>
            <Select
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              style={{ minWidth: '200px' }}
            >
              {breeds.map((breed) => (
                <MenuItem key={breed} value={breed}>
                  {breed}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField label="Min Age" type="number" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} inputProps={{ min: 0 }} />
        </Grid>
        <Grid item>
          <TextField label="Max Age" type="number" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} inputProps={{ min: 0 }} />
        </Grid>

        {/* Multi-Select Dropdown for Zip Codes */}
        <Grid item>
          <FormControl style={{ minWidth: '200px' }}>
            <InputLabel>Zip Codes</InputLabel>
            <Select
              multiple
              value={selectedZipCodes}
              onChange={handleZipCodeChange}
              input={<OutlinedInput label="Zip Codes" />}
              renderValue={(selected) => selected.join(', ')}
              open={isZipMenuOpen}
              onOpen={() => setIsZipMenuOpen(true)}
              onClose={handleMenuClose}
            >
              {zipCodes.map((zip) => (
                <MenuItem key={zip} value={zip}>
                  <Checkbox checked={selectedZipCodes.indexOf(zip) > -1} />
                  <ListItemText primary={zip} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Sort by Button with Dropdown */}
        <Grid item>
          <Button
            variant="contained"
            onClick={handleSortClick}
            style={{ backgroundColor: '#6c63ff', color: '#fff' }}
          >
            Sort by: {sortCriteria.field} ({sortCriteria.direction})
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MuiMenuItem onClick={() => handleSortSelect('name', sortCriteria.direction === 'asc' ? 'desc' : 'asc')}>
              Name ({sortCriteria.direction === 'asc' ? 'Descending' : 'Ascending'})
            </MuiMenuItem>
            <MuiMenuItem onClick={() => handleSortSelect('age', sortCriteria.direction === 'asc' ? 'desc' : 'asc')}>
              Age ({sortCriteria.direction === 'asc' ? 'Descending' : 'Ascending'})
            </MuiMenuItem>
            <MuiMenuItem onClick={() => handleSortSelect('breed', sortCriteria.direction === 'asc' ? 'desc' : 'asc')}>
              Breed ({sortCriteria.direction === 'asc' ? 'Descending' : 'Ascending'})
            </MuiMenuItem>
          </Menu>
        </Grid>

        {/* Search Button */}
        <Grid item>
          <Button variant="contained" onClick={handleSearch} style={{ backgroundColor: '#6c63ff', color: '#fff' }}>
            Search
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="center">
        {dogs.map((dog) => (
          <Grid item key={dog.id}>
            <DogCard
              dog={dog}
              isFavorite={favorites.some((fav) => fav.id === dog.id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
        <Button disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))} style={{ marginRight: '10px' }}>
          Previous
        </Button>
        <Typography style={{ alignSelf: 'center' }}>Page {page} of {totalPages}</Typography>
        <Button disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} style={{ marginLeft: '10px' }}>
          Next
        </Button>
      </Grid>

      {favorites.length > 0 && (
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <Button
            variant="contained"
            onClick={handleGenerateMatch}
            style={{ backgroundColor: '#ff4081', color: '#fff' }}
          >
            Generate Match
          </Button>
        </Grid>
      )}
    </div>
  );
};

export default SearchPage;
