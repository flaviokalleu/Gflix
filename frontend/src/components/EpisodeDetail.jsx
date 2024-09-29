// src/components/EpisodeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EpisodeDetail = () => {
    const { id } = useParams();
    const [episode, setEpisode] = useState(null);

    useEffect(() => {
        const fetchEpisode = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/series/episodes/${id}`); // Adjust this API endpoint accordingly
                if (!response.ok) throw new Error('Error fetching episode');
                const data = await response.json();
                setEpisode(data);
            } catch (error) {
                console.error('Error fetching episode:', error);
            }
        };

        fetchEpisode();
    }, [id]);

    if (!episode) return <p style={{ color: 'white' }}>Loading...</p>; // Adjust loading text color for dark mode

    return (
        <div className="bg-gray-900 h-screen w-screen flex items-center justify-center">
            <iframe
                src={episode.link} // Assuming this contains the link to the video
                title={episode.name}
                className="h-full w-full"
                allowFullScreen
            />
        </div>
    );
};

export default EpisodeDetail;
