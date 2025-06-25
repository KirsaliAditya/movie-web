import React from 'react'
import { useState } from 'react';

const MovieCard = ({movie: {title, vote_average, poster_path, release_date, original_language, overview}}) => {


  const [showOverview, setShowOverview] = useState(false);

  const handleToggle = () => {
    setShowOverview(!showOverview);
  }

  return (
    <div className='movie-card'>
        <div className='cursor-pointer min-h-[250px] flex items-center justify-center' onClick={handleToggle}>
            {showOverview ? (
                <div className='text-gradient text-sm max-h-48 overflow-y-auto'>
                  {overview || 'No overview available.'}
                </div>
            ) : (
              <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'} alt={title} />

      )}
        </div>

        <div className='mt-4'>
            <h3>{title}</h3>
            <div className='content'>
                <div className='rating'>
                    <img src="./star.svg" alt="star" />
                    <p>{vote_average?vote_average.toFixed(1): "N/A"}</p>
                </div>
                <span>-</span>
                <div className='year'>{release_date?release_date.split('-')[0]:"N/A"}</div>
                <span>-</span>
                <div className='lang'>{original_language}</div>
            </div>
        </div>
    </div>
  )
}

export default MovieCard