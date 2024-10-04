import React, { useState } from "react";
import axios from "axios";

const FetchSeriesFiles = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFetchAndSave = async () => {
    console.log("Iniciando a busca e salvamento dos arquivos de séries...");
    setLoading(true);
    setMessage("Aguarde, processando arquivos...");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/series/fetch-and-save-files`
      );

      if (response.data && response.data.message) {
        alert(response.data.message); // Alertar a mensagem retornada da API
      }

      // Iniciar o intervalo para buscar atualizações do processamento
      const interval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/series/status`
          );

          if (statusResponse.data) {
            const { processed, totalFiles } = statusResponse.data; // Supondo que o backend retorne o número de arquivos processados

            // Se todos os arquivos foram processados
            if (processed >= totalFiles) {
              clearInterval(interval); // Para o intervalo
              setMessage("Todos os arquivos foram processados!"); // Mensagem final
              setLoading(false); // Para o loading
            }
          }
        } catch (error) {
          console.error("Erro ao buscar o status dos arquivos:", error);
        }
      }, 1000); // Atualiza a cada segundo
    } catch (error) {
      console.error("Erro ao buscar e salvar arquivos de séries:", error);
      if (error.response) {
        console.error("Dados de resposta do erro:", error.response.data);
      }
      alert("Erro ao buscar e salvar arquivos de séries");
      setLoading(false); // Certifique-se de parar o loading em caso de erro
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Atualizar Arquivos de Séries
        </h1>
        <button
          onClick={handleFetchAndSave}
          className={`w-full bg-green-500 text-white px-6 py-3 rounded-md transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
          }`}
          disabled={loading}
          aria-label="Buscar e Salvar Séries"
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
            "Buscar e Salvar Séries"
          )}
        </button>

        {loading && (
          <div className="mt-4">
            <p className="text-sm text-white text-center">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchSeriesFiles;
