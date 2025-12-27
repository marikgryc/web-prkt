import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getImageUrl } from '../api/tmdbApi';

// Інтерфейс для типу даних фільму
interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
}

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (id) {
          const data = await getMovieDetails(Number(id));
          setMovie(data);
        }
      } catch (error) {
        console.error("Помилка завантаження фільму:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="text-white text-center mt-20">Завантаження...</div>;
  }

  if (!movie) {
    return <div className="text-white text-center mt-20">Фільм не знайдено</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-10">
      {/* Кнопка назад (Текстова версія) */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-50 bg-black/50 px-4 py-2 rounded-full hover:bg-white/20 transition font-medium backdrop-blur-sm"
      >
        ← Назад
      </button>

      {/* Головний банер */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10" />
        {movie.backdrop_path || movie.poster_path ? (
           <img 
            src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            Немає зображення
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 w-full p-8 z-20 container mx-auto flex flex-col md:flex-row gap-8 items-end">
          {/* Постер (маленький) */}
          <img 
            src={getImageUrl(movie.poster_path)} 
            alt={movie.title}
            className="w-48 rounded-lg shadow-2xl hidden md:block border-2 border-white/10" 
          />
          
          <div className="flex-1 mb-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap gap-6 items-center text-sm md:text-base text-gray-300 mb-6 font-medium">
              {/* Рейтинг (Символ зірки) */}
              <span className="flex items-center gap-1 text-yellow-400 text-lg">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              
              {/* Рік */}
              <span className="flex items-center gap-1">
                Рік: {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
              </span>
              
              {/* Тривалість */}
              <span className="flex items-center gap-1">
                Час: {movie.runtime} хв
              </span>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              {movie.genres?.map(g => (
                <span key={g.id} className="px-3 py-1 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/10">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Опис */}
      <div className="container mx-auto px-6 mt-8 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-500">Про фільм</h2>
        <p className="text-gray-300 leading-relaxed text-lg">
          {movie.overview || "Опис відсутній."}
        </p>
      </div>
    </div>
  );
};

export default MoviePage;