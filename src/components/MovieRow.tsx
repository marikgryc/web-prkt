import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../api/tmdbApi';
import './MovieRow.css'; 

interface Movie {
  id: number;
  poster_path: string;
  title: string;
  vote_average: number;
}

interface Props {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: Props) {
  const navigate = useNavigate(); // <--- Хук навігації

  return (
    <div className="row-container">
      <h2 className="row-title">{title}</h2>
      
      <div className="row-scroll">
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className="movie-card"
            onClick={() => navigate(`/movie/${movie.id}`)} // <--- КЛІК ТУТ
          >
            {/* ... картинка і текст залишаються ті самі ... */}
             <img 
              src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/200x300'} 
              alt={movie.title} 
              className="movie-poster"
            />
            <div className="movie-info">
              <h3 className="movie-name">{movie.title}</h3>
              <span className="movie-rating">★ {movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}