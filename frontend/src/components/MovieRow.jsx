// src/components/MovieRow.js
import React from 'react';
import { Link } from 'react-router-dom';

const MovieRow = ({ title, movies }) => {
  // Limita a exibição de filmes a no máximo 12
  const limitedMovies = movies.slice(0, 6);

  return (
    <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className="flex overflow-x-auto space-x-6 pb-4">
        {limitedMovies.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`} className="flex-shrink-0">
            <div className="bg-gray-700 rounded-lg overflow-hidden transition-transform transform hover:scale-105 shadow-lg hover:shadow-xl">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450'}
                alt={movie.title}
                className="rounded-lg h-72 w-48 object-cover transition-opacity duration-300 hover:opacity-90"
              />
              
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
