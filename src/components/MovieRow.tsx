import React, { useRef } from 'react';
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
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'right' ? 500 : -500,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="row-container">
      <h2 className="row-title">{title}</h2>

      <div className="row-wrapper">
        <button className="scroll-btn scroll-btn-left" onClick={() => scroll('left')}>&#8249;</button>

        <div className="row-scroll" ref={scrollRef}>
          {movies
            .filter((movie) => movie.poster_path)
            .map((movie) => (
              <div key={movie.id} className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3 className="movie-name">{movie.title}</h3>
                  <span className="movie-rating">★ {(movie.vote_average ?? 0).toFixed(1)}</span>
                </div>
              </div>
            ))}
        </div>

        <button className="scroll-btn scroll-btn-right" onClick={() => scroll('right')}>&#8250;</button>
      </div>
    </div>
  );
}
