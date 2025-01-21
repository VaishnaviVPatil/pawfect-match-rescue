import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; 

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  backgroundColor: 'whitesmoke',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '8px',
  textAlign: 'center',
}));

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async () => {
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
        credentials: 'include', // Ensures cookies are sent
      });

      if (response.ok) {
        // onLogin();
        navigate('/search');
      } else {
        alert('Login failed. Please check your details.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eceaff',
      }}
    >
      <Grid container spacing={2}>
        {/* Left side: SVG Image */}
        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src="/Images/undraw_good-doggy_4ast.svg"
            alt="Good Doggy"
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '450px' }}
          />
        </Grid>

        {/* Right side: Login Form */}
        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center' }}>
          <PaperStyled>
            <Typography
              variant="h4"
              style={{
                color: 'black',
                marginBottom: '24px',
                fontWeight: 'bold',
              }}
            >
              Welcome to Pawfect Match Rescue
            </Typography>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  label="Name"
                  variant="outlined"
                  style={{
                    marginBottom: '16px',
                    width: '100%',
                  }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: { color: '#6c63ff' },
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Email"
                  variant="outlined"
                  style={{
                    marginBottom: '16px',
                    width: '100%',
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: { color: '#6c63ff' },
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  onClick={handleLogin}
                  style={{
                    backgroundColor: '#6c63ff',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#5a54e0',
                    },
                    width: '100%',
                  }}
                  variant="contained"
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </PaperStyled>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
