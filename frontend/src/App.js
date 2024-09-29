import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Movies from './components/MovieList';
import Login from './components/Login';
import MovieInfo from './components/MovieInfo';
import SeriesDetails from './components/SeriesDetails';
import FetchSeriesFiles from './components/FetchSeriesFiles';
import EditSeries from './components/EditSeries';
import { CssBaseline, Typography } from '@mui/material';
import Navbar from './components/Navbar'; // Import Navbar
import SeriesList from './components/SeriesList'; // Import SeriesList component
import ImportMovies from './components/ImportMovies'; // Import ImportMovies component
import EpisodeDetail from './components/EpisodeDetail'; // Your episode detail component

function App() {
  const [activeComponent, setActiveComponent] = useState('movies');

  const handleShowComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <Router>
      <CssBaseline />

      {/* Navbar with component change function passed as prop */}
      <Navbar onComponentChange={handleShowComponent} />

      <main style={{  }}> {/* Added padding for better layout */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/fetch-series" element={<FetchSeriesFiles />} />
          <Route path="/" element={<Home />} />
          <Route path="/import-movies" element={<ImportMovies />} />
          <Route path="/dashboard" element={<Dashboard activeComponent={activeComponent} />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/edit-series/:id" element={<EditSeries />} />
          <Route path="/movie/:id" element={<MovieInfo />} />
          <Route path="/series" element={<SeriesList />} />
          <Route path="/series/:tmdb_id" element={<SeriesDetails />} />
          <Route path="/episode/:id" element={<EpisodeDetail />} /> {/* Updated to use element prop */}
        </Routes>
      </main>

      <footer style={{ backgroundColor: '#1E1E2F', padding: '16px', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          &copy; 2024 Your Company. All rights reserved.
        </Typography>
      </footer>
      
    </Router>
  );
}

export default App;
