// src/components/SeriesList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SeriesList = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);

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

    fetchSeries();
  }, []);

  const getRandomSeries = (series, count) => {
    const shuffled = series.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p>Carregando séries...</p>
      </div>
    );
  }

  const randomSeries = getRandomSeries(seriesList, 6);

  return (
    <div className="p-4 md:p-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white ">
      <h1 className="text-4xl font-bold mb-8 text-center">Séries</h1>
      <div className="flex overflow-x-auto space-x-6 pb-4">
        {randomSeries.map((series) => (
          <Link 
            key={series.tmdb_id} 
            to={`/series/${series.tmdb_id}`} 
            className="flex-shrink-0"
          >
            <div className="bg-gray-700 rounded-lg overflow-hidden transition-transform transform hover:scale-105 shadow-lg hover:shadow-xl">
              <img
                src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://via.placeholder.com/300x450'}
                alt={series.name}
                className="rounded-lg h-72 w-48 object-cover transition-opacity duration-300 hover:opacity-90"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SeriesList;
