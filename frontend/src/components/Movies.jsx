import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, TextField, Typography, Card, CardContent, CardMedia, Button, Snackbar, Alert, Collapse } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

// Tema escuro
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    primary: {
      main: '#e50914', // Cor vermelha da Netflix para o tema
    },
  },
});

// Card personalizado com bordas arredondadas e efeito de sombra
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: `0 4px 8px rgba(0, 0, 0, 0.5)`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 8px 16px rgba(0, 0, 0, 0.7)`,
  },
  backgroundColor: theme.palette.background.paper,
}));

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=f5c93b1d4a4264da14a544c326c3e6c6');
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to fetch movies.');
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  const importMovie = async (movieId) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/import/movie`, { movieId });
      setSnackbarMessage('Movie imported successfully!');
    } catch (error) {
      console.error('Error importing movie:', error);
      setSnackbarMessage('Failed to import movie.');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleExpandClick = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom color="textPrimary" sx={{ my: 4 }}>
          Buscar Filmes
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Movies"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4 }}
        />
        <Grid container spacing={4}>
          {filteredMovies.length > 0 ? (
            filteredMovies.map(movie => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <StyledCard>
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    sx={{ height: 300, borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="textPrimary">
                      {movie.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {movie.release_date}
                    </Typography>
                    <Collapse in={expandedMovieId === movie.id}>
                      <Typography variant="body2" color="textPrimary" paragraph>
                        {movie.overview}
                      </Typography>
                    </Collapse>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleExpandClick(movie.id)}
                      sx={{ mt: 1 }}
                    >
                      {expandedMovieId === movie.id ? 'Read Less' : 'Read More'}
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => importMovie(movie.id)}
                      sx={{ mt: 2 }}
                    >
                      Import
                    </Button>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center" color="textPrimary">
                No movies found.
              </Typography>
            </Grid>
          )}
        </Grid>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarMessage.includes('successfully') ? 'success' : 'error'}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default Movies;
