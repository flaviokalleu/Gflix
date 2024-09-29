// src/components/EpisodeGrid.js
import React from 'react';
import { Link } from 'react-router-dom';

const EpisodeGrid = ({ episodes }) => {
    const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for image paths

    return (
        <div className="grid grid-cols-5 gap-4">
            {episodes.map((episode) => (
                <Link key={episode.id} to={`/episode/${episode.id}`} className="episode-card flex flex-col items-center">
                    <img 
                        src={`${BASE_IMAGE_URL}${episode.still_path}`} 
                        alt={episode.name} 
                        className="episode-cover w-full h-auto rounded-lg" 
                    />
                    <p className="text-center mt-2">{episode.name}</p>
                </Link>
            ))}
        </div>
    );
};

export default EpisodeGrid;
