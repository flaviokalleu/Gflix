import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirecionamento

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false); // Estado para controlar a exibição dos favoritos
  const navigate = useNavigate(); // Cria a função de navegação

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Supondo que você armazene o token no localStorage
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Inclua o token no header
            },
          }
        );
        setUser(response.data);

        // Verifica se o usuário tem a role de "admin"
        if (response.data.roles.includes("admin")) {
          navigate("/admin/dashboard"); // Redireciona para o dashboard de administrador
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token"); // Supondo que você armazene o token no localStorage
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/favorites`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Inclua o token no header
            },
          }
        );
        setFavorites(response.data);
      } catch (error) {
        console.error("Erro ao buscar filmes/séries favoritas:", error);
      }
    };

    fetchUserData();
    fetchFavorites();
  }, [navigate]); // Adicione navigate como dependência

  const toggleFavorites = () => {
    setShowFavorites((prev) => !prev); // Alternar a exibição dos favoritos
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      {/* Informações do usuário */}
      <div className="mt-6">
        {user ? (
          <h2 className="text-white text-xl font-bold">
            Bem-vindo, {user.username}!
          </h2>
        ) : (
          <h2 className="text-white text-xl font-bold">
            Carregando informações do usuário...
          </h2>
        )}
      </div>

      {/* Botão para mostrar/esconder favoritos */}
      <div className="mt-4">
        <button
          onClick={toggleFavorites}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          {showFavorites ? "Ocultar Favoritos" : "Mostrar Favoritos"}
        </button>
      </div>

      {/* Conteúdo das favoritas */}
      {showFavorites && (
        <div className="mt-6">
          <h2 className="text-white text-xl font-bold">
            Suas Séries e Filmes Favoritos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {favorites.length > 0 ? (
              favorites.map((favorite) => (
                <div key={favorite.id} className="relative group">
                  <img
                    src={favorite.poster} // Ajuste o campo conforme necessário
                    alt={favorite.title}
                    className="w-full h-auto rounded-lg transition-transform duration-300 transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 rounded-b-lg">
                    <h3 className="text-white">{favorite.title}</h3>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">
                Você não tem filmes ou séries favoritas.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
