import { Card, CardMedia } from '@mui/material';

const SeriesPoster = ({ posterPath, seriesName }) => (
  <Card sx={{ position: 'relative', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, backgroundColor: 'transparent', boxShadow: 'none' }}>
    <CardMedia
      component="img"
      height="auto"
      image={`https://image.tmdb.org/t/p/original${posterPath}`}
      alt={seriesName}
    />
  </Card>
);

export default SeriesPoster;
