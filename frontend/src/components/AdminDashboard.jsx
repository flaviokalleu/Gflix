import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { FaTrash, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom"; // Importando Link do react-router-dom

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalMovies: 0,
    totalSeries: 0,
    totalSeasons: 0,
    totalEpisodes: 0,
  });
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    const fetchUsersAndRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado. Você deve estar logado.");
        }

        const userProfileResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserRole(userProfileResponse.data.roles[0]);

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(response.data);

        const statsResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/statistics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStatistics(statsResponse.data);
      } catch (error) {
        console.error("Erro ao buscar usuários ou estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndRole();
  }, []);

  const handleRemoveUser = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token não encontrado. Você deve estar logado.");
      return;
    }

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(users.filter((user) => user.id !== userId));

      const statsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/statistics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStatistics(statsResponse.data);
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
    }
  };

  const data = {
    labels: [
      "Total de Usuários",
      "Total de Administradores",
      "Total de Filmes",
      "Total de Séries",
      "Total de Temporadas",
      "Total de Episódios",
    ],
    datasets: [
      {
        label: "Contagem",
        data: [
          statistics.totalUsers,
          statistics.totalAdmins,
          statistics.totalMovies,
          statistics.totalSeries,
          statistics.totalSeasons,
          statistics.totalEpisodes,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <h1 className="text-white text-3xl font-bold mb-6">
        Dashboard do Administrador
      </h1>

      {loading ? (
        <p className="text-white">Carregando...</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cartões de Estatísticas */}
          {Object.entries(statistics).map(([key, value], index) => (
            <div
              key={key}
              className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-between transform transition-transform duration-300 hover:scale-105"
            >
              <div>
                <h2 className="text-white text-xl font-bold capitalize">
                  {key.replace("total", "Total de ")}
                </h2>
                <p className="text-white text-2xl">{value}</p>
              </div>
              <FaUserPlus className="text-white text-4xl" />
            </div>
          ))}

          {/* Botão para mostrar gráfico */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <button
              onClick={() => setShowGraph(!showGraph)}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-300"
            >
              {showGraph ? "Ocultar Gráfico" : "Mostrar Gráfico"}
            </button>
          </div>

          {/* Botão para importar filmes */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <Link to="/import-movies">
              <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition duration-300">
                Importar Filmes
              </button>
            </Link>
          </div>

          {/* Botão para buscar arquivos de séries */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <Link to="/fetch-series">
              <button className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition duration-300">
                Buscar Arquivos de Séries
              </button>
            </Link>
          </div>

          {/* Gráfico de Estatísticas */}
          {showGraph && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1 sm:col-span-2 lg:col-span-3">
              <Bar data={data} />
            </div>
          )}

          {/* Listagem de Usuários */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-4">
            <h2 className="text-white text-xl font-bold">Usuários</h2>
            <ul className="mt-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="bg-gray-700 p-4 mb-2 rounded flex justify-between items-center shadow-lg transition-transform duration-300 transform hover:scale-105"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">
                      {user.username}
                    </span>
                    <span className="text-gray-400">{user.email}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
