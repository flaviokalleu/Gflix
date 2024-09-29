import React, { useState, useEffect, useRef } from 'react';
import { FaPlay } from 'react-icons/fa';
import { MdStar } from 'react-icons/md';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]); // Novo estado para filmes recomendados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieLink, setSelectedMovieLink] = useState(null);
  
  const modalRef = useRef(null); // Reference for the modal

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/movies/${id}`);
        setMovie(response.data);
        // Chama a função para buscar filmes recomendados
        fetchRecommendedMovies(response.data.genres.map(genre => genre.id));
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const fetchRecommendedMovies = async (genreIds) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/movies/recommendations`, {
        params: { genres: genreIds.join(',') } // Passa os IDs dos gêneros
      });
      setRecommendedMovies(response.data.results); // Ajuste com base na estrutura da resposta da sua API
    } catch (err) {
      console.error('Error fetching recommended movies:', err);
    }
  };

  const openMovieModal = () => {
    if (movie.player_links) {
      setSelectedMovieLink(movie.player_links);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovieLink(null);
  };

  // Effect to scroll to the modal when it opens
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isModalOpen]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorIndicator message={error} />;
  }

  if (!movie) {
    return <NotFoundIndicator />;
  }

  return (
    <div className="bg-gray-900 text-white relative min-h-screen">
      <BackgroundImage backdropPath={movie.backdrop_path} />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 p-8 md:p-12 lg:p-16 backdrop-filter backdrop-blur-sm min-h-screen bg-gray-900 bg-opacity-50">
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8">
          <MoviePoster posterPath={movie.poster_path} movieTitle={movie.title} />
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-2">{movie.title}</h2>
            <p className="text-lg mb-4">{movie.overview || 'No overview available.'}</p>
            
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center">
                <MdStar className="text-yellow-400" />
                <span className="ml-2">{movie.vote_average}/10</span>
              </div>
              <span>{new Date(movie.release_date).toLocaleDateString()}</span>
            </div>

            <div className="mt-6">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
                onClick={openMovieModal} // Open modal with the movie link
              >
                <FaPlay />
                <span>Assistir Filme {movie.title}</span>
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">Genero:</h3>
              <div className="flex space-x-2">
                {movie.genres && movie.genres.map((genre) => (
                  <span key={genre.id} className="bg-gray-800 text-gray-400 px-2 py-1 rounded">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Elenco:</h3>
              <div className="flex space-x-4">
                {movie.casts && movie.casts.slice(0, 5).map((cast) => ( // Limita a 5 atores
                  <div key={cast.id} className="flex flex-col items-center">
                    <img
                      src={`https://image.tmdb.org/t/p/original${cast.profile_path}`} // Exibe a imagem do ator
                      alt={cast.name}
                      className="w-24 h-36 rounded-lg mb-2 object-cover" // Define o tamanho da imagem
                    />
                    <span className="text-gray-400">{cast.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Seção de recomendações */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Filmes Recomendados:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendedMovies.map((recommended) => (
                  <div key={recommended.id} className="flex flex-col items-center">
                    <img
                      src={`https://image.tmdb.org/t/p/original${recommended.poster_path}`} // Exibe o pôster do filme recomendado
                      alt={recommended.title}
                      className="w-24 h-36 rounded-lg mb-2 object-cover" // Define o tamanho da imagem
                    />
                    <span className="text-gray-400 text-center">{recommended.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && ( 
          <Modal movieUrl={selectedMovieLink} onClose={closeModal} ref={modalRef} /> // Pass the ref to the modal
        )}
      </div>
    </div>
  );
};

const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-white">Loading...</div>
  </div>
);

const ErrorIndicator = ({ message }) => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-white">{message}</div>
  </div>
);

const NotFoundIndicator = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-white">Movie not found.</div>
  </div>
);

const BackgroundImage = ({ backdropPath }) => (
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `url(https://image.tmdb.org/t/p/original${backdropPath})`,
      opacity: 0.5,
    }}
  />
);

const MoviePoster = ({ posterPath, movieTitle }) => (
  <div className="flex-shrink-0 w-full max-w-[400px] h-[500px]">
    <img
      src={`https://image.tmdb.org/t/p/original${posterPath}`}
      alt={movieTitle}
      className="rounded-lg shadow-lg h-full w-full object-cover"
    />
  </div>
);

const Modal = React.forwardRef(({ movieUrl, onClose }, ref) => (
  <div ref={ref} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
    <div className="bg-gray-900 p-4 rounded-lg max-w-4xl w-full">
      <iframe
        src={movieUrl} // Use the movie link directly
        title="Movie"
        className="w-full h-[600px] rounded-lg" // Increased height
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
      <button onClick={onClose} className="mt-4 text-white">Fechar</button>
    </div>
  </div>
));

export default MovieDetail;
