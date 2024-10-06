import React, { useState, useEffect, useRef } from 'react';
import { FaPlay } from 'react-icons/fa';
import { MdSubtitles, MdStar } from 'react-icons/md';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SeriesDetail = () => {
  const { tmdb_id } = useParams();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [seasons, setSeasons] = useState([]); // Novo estado para armazenar as temporadas
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const modalRef = useRef(null);

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/tmdb/${tmdb_id}`);
        setSeries(response.data);
        fetchSeasons(tmdb_id); // Chama a função para buscar as temporadas
        fetchRecommendations(tmdb_id);
      } catch (err) {
        console.error('Error fetching series details:', err);
        setError('Failed to load series details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSeasons = async (seriesId) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/seasons/${seriesId}`);
        if (response.data && Array.isArray(response.data)) {
          setSeasons(response.data); // Armazena as temporadas
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching seasons:', err);
        setError('Failed to load seasons. Please try again later.');
      }
    };

    const fetchRecommendations = async (currentSeriesId) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/recommendations/random`, {
          params: { excludeId: currentSeriesId }
        });
        setRecommendations(response.data);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }
    };

    fetchSeriesDetails();
  }, [tmdb_id]);

  const handleToggleEpisodes = async () => {
    setShowEpisodes((prev) => !prev);
    if (!showEpisodes && episodes.length === 0) {
      setEpisodesLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/tmdb/${tmdb_id}/episodes`);
        setEpisodes(response.data);
      } catch (err) {
        console.error('Error fetching episodes:', err);
        setError('Failed to load episodes. Please try again later.');
      } finally {
        setEpisodesLoading(false);
      }
    }
  };

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
    setIsModalOpen(true);
  };

  const filteredEpisodes = episodes
    .filter(episode => episode.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a.episode_number - b.episode_number);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEpisode(null);
  };

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isModalOpen]);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorIndicator message={error} />;
  if (!series) return <NotFoundIndicator />;

  // Agrupando episódios por temporada
  const episodesBySeason = {};
  episodes.forEach(episode => {
    if (!episodesBySeason[episode.season_id]) {
      episodesBySeason[episode.season_id] = [];
    }
    episodesBySeason[episode.season_id].push(episode);
  });

  return (
    <div className="bg-gray-900 text-white relative min-h-screen">
      <BackgroundImage backdropPath={series.backdrop_path} />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 p-8 md:p-12 lg:p-16 backdrop-filter backdrop-blur-sm min-h-screen bg-gray-900 bg-opacity-50">
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8">
          <SeriesPoster posterPath={series.poster_path} seriesName={series.name} />
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-2">{series.name}</h2>
            <p className="text-lg mb-4">{series.overview || 'No overview available.'}</p>
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center">
                <MdStar className="text-yellow-400" />
                <span className="ml-2">{series.vote_average}/10</span>
              </div>
              <div className="flex items-center">
                <MdSubtitles className="text-white" />
                <span className="ml-2">{series.original_language.toUpperCase()}</span>
              </div>
              <span>{series.number_of_seasons} Seasons</span>
              <span>{series.number_of_episodes} Episodes</span>
            </div>
            <Genres genres={series.genres} />
            <div className="mt-6">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
                onClick={handleToggleEpisodes}
              >
                <FaPlay />
                <span>Assistir os episódios</span>
              </button>
            </div>
            <div className="flex space-x-4 mt-6">
              {series.casts && series.casts.slice(0, 5).map((cast) => (
                <div key={cast.id} className="flex flex-col items-center">
                  <img
                    src={`https://image.tmdb.org/t/p/original${cast.profile_path}`}
                    alt={cast.name}
                    className="w-24 h-36 rounded-lg mb-2 object-cover"
                  />
                  <span className="text-gray-400">{cast.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showEpisodes && (
  <div className="mt-8">
    <input
      type="text"
      placeholder="Filtrar episódios..."
      value={filter}
      onChange={e => setFilter(e.target.value)} 
      className="mb-4 p-2 rounded bg-gray-800 text-white"
    />
    <div className="overflow-y-auto max-h-96">
      {/* Ordenando as temporadas por season_number */}
      {seasons.sort((a, b) => a.season_number - b.season_number).map(season => {
        const seasonId = season.id; // Obtenha o ID da temporada
        const seasonTitle = `Temporada ${season.season_number}`; // Construindo o título da temporada

        return (
          <div key={seasonId} className="mb-4">
            <h3 className="text-xl font-bold mb-2">{seasonTitle}</h3>
            {episodesBySeason[seasonId]
              ? episodesBySeason[seasonId]
                  .filter(episode => episode.name.toLowerCase().includes(filter.toLowerCase()))
                  .sort((a, b) => a.episode_number - b.episode_number) // Ordenando os episódios por episode_number
                  .map((episode) => (
                    <div
                      key={episode.id}
                      className="flex items-center justify-between bg-gray-800 p-4 mb-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
                      onClick={() => handleEpisodeClick(episode)}
                    >
                      <span>{episode.name}</span>
                      <span>{episode.episode_number}</span>
                    </div>
                  ))
              : <p className="text-gray-400">Nenhum episódio disponível.</p> // Mensagem caso não haja episódios
            }
          </div>
        );
      })}
    </div>
  </div>
)}


        {/* Seção de Recomendações */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold">Você também pode Gostar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {recommendations.map((series) => (
              <RecommendationCard key={series.id} series={series} />
            ))}
          </div>
        </div>

        {/* Modal para Episódio */}
        <Modal episode={selectedEpisode} onClose={closeModal} ref={modalRef} />
      </div>
    </div>
  );
};

// Componente para Carregamento
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-white">Carregando...</p>
  </div>
);
const BackgroundImage = ({ backdropPath }) => {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${backdropPath})` }}
    />
  );
};
// Componente para Erros
const ErrorIndicator = ({ message }) => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-red-500">{message}</p>
  </div>
);

// Componente para Não Encontrado
const NotFoundIndicator = () => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-white">Série não encontrada.</p>
  </div>
);

// Componente para o Poster da Série
const SeriesPoster = ({ posterPath, seriesName }) => (
  <img
    src={`https://image.tmdb.org/t/p/w500${posterPath}`}
    alt={seriesName}
    className="w-48 h-72 rounded-lg shadow-lg"
  />
);

// Componente para os Gêneros
const Genres = ({ genres }) => (
  <div className="mt-4">
    {genres.map((genre) => (
      <span key={genre.id} className="bg-gray-700 rounded-full px-3 py-1 text-sm mr-2">
        {genre.name}
      </span>
    ))}
  </div>
);

// Componente para as Recomendações
const RecommendationCard = ({ series }) => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <img
      src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
      alt={series.name}
      className="w-full h-40 rounded-lg mb-2 object-cover"
    />
    <h4 className="text-lg font-bold">{series.name}</h4>
    <p className="text-gray-400">{series.overview.slice(0, 100)}...</p>
  </div>
);

// Componente Modal
const Modal = React.forwardRef(({ episode, onClose }, ref) => {
  if (!episode) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-80 w-full h-full" onClick={onClose}></div>
      <div
        ref={ref}
        className="bg-gray-900 rounded-lg p-6 z-50 w-11/12 max-w-lg"
      >
        <h2 className="text-2xl font-bold">{episode.name}</h2>
        <p className="text-gray-400">{episode.overview || 'No overview available.'}</p>
        <video
          controls
          className="mt-4 w-full"
        >
          <source src={episode.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button className="mt-4 text-white" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
});

export default SeriesDetail;
