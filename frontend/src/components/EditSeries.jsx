import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';

const EditSeries = () => {
  const { id } = useParams(); // Pega o tmdb_id da URL
  const navigate = useNavigate();
  const [seriesData, setSeriesData] = useState({
    tmdb_id: '', // Adicionado campo para tmdb_id
    name: '',
    overview: '',
    backdrop_path: '',
    first_air_date: '',
    last_air_date: '',
    number_of_episodes: '',
    number_of_seasons: '',
    original_language: '',
    status: '',
    popularity: '',
    vote_average: '',
    vote_count: '',
    homepage: '',
    poster_path: '',
  });

  // Buscar dados da série ao carregar o componente
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/${id}`);
        setSeriesData(response.data);
      } catch (error) {
        console.error('Erro ao buscar série:', error);
      }
    };

    fetchSeries();
  }, [id]);

  // Função para lidar com alterações nos inputs
  const handleInputChange = (e) => {
    setSeriesData({ ...seriesData, [e.target.name]: e.target.value });
  };

  // Função para enviar o formulário
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/series/${id}`, seriesData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao atualizar série:', error);
    }
  };

  // Função para buscar informações do TMDB e atualizar a série
  const handleFetchFromTMDB = async () => {
    const { tmdb_id } = seriesData; // Obtém o tmdb_id do estado
    if (!tmdb_id) {
      console.error('Por favor, insira um tmdb_id válido.');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/tmdb/${tmdb_id}`); // Usa o tmdb_id inserido
      const tmdbData = response.data;

      // Atualiza o estado com os dados recebidos do TMDB
      setSeriesData({
        ...seriesData, // Manter dados existentes
        name: tmdbData.name,
        overview: tmdbData.overview,
        backdrop_path: tmdbData.backdrop_path,
        first_air_date: tmdbData.first_air_date,
        last_air_date: tmdbData.last_air_date,
        number_of_episodes: tmdbData.number_of_episodes,
        number_of_seasons: tmdbData.number_of_seasons,
        original_language: tmdbData.original_language,
        status: tmdbData.status,
        popularity: tmdbData.popularity,
        vote_average: tmdbData.vote_average,
        vote_count: tmdbData.vote_count,
        homepage: tmdbData.homepage,
        poster_path: tmdbData.poster_path,
      });
    } catch (error) {
      console.error('Erro ao buscar dados do TMDB:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit}>
      <TextField
        name="tmdb_id"
        label="TMDB ID"
        value={seriesData.tmdb_id}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="name"
        label="Nome da Série"
        value={seriesData.name}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="overview"
        label="Descrição"
        value={seriesData.overview}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="backdrop_path"
        label="Caminho do Backdrop"
        value={seriesData.backdrop_path}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="first_air_date"
        label="Data da Primeira Exibição"
        value={seriesData.first_air_date}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="last_air_date"
        label="Data da Última Exibição"
        value={seriesData.last_air_date}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="number_of_episodes"
        label="Número de Episódios"
        value={seriesData.number_of_episodes}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        name="number_of_seasons"
        label="Número de Temporadas"
        value={seriesData.number_of_seasons}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        name="original_language"
        label="Idioma Original"
        value={seriesData.original_language}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="status"
        label="Status"
        value={seriesData.status}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="popularity"
        label="Popularidade"
        value={seriesData.popularity}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        name="vote_average"
        label="Avaliação Média"
        value={seriesData.vote_average}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        name="vote_count"
        label="Contagem de Votos"
        value={seriesData.vote_count}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        name="homepage"
        label="Página Inicial"
        value={seriesData.homepage}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="poster_path"
        label="Caminho do Poster"
        value={seriesData.poster_path}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <Button 
        type="button" 
        variant="contained" 
        color="secondary" 
        onClick={handleFetchFromTMDB} // Chama a função para buscar dados do TMDB
      >
        Atualizar do TMDB
      </Button>
      <Button type="submit" variant="contained" color="primary">
        Salvar Alterações
      </Button>
    </Box>
  );
};

export default EditSeries;
