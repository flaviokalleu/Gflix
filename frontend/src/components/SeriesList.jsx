import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SeriesList = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ genre: '', year: '', platform: '', rating: '' });

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series`);
        setSeriesList(response.data);
      } catch (error) {
        console.error('Erro ao buscar séries:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/api/genres`); // Ensure correct endpoint
        setGenres(response.data);
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      }
    };

    fetchSeries();
    fetchGenres();
  }, []);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredSeries = seriesList.filter((series) => {
    return (
      (filter.genre ? series.genres && series.genres.some(g => g.name === filter.genre) : true) &&
      (filter.year ? series.first_air_date.includes(filter.year) : true) &&
      (filter.platform ? series.platform && series.platform.includes(filter.platform) : true) &&
      (filter.rating ? series.vote_average >= parseFloat(filter.rating) : true) // Changed for range
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <span className="ml-4 text-lg">Carregando séries...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-900 text-white min-h-screen">
      <h3 className="text-3xl font-bold mb-4 text-center">Séries</h3> {/* Centered Title */}
  
      {/* Filtros */}
      <div className="mb-4 flex flex-col items-center gap-4"> {/* Centering filters */}
        <div className="flex flex-wrap justify-center gap-4"> {/* Center the filter items */}
          <select
            name="genre"
            value={filter.genre}
            onChange={handleFilterChange}
            className="bg-gray-800 text-white p-2 rounded shadow"
          >
            <option value="">Todos os Gêneros</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.name}>{genre.name}</option>
            ))}
          </select>
  
          <input
            type="text"
            name="year"
            value={filter.year}
            onChange={handleFilterChange}
            placeholder="Ano (ex: 2020)"
            className="bg-gray-800 text-white p-2 rounded shadow"
          />
  
          <input
            type="text"
            name="platform"
            value={filter.platform}
            onChange={handleFilterChange}
            placeholder="Plataforma"
            className="bg-gray-800 text-white p-2 rounded shadow"
          />
  
          <input
            type="text"
            name="rating"
            value={filter.rating}
            onChange={handleFilterChange}
            placeholder="Nota (ex: 8.5)"
            className="bg-gray-800 text-white p-2 rounded shadow"
          />
        </div>
      </div>
  
      {/* Lista de séries */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredSeries.map((series) => (
          <motion.div
            key={series.tmdb_id}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            <Link to={`/series/${series.tmdb_id}`}>
              <img
                src={series.poster_path ? `https://image.tmdb.org/t/p/original${series.poster_path}` : 'https://via.placeholder.com/200x300'}
                alt={series.name}
                className="rounded-lg shadow-lg h-full w-full object-cover transition-opacity duration-300 hover:opacity-90"
              />
              <div className="p-2">
                <h4 className="text-lg font-bold text-center">{series.name}</h4> {/* Centered Series Name */}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
  
};

export default SeriesList;
