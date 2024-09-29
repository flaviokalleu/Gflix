import React from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate para navegação
import '../styles/HeroSection.css'; // Inclua qualquer estilo adicional, se necessário

const HeroSection = ({ movie }) => {
  const navigate = useNavigate(); // Inicializando useNavigate

  if (!movie) return null; // Não renderiza nada se o filme não estiver disponível

  const { title, overview, trailer_url, backdrop_path, poster_path, release_date, popularity, vote_average, vote_count } = movie;

  // Função para redirecionar para a página de detalhes do filme
  const handleWatchNow = () => {
    navigate(`/movie/${movie.id}`); // Muda para a rota de detalhes do filme
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Trailer em telas grandes */}
      <div className="hidden lg:block absolute top-0 left-0 w-full h-full">
        <ReactPlayer
          url={trailer_url}
          playing
          loop
          width="100%"
          height="120%"
          muted
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                controls: 0,
                showinfo: 0,
                modestbranding: 1,
                iv_load_policy: 3,
                rel: 0,
                fs: 0,
                cc_load_policy: 0
              }
            }
          }}
        />
        <div className="absolute inset-0 bg-black opacity-70" aria-hidden="true"></div>
      </div>

      {/* Informações e botão em telas grandes */}
      <div className="hidden lg:flex absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 animate-pulse">{title}</h1>
        <p className="text-sm md:text-md lg:text-lg text-white mb-6 drop-shadow-lg text-center max-w-lg overflow-hidden text-ellipsis">{overview}</p>
        <button 
          onClick={handleWatchNow} // Adiciona o manipulador de evento ao botão
          className="bg-red-600 text-white py-2 px-4 md:py-3 md:px-6 text-sm md:text-lg font-semibold rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-105 transition-transform duration-300 z-50" // Aumenta o z-index
          style={{ pointerEvents: 'auto' }} // Adiciona pointer-events auto
        >
          Assista Agora
        </button>
      </div>

      {/* Banner e informações em telas pequenas */}
      <div className="lg:hidden absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})` }}>
          <div className="absolute inset-0 bg-black opacity-70" aria-hidden="true"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 animate-pulse">{title}</h1>
            <p className="text-sm md:text-md text-white mb-6 drop-shadow-lg text-center max-w-lg overflow-hidden text-ellipsis">{overview}</p>
            <button 
              onClick={handleWatchNow} // Adiciona o manipulador de evento ao botão
              className="bg-red-600 text-white py-2 px-4 md:py-3 md:px-6 text-sm md:text-lg font-semibold rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-105 transition-transform duration-300 z-50" // Aumenta o z-index
              style={{ pointerEvents: 'auto' }} // Adiciona pointer-events auto
            >
              Assista Agora
            </button>
          </div>
        </div>
      </div>

      {/* Informações adicionais sobre o filme em telas médias e grandes */}
      <div className="hidden lg:flex absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col items-center lg:items-end">
        <img
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={`Poster de ${title}`}
          className="w-24 md:w-32 lg:w-48 rounded-lg shadow-lg border-2 border-white"
          loading="lazy"
        />
        <div className="mt-4 text-white text-center lg:text-right">
          <p className="text-xs md:text-sm lg:text-md font-semibold">Data de Lançamento: {new Date(release_date).toLocaleDateString()}</p>
          <p className="text-xs md:text-sm lg:text-md font-semibold">Popularidade: {popularity.toFixed(1)}</p>
          <p className="text-xs md:text-sm lg:text-md font-semibold">Avaliação: {vote_average.toFixed(1)} ({vote_count} votos)</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
