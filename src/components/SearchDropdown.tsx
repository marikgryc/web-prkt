import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchGlobalSearch } from '../api/tmdbApi';
import './SearchDropdown.css';

export const SearchDropdown = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults(null);
            setIsOpen(false);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await fetchGlobalSearch(query);
                setResults(data);
                setIsOpen(true);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

 const getImageUrl = (path, isAvatar = false) => {
  if (!path) {
    return isAvatar 
      ? `https://ui-avatars.com/api/?name=User&background=333&color=fff` 
      : `https://placehold.co/40x60/222/ffffff?text=No+Img`;
  }
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/w200${path}`;
};
if (results && results.movies && results.movies.length > 0) {
        console.log("Дані першого фільму з бекенду:", results.movies[0]);
    }
    return (
        
        <div className="search-wrapper" ref={wrapperRef}>
            <div className="search-input-container">
                <input
                    type="text"
                    className="search-input-field"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies, actors, users..."
                    onFocus={() => results && setIsOpen(true)}
                />
                {isLoading && <div className="search-loader">⏳</div>}
            </div>

            {isOpen && results && (
                <div className="search-results-dropdown">
                    {/* Секція: Фільми */}
                  {results.movies?.length > 0 && (
    <div className="search-section">
        <div className="search-section-title">Movies</div>
        {results.movies.slice(0, 5).map(movie => {
            // Визначаємо ID (пробуємо всі варіанти, які є в твоїх структурах)
            const id = movie.id || movie.movie_id;
            // Визначаємо назву (для фільмів або серіалів)
            const title = movie.title || movie.name;

            return (
                <Link 
                    to={`/movie/${id}`} 
                    key={id} 
                    className="search-result-item" 
                    onClick={() => setIsOpen(false)}
                >
                    <img src={getImageUrl(movie.poster_path)} alt="" />
                    <div className="search-item-info">
                        <span className="search-item-name">{title}</span>
                        <span className="search-item-meta">
    ⭐ {
       
        (() => {
            const rating = movie.imdb_rating ?? movie.vote_average;
            return (rating !== undefined && rating !== null && rating !== 0) 
                ? Number(rating).toFixed(1) 
                : 'N/A';
        })()
    }
</span>
                    </div>
                </Link>
            );
        })}
    </div>
)}

                   {/* Секція: Актори */}
                        {results.credits?.length > 0 && (
                            <div className="search-section">
                                <div className="search-section-title">Actors</div>
                                {results.credits.slice(0, 3).map(credit => (
                                    // ВИПРАВЛЕНО: замінили /person/ на /actor/
                                    <Link to={`/actor/${credit.credit_id}`} key={credit.credit_id} className="search-result-item" onClick={() => setIsOpen(false)}>
                                        <img src={getImageUrl(credit.profile_path, true)} className="round-img" alt="" />
                                        <span className="search-item-name">{credit.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    {/* Секція: Користувачі */}
                    {results.users?.length > 0 && (
                        <div className="search-section">
                            <div className="search-section-title">Users</div>
                            {results.users.slice(0, 3).map(user => (
                                <Link to={`/user/${user.user_id}`} key={user.user_id} className="search-result-item" onClick={() => setIsOpen(false)}>
                                    <img src={getImageUrl(user.avatar_url, true)} className="round-img" alt="" />
                                    <span className="search-item-name">@{user.username}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Порожній результат */}
                    {!results.movies?.length && !results.users?.length && !results.credits?.length && (
                        <div className="search-no-results">Nothing found 😢</div>
                    )}
                </div>
            )}
        </div>
    );
    
};