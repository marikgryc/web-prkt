// Це базове посилання для картинок (воно працює без ключів)
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';


const MOCK_MOVIES = [
  {
    id: 1,
    title: "Dune: Part Two",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", // Великий кадр
    vote_average: 8.3,
    director: "Denis Villeneuve",
    writers: "Denis Villeneuve, Jon Spaihts",
    stars: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    gallery: [
       "/lzWH9tME55fcae0b6.jpg", "/gEU2QniL6E8AHtMY4kRFW81i8Wu.jpg", "/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    ]
  },
  {
    id: 2,
    title: "Oppenheimer",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    vote_average: 8.1,
    overview: "The story of J. Robert Oppenheimer..."
  },
  {
    id: 3,
    title: "Interstellar",
    poster_path: "/bz9717vMiTw2EGvGxeSOozfS0c.jpg", 
    vote_average: 8.6,
    overview: "The adventures of a group of explorers..."
  },
  {
    id: 4, // ID має співпадати з тим, що в списку
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", 
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    vote_average: 9.3,
    director: "Frank Darabont",
    writers: "Stephen King, Frank Darabont",
    stars: "Tim Robbins, Morgan Freeman, Bob Gunton",
    genres: ["Drama", "Crime"],
    overview: "Chronicles the experiences of a formerly successful banker as a prisoner in the gloomy jailhouse of Shawshank after being found guilty of a crime he did not commit.",
    gallery: [
       "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg", "/v4eWkBBnAnO1x5J67qVf2q1r0fE.jpg", "/avedvodAZUczqh5wEKE72nCN_3.jpg"
    ]
  },
  {
    id: 5,
    title: "Inception",
    // Замінили постер на новіший
    poster_path: "/oYuLEt3zVCKqJCZVPranHvqFy9F.jpg",
    vote_average: 8.8,
    overview: "Cobb, a skilled thief who commits corporate espionage..."
  },
  {
    id: 6,
    title: "Avatar: The Way of Water",
    poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    vote_average: 7.7,
    overview: "Jake Sully lives with his newfound family..."
  },
  {
    id: 7,
    title: "Deadpool & Wolverine",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    vote_average: 7.9,
    overview: "A listless Wade Wilson toils away..."
  },
  {
    id: 8,
    title: "Inside Out 2",
    poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    vote_average: 7.6,
    overview: "Teenager Riley's mind headquarters..."
  }
];

const MOCK_ACTOR = {
  id: 123,
  name: "Ryan Gosling",
  birthday: "12 Nov 1980",
  gender: "Male",
  rating: 26, // Як на скріні
  place_of_birth: "London, Ontario, Canada",
  biography: "Ryan Thomas Gosling (born November 12, 1980) is a Canadian actor. Prominent in independent film, he has also worked in blockbuster films of varying genres, and has accrued a worldwide box office gross of over 1.9 billion USD.",
  profile_path: "/lyUyVARQFEWGengQSZlFJiA13Wi.jpg", // Фото Райана
  known_for: [
    { id: 101, title: "La La Land", poster_path: "/uDO8zWDhfWz7xHrw9monu058SII.jpg" },
    { id: 102, title: "Blade Runner 2049", poster_path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg" },
    { id: 103, title: "Drive", poster_path: "/602vevIURmp436YZYvBuP2pOfw6.jpg" },
    { id: 104, title: "The Notebook", poster_path: "/rNzQyW4f8B8cQeg7Dgj3nZfx5Uy.jpg" },
    { id: 105, title: "Barbie", poster_path: "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg" }
  ]
};
export const getTrendingMovies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: MOCK_MOVIES }), 300);
    });
};
export const getActorDetails = async (id: number) => {
  return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_ACTOR), 300);
  });
};
export const getNowPlayingMovies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: [...MOCK_MOVIES].reverse() }), 300);
    });
};

export const getTopRatedMovies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: MOCK_MOVIES }), 300);
    });
};

export const getUpcomingMovies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: [...MOCK_MOVIES].sort(() => 0.5 - Math.random()) }), 300);
    });
};

export const getMovieDetails = async (id: number) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_MOVIES[0]), 300);
    });
};