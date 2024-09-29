import { Box, Typography, Button } from '@mui/material';
import { FaPlay } from 'react-icons/fa';
import { MdSubtitles, MdStar } from 'react-icons/md';
import Genres from './Genres';
import ProductionCompanies from './ProductionCompanies';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', options);
};

const SeriesInfo = ({ series, onToggleEpisodes }) => (
  <Box sx={{ padding: 2, backgroundColor: 'transparent', boxShadow: 'none' }}>
    <Typography variant="h4" gutterBottom color="#fff" sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
      {series.name}
    </Typography>
    <ProductionCompanies companies={series.production_companies} />
    <Typography variant="body2" color="#fff">
      {formatDate(series.first_air_date)} | {series.original_language.toUpperCase()}
    </Typography>
    <Typography variant="body1" sx={{ marginTop: 2 }} color="#fff">
      {series.overview || "No overview available."}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginRight: 2, color: '#fff' }}>
        <MdSubtitles style={{ marginRight: 4 }} /> Subtitles
      </Typography>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginRight: 2, color: '#fff' }}>
        <MdStar style={{ marginRight: 4 }} /> {series.vote_average}/10
      </Typography>
      <Typography variant="body2" color="#fff">{series.number_of_seasons} Seasons</Typography>
      <Typography variant="body2" color="#fff">{series.number_of_episodes} Episodes</Typography>
    </Box>
    <Genres genres={series.genres} />
    <Box sx={{ marginTop: 2 }}>
      <Button
        variant="contained"
        color="error"
        startIcon={<FaPlay />}
        onClick={onToggleEpisodes}
        sx={{ '&:hover': { backgroundColor: '#d32f2f' } }}
      >
        Watch Episodes
      </Button>
    </Box>
  </Box>
);

export default SeriesInfo;
