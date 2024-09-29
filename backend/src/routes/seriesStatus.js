// routes/seriesStatus.js

const express = require('express');
const router = express.Router();
const { Series } = require('../models'); // Ajuste o caminho conforme necessário

// Controlador para obter o status de processamento das séries
const getProcessingStatus = async (req, res) => {
    try {
        // Obter todas as séries
        const allSeries = await Series.findAll();

        // Inicializar contadores
        let totalSeries = allSeries.length;
        let unpostedSeriesCount = 0;

        // Percorrer as séries e contar as que ainda não foram postadas
        for (const series of allSeries) {
            // Lógica para determinar se uma série está "não postada"
            if (series.number_of_episodes === 0) {
                unpostedSeriesCount++;
            }
        }

        const postedSeriesCount = totalSeries - unpostedSeriesCount;

        res.status(200).json({
            totalSeries,
            postedSeriesCount,
            unpostedSeriesCount,
        });
    } catch (error) {
        console.error('Error in getProcessingStatus:', error.message);
        res.status(500).json({ message: 'Error fetching series status.' });
    }
};

// Rota para verificar o status do processamento das séries
router.get('/status', getProcessingStatus);

module.exports = router;
