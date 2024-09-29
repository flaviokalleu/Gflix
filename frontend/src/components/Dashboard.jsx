import React from 'react';
import {
  Typography,
  Box,
} from '@mui/material';

import MovieList from './MovieList';
import SeriesList from './SeriesList';
import SeasonList from './SeasonList';
import EpisodeList from './EpisodeList';

const Dashboard = ({ activeComponent }) => {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#121212', pt: 8 }}>
      

      {/* Render the active component */}
      {activeComponent === 'movies' && <MovieList />}
      {activeComponent === 'series' && <SeriesList />}
      {activeComponent === 'seasons' && <SeasonList />}
      {activeComponent === 'episodes' && <EpisodeList />}
    </Box>
  );
};

export default Dashboard;
