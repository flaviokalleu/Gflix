import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

const EpisodeList = () => {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/episodes`);
      setEpisodes(response.data);
    };

    fetchEpisodes();
  }, []);

  return (
    <Grid container spacing={2}>
      {episodes.map(episode => (
        <Grid item xs={3} key={episode.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{episode.name}</Typography>
              <Typography variant="body2">{episode.overview}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EpisodeList;
