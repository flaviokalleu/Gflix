import React, { useState, useEffect, useRef } from 'react';
import { FaPlay } from 'react-icons/fa';
import { MdSubtitles, MdStar } from 'react-icons/md';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SeriesDetail = () => {
  const { tmdb_id } = useParams();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const modalRef = useRef(null); // Adicionando a referência para o modal

  useEffect(() => {
    const fetchSeriesDetails = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/tmdb/${tmdb_id}`);
    setSeries(response.data);
    fetchRecommendations(tmdb_id); // Passa o tmdb_id da série atual
  } catch (err) {
    console.error('Error fetching series details:', err);
    setError('Failed to load series details. Please try again later.');
  } finally {
    setLoading(false);
  }
};

  const fetchRecommendations = async (currentSeriesId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/recommendations/random`, {
        params: { excludeId: currentSeriesId } // Adiciona o ID da série atual como parâmetro
      });
      setRecommendations(response.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      // Aqui você pode adicionar um tratamento de erro, como exibir uma mensagem para o usuário
    }
  };
  
    

    fetchSeriesDetails();
  }, [tmdb_id]);

  const handleToggleEpisodes = async () => {
    setShowEpisodes(!showEpisodes);
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

  // Efeito para rolar até o modal quando ele é aberto
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

  if (!series) {
    return <NotFoundIndicator />;
  }

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
                <span>Assistir os episodios</span>
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
              placeholder="Filter episodes..."
              value={filter}
              onChange={e => setFilter(e.target.value)} 
              className="mb-4 p-2 rounded bg-gray-800 text-white"
            />
            <div className="overflow-y-auto max-h-96">
              <EpisodesList episodes={filteredEpisodes} loading={episodesLoading} onEpisodeClick={handleEpisodeClick} />
            </div>
          </div>
        )}

        {/* Seção de Recomendações */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold">Você também pode Gostar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {recommendations.map(recommendation => (
              <RecommendationCard key={recommendation.id} series={recommendation} />
            ))}
          </div>
        </div>

        {isModalOpen && ( 
          <Modal episode={selectedEpisode} onClose={closeModal} ref={modalRef} /> // Passando a ref para o modal
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
    <div className="text-white">Series not found.</div>
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

const SeriesPoster = ({ posterPath, seriesName }) => (
  <div className="flex-shrink-0 w-full max-w-[400px] h-[500px]">
    <img
      src={`https://image.tmdb.org/t/p/original${posterPath}`}
      alt={seriesName}
      className="rounded-lg shadow-lg h-full w-full object-cover"
    />
  </div>
);

const Genres = ({ genres }) => (
  <div className="mt-4 flex space-x-2">
    {genres?.map((genre) => (
      <span key={genre.id} className="bg-gray-800 text-gray-300 text-sm px-2 py-1 rounded-full">
        {genre.name}
      </span>
    ))}
  </div>
);

const EpisodesList = ({ episodes, loading, onEpisodeClick }) => (
  <div>
    {loading ? (
      <LoadingIndicator />
    ) : (
      episodes.map((episode) => (
        <div
          key={episode.id}
          className="flex items-center justify-between bg-gray-800 p-4 mb-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
          onClick={() => onEpisodeClick(episode)}
        >
          <span>{episode.name}</span>
          <span>{episode.episode_number}</span>
        </div>
      ))
    )}
  </div>
);

const RecommendationCard = ({ series }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
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
  </div>
);


const Modal = React.forwardRef(({ episode, onClose }, ref) => {
  return (
    <div ref={ref} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-900 p-8 rounded-lg max-w-lg w-full">
        <button onClick={onClose} className="text-white mb-4">
          Close
        </button>
        <h2 className="text-xl font-bold mb-2">{episode.name}</h2>
        <iframe
          src={episode.link} // Assume video_url is part of the episode data
          title={episode.name}
          className="w-full h-64 rounded-lg"
          allowFullScreen
        />
      </div>
    </div>
  );
});

export default SeriesDetail;
