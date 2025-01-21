import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Pagination,
} from '@mui/material';
import DogCard from './DogCard';
import LogoutIcon from '@mui/icons-material/Logout';
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
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [zipCodes, setZipCodes] = useState([]);  // New state for zip codes
  const [selectedZip, setSelectedZip] = useState(''); 
  const [zipList, setZipList] = useState([]);
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
    const fetchZipCodes = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/zipcodes', {
          credentials: 'include',
        });
        const data = await response.json();
        setZipList(data);
      } catch (error) {
        console.error('Error fetching zip codes:', error);
      }
    };
    fetchZipCodes();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const queryParams = new URLSearchParams({
          sort: `${sortField}:${sortDirection}`,
          size: 10,
          from: (page - 1) * 10,
          ageMin: ageMin || undefined,
          ageMax: ageMax || undefined, 
        });

        if (selectedBreed !== 'All Breeds') {
          queryParams.append('breeds', selectedBreed);
        }

        if (selectedZip) {
          queryParams.append('zipCodes', selectedZip);
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
        const dogZipCodes = [...new Set(detailedDogs.map((dog) => dog.zip_code))];
        setDogs(detailedDogs);
        setTotalPages(Math.ceil(searchData.total / 10));
        setZipCodes(dogZipCodes);     
        

        // const location = await fetch(
        //   `https://frontend-take-home-service.fetch.com/locations`,
        //   {
        //     credentials: 'include',
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: "[60616, 60061]",
        //   }
        // );
        // console.log(location.response.json())
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };
    fetchDogs();
  }, [page, sortField, sortDirection, selectedBreed, ageMin, ageMax, selectedZip]);

  const handleLogout = () => {
    navigate('/');
  };

  const handleGenerateMatch = () => {
    navigate('/match-result', { state: { favorites, hideFavoriteButton: true } });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const FavoritesCount = ({ count }) => {
    return (
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <Typography
          variant="h5"
          style={{
            color: '#ff4081',
            fontWeight: 'bold',
          }}
        >
          you currently have {count} favrioute(s)!
        </Typography>
      </div>
    );
  };

  const handleFavoriteToggle = (dog) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === dog.id)
        ? prevFavorites.filter((fav) => fav.id !== dog.id)
        : [...prevFavorites, dog]
    );
  };

  const handleSearch = () => {
    setPage(1);
  }; 

  return (
    <div style={{ padding: '20px', backgroundColor: '#eceaff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <Typography
          variant="h2"
          style={{
            color: '#6c63ff',
            fontWeight: 'bold',
            textAlign: 'center',
            flexGrow: 1,
          }}
        >
          Pawfect Match Rescue
        </Typography>
        <IconButton
          onClick={handleLogout}
          style={{ color: '#ff4081' }}
          aria-label="Logout"
        >
          <LogoutIcon />
        </IconButton>
      </div>


      <Typography variant="h4" style={{ textAlign: 'center', color: '#ba0001', fontWeight: 'bold', marginTop: '20px' }}>
        Search for your furry friend! 🐶
      </Typography>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid item>
          <FormControl variant="filled">
            <InputLabel
              variant="filled"
              sx={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#6c63ff',
                '&.Mui-focused': {
                  color: '#ff4081',
                },
              }}
            >
              Breed
            </InputLabel>
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
          <TextField
            label="Min Age"
            type="number"
            value={ageMin}
            onChange={(e) => setAgeMin(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Max Age"
            type="number"
            value={ageMax}
            onChange={(e) => setAgeMax(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>

      {/* Zip Code Dropdown */}
      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid item>
          <FormControl variant="filled">
            <InputLabel
              variant="filled"
              sx={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#6c63ff',
                '&.Mui-focused': {
                  color: '#ff4081',
                },
              }}
            >
              Zip Code
            </InputLabel>
            <Select
              value={selectedZip}
              onChange={(e) => setSelectedZip(e.target.value)}
              style={{ minWidth: '200px' }}
            >
              <MenuItem value="">
                <em>All Zip Codes</em>
              </MenuItem>
              {zipCodes.map((zip) => (
                <MenuItem key={zip} value={zip}>
                  {zip}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid item>
          <FormControl variant="filled">
            <InputLabel
              variant="filled"
              sx={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#6c63ff',
                '&.Mui-focused': {
                  color: '#ff4081',
                },
              }}
            >
              Sort By
            </InputLabel>
            <Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              style={{ minWidth: '200px' }}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="age">Age</MenuItem>
              <MenuItem value="breed">Breed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            style={{ backgroundColor: '#6c63ff', color: '#fff' }}
          >
            Sort Order: {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </Grid>
        {/* <Grid item>
          <Button variant="contained" onClick={handleSearch} style={{ backgroundColor: '#6c63ff', color: '#fff' }}>
            Search
          </Button>
        </Grid> */}
        {favorites.length > 0 && <Grid item>
          <Button
            variant="contained"
            onClick={handleGenerateMatch}
            style={{ backgroundColor: '#ff4081', color: '#fff' }}
          >
            Generate Match
          </Button>
        </Grid>}
      </Grid>

      <FavoritesCount count={favorites.length} />

      <Grid container spacing={4} justifyContent="center" style={{ marginTop: '20px' }}>
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

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>

    
  );
};

export default SearchPage;
