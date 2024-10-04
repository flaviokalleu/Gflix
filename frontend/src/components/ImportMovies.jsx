import React, { useState } from "react";
import axios from "axios";

const ImportMovies = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImport = async () => {
    setLoading(true);
    setMessage("Aguarde, importando filmes...");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/movies/import"
      );
      alert(response.data.message);
      setMessage("Importação concluída!");
    } catch (error) {
      console.error("Erro ao importar filmes:", error);
      alert("Erro ao importar filmes. Confira o console para mais detalhes.");
      setMessage("Erro na importação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-movies min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Importar Filmes
        </h2>

        <button
          onClick={handleImport}
          className={`w-full bg-blue-500 text-white px-6 py-3 rounded-md transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0016 0 8 8 0 00-16 0z"
                />
              </svg>
              Carregando...
            </span>
          ) : (
            "Importar do Filemoon"
          )}
        </button>

        {message && (
          <div
            className={`mt-4 text-sm text-center ${
              loading ? "text-gray-400" : "text-green-500"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportMovies;
