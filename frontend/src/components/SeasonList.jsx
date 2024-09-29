import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

const SeasonList = () => {
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    const fetchSeasons = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/seasons`);
      setSeasons(response.data);
    };

    fetchSeasons();
  }, []);

  return (
    <Grid container spacing={2}>
      {seasons.map(season => (
        <Grid item xs={3} key={season.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">Temporada {season.season_number}</Typography>
              <Typography variant="body2">{season.overview}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SeasonList;
