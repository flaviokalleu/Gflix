import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSection from './HeroSection';
import MovieRow from './MovieRow';
import SeriesRow from './SeriesRow';
import EpisodeGrid from './EpisodeGrid'; // Importe o novo componente
import '../styles/Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [episodes, setEpisodes] = useState([]); // Novo estado para os episódios
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [recentEpisodes, setRecentEpisodes] = useState([]); // Novo estado para os episódios recentes

  useEffect(() => {
    // Função para buscar filmes
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/movies`);
        setMovies(response.data);

        if (response.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.data.length);
          setFeaturedMovie(response.data[randomIndex]);
        }
      } catch (error) {
        console.error('Erro ao buscar os filmes:', error);
      }
    };

    // Função para buscar séries
    const fetchSeries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series`);
        const allSeries = response.data;
        const randomSeries = [];

        const seriesCount = Math.min(10, allSeries.length);
        while (randomSeries.length < seriesCount) {
          const randomIndex = Math.floor(Math.random() * allSeries.length);
          if (!randomSeries.includes(allSeries[randomIndex])) {
            randomSeries.push(allSeries[randomIndex]);
          }
        }

        setSeries(randomSeries);
      } catch (error) {
        console.error('Erro ao buscar as séries:', error);
      }
    };

    // Função para buscar episódios recentes
    const fetchRecentEpisodes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/recent-episodes`);
        setRecentEpisodes(response.data);
      } catch (error) {
        console.error('Erro ao buscar episódios recentes:', error);
      }
    };

    fetchMovies();
    fetchSeries();
    fetchRecentEpisodes(); // Chama a função para buscar episódios

  }, []); // Executa apenas uma vez ao montar o componente

  return (
    <div className="home">
      <HeroSection movie={featuredMovie} />
      <div className="movie-rows">
        <MovieRow title="Filmes" movies={movies} />
      </div>
      <div className="series-rows">
        <SeriesRow title="Series" series={series} />
      </div>
      <div className="episode-section">
        <h2 className="text-2xl font-bold text-white p-4">Episódios Recentes</h2>
        <EpisodeGrid episodes={recentEpisodes} /> {/* Altere para usar o estado correto */}
      </div>
    </div>
  );
};

export default Home;
