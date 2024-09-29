import React, { useState } from 'react';
import axios from 'axios';

const ImportMovies = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    setLoading(true);
    setMessage('Aguarde, importando filmes...'); // Mensagem de espera

    try {
      const response = await axios.post('http://localhost:5000/api/movies/import'); 
      alert(response.data.message); // Alerta com a mensagem da API
      setMessage('Importação concluída!'); // Mensagem após conclusão
    } catch (error) {
      console.error('Erro ao importar filmes:', error);
      alert('Erro ao importar filmes. Confira o console para mais detalhes.');
      setMessage('Erro na importação.'); // Mensagem de erro
    } finally {
      setLoading(false); // Para o loading no final do processo
    }
  };

  return (
    <div className="import-movies min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
      <div className="w-full p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-white mb-4">Importar Filmes</h2>
        <button
          onClick={handleImport}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Importar do Filemoon'}
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

export default ImportMovies;
