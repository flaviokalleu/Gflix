import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material';

const EpisodeModal = ({ open, onClose, episodes, isLoading }) => {
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
  };

  const handleCloseVideo = () => {
    setSelectedEpisode(null);
  };

  // Agrupar episódios por temporada
  const groupedEpisodes = episodes.reduce((acc, episode) => {
    const seasonNumber = episode.Season ? episode.Season.season_number : 'Desconhecida';
    if (!acc[seasonNumber]) {
      acc[seasonNumber] = [];
    }
    acc[seasonNumber].push(episode);
    return acc;
  }, {});

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: '#1f1f1f',
            color: '#fff',
            borderBottom: '1px solid #444',
            padding: { xs: '1rem', sm: '1rem 2rem' },
          }}
        >
          Episódios
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: '#121212',
            color: '#fff',
            padding: { xs: '1rem', sm: '2rem' },
          }}
        >
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress color="secondary" />
            </Box>
          ) : Object.keys(groupedEpisodes).length > 0 ? (
            <Stack spacing={2}>
              {Object.keys(groupedEpisodes).sort((a, b) => a - b).map((seasonNumber) => (
                <Box key={seasonNumber}>
                  <Typography variant="h6" sx={{ color: '#fff', marginTop: '1rem' }}>
                    Temporada {seasonNumber}
                  </Typography>
                  {groupedEpisodes[seasonNumber].sort((a, b) => a.episode_number - b.episode_number).map((episode) => (
                    <Box
                      key={episode.id}
                      onClick={() => handleEpisodeClick(episode)}
                      sx={{
                        borderBottom: '1px solid #444',
                        padding: { xs: '1rem', sm: '1.5rem' },
                        display: 'flex',
                        alignItems: 'flex-start',
                        backgroundColor: '#1f1f1f',
                        borderRadius: '8px',
                        transition: 'background-color 0.3s',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#1a1a1a',
                        },
                      }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${episode.still_path}`}
                        alt={episode.name}
                        style={{
                          width: '80px',
                          height: 'auto',
                          marginRight: '1rem',
                          borderRadius: '8px',
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" color="#fff">
                          Episódio {episode.episode_number}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '0.5rem', color: '#fff' }}>
                          {episode.name}
                        </Typography>
                        <Typography variant="body2" sx={{ marginTop: '0.5rem', color: '#fff' }}>
                          {episode.overview}
                        </Typography>
                        <Typography variant="body2" color="#fff" sx={{ marginTop: '0.5rem' }}>
                          Data de Exibição: {new Date(episode.air_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="#fff" sx={{ marginTop: '0.5rem' }}>
                          Duração: {episode.runtime} min • Avaliação: {episode.vote_average} ({episode.vote_count} votos)
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="body1" color="#fff" align="center">
              Nenhum episódio encontrado.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1f1f1f', padding: { xs: '1rem', sm: '1rem' } }}>
          <Button onClick={onClose} color="primary" variant="contained" sx={{ borderRadius: '20px' }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Dialog */}
      {selectedEpisode && (
        <Dialog
          open={Boolean(selectedEpisode)}
          onClose={handleCloseVideo}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor: '#1f1f1f',
              color: '#fff',
              borderBottom: '1px solid #444',
              padding: { xs: '1rem', sm: '1rem 2rem' },
            }}
          >
            {selectedEpisode.name}
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: '#121212',
              color: '#fff',
              padding: { xs: '1rem', sm: '2rem' },
            }}
          >
            {/* Video player */}
            <Box display="flex" justifyContent="center" alignItems="center">
              <iframe
                width="100%"
                height="400"
                src={selectedEpisode.link} // Ensure this is the correct video link
                title={selectedEpisode.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#1f1f1f', padding: { xs: '1rem', sm: '1rem' } }}>
            <Button onClick={handleCloseVideo} color="primary" variant="contained" sx={{ borderRadius: '20px' }}>
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default EpisodeModal;
