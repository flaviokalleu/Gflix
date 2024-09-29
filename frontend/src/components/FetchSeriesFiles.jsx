import React, { useState } from 'react';
import axios from 'axios';

const FetchSeriesFiles = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFetchAndSave = async () => {
    console.log('Iniciando a busca e salvamento dos arquivos de séries...');
    setLoading(true);
    setMessage('Aguarde, processando arquivos...');

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
            const { processed } = statusResponse.data; // Supondo que o backend retorne o número de arquivos processados

            // Se todos os arquivos foram processados
            if (processed >= statusResponse.data.totalFiles) {
              clearInterval(interval); // Para o intervalo
              setMessage('Todos os arquivos foram processados!'); // Mensagem final
              setLoading(false); // Para o loading
            }
          }
        } catch (error) {
          console.error('Erro ao buscar o status dos arquivos:', error);
        }
      }, 1000); // Atualiza a cada segundo

    } catch (error) {
      console.error('Erro ao buscar e salvar arquivos de séries:', error);
      if (error.response) {
        console.error('Dados de resposta do erro:', error.response.data);
      }
      alert('Erro ao buscar e salvar arquivos de séries');
      setLoading(false); // Certifique-se de parar o loading em caso de erro
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
      <div className="w-full p-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-white mb-4">Atualizar Arquivos de Séries</h1>
        <button
          onClick={handleFetchAndSave}
          className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
          aria-label="Buscar e Salvar Séries"
        >
          {loading ? 'Carregando...' : 'Buscar e Salvar Séries'}
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
