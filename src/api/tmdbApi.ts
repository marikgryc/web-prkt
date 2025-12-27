export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const MOCK_MOVIES = [
  {
    id: 1,
    title: "Dune: Part Two",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", 
    vote_average: 8.3,
    director: "Denis Villeneuve",
    writers: "Denis Villeneuve, Jon Spaihts",
    stars: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    gallery: ["/lzWH9tME55fcae0b6.jpg", "/gEU2QniL6E8AHtMY4kRFW81i8Wu.jpg", "/qJ2tW6WMUDux911r6m7haRef0WH.jpg"]
  },
  {
    id: 2,
    title: "Oppenheimer",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    vote_average: 8.1,
    director: "Christopher Nolan",
    genres: ["Drama", "History"],
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II."
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 8.5,
    director: "Christopher Nolan",
    genres: ["Action", "Crime", "Drama"],
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker."
  },
  {
    id: 4, 
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", 
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    vote_average: 9.3,
    director: "Frank Darabont",
    writers: "Stephen King, Frank Darabont",
    stars: "Tim Robbins, Morgan Freeman, Bob Gunton",
    genres: ["Drama", "Crime"],
    overview: "Chronicles the experiences of a formerly successful banker as a prisoner in the gloomy jailhouse of Shawshank after being found guilty of a crime he did not commit.",
    gallery: ["/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg", "/v4eWkBBnAnO1x5J67qVf2q1r0fE.jpg", "/avedvodAZUczqh5wEKE72nCN_3.jpg"]
  },
  {
    id: 5,
    title: "The Matrix", 
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    vote_average: 8.7,
    director: "Lana Wachowski",
    genres: ["Action", "Sci-Fi"],
    overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth."
  },
  {
    id: 6,
    title: "Avatar: The Way of Water",
    poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    vote_average: 7.7,
    director: "James Cameron",
    genres: ["Sci-Fi", "Action", "Adventure"],
    overview: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home."
  },
  {
    id: 7,
    title: "Deadpool & Wolverine",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    vote_average: 7.9,
    director: "Shawn Levy",
    genres: ["Action", "Comedy", "Sci-Fi"],
    overview: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine."
  },
  {
    id: 8,
    title: "Inside Out 2",
    poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    backdrop_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    vote_average: 7.6,
    director: "Kelsey Mann",
    genres: ["Animation", "Family", "Comedy"],
    overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who’ve long been running a successful operation by all accounts, aren’t sure how to feel when Anxiety shows up."
  }
];

const MOCK_ACTOR = {
  id: 123,
  name: "Ryan Gosling",
  birthday: "12 Nov 1980",
  gender: "Male",
  rating: 26,
  place_of_birth: "London, Ontario, Canada",
  biography: "Ryan Thomas Gosling (born November 12, 1980) is a Canadian actor. Prominent in independent film, he has also worked in blockbuster films of varying genres, and has accrued a worldwide box office gross of over 1.9 billion USD.",
  profile_path: "/lyUyVARQFEWGengQSZlFJiA13Wi.jpg",
  known_for: [
    { id: 101, title: "La La Land", poster_path: "/uDO8zWDhfWz7xHrw9monu058SII.jpg" },
    { id: 102, title: "Blade Runner 2049", poster_path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg" },
    { id: 103, title: "Drive", poster_path: "/602vevIURmp436YZYvBuP2pOfw6.jpg" },
    { id: 104, title: "The Notebook", poster_path: "/rNzQyW4f8B8cQeg7Dgj3nZfx5Uy.jpg" },
    { id: 105, title: "Barbie", poster_path: "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg" }
  ]
};

// --- ФУНКЦІЇ API ---

export const getTrendingMovies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: MOCK_MOVIES }), 300);
    });
};

export const getNowPlayingMovies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: [...MOCK_MOVIES].reverse() }), 300);
    });
};

export const getTopRatedMovies = async () => {
    return new Promise((resolve) => {
        const sorted = [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
        setTimeout(() => resolve({ results: sorted }), 300);
    });
};

export const getUpcomingMovies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: [...MOCK_MOVIES].sort(() => 0.5 - Math.random()) }), 300);
    });
};

export const getMovieDetails = async (id: number) => {
    return new Promise((resolve) => {
        const movie = MOCK_MOVIES.find((m) => m.id === Number(id)) || MOCK_MOVIES[0];
        setTimeout(() => resolve(movie), 300);
    });
};

export const getActorDetails = async (id: number) => {
  return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_ACTOR), 300);
  });
};