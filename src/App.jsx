import { use, useEffect, useState } from 'react'
import { useDebounce } from 'react-use';
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import {getMovies, updateMovie} from './appwrite.js';

// base url for TMDB API
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// API key for TMDB
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_KEY}`
  }
}

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  const fetchMovies = async (query='') => {
    try{
      setLoading(true);
      setError(null);

      const endpoint = query?
        `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)} &sort_by=popularity.desc` :
      `${TMDB_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      
      if(data.results.length === 0) {
        setError("No movies found. Please try a different search term.");
      }

      setMovies(data.results || []);

      if (query && data.results.length > 0) {
        await updateMovie(query, data.results[0]);
      }
    } 
    catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch movies. Please try again later.");
    }
    finally {
      setLoading(false);
    }
  }

  const fetchTrendingMovies = async () => {
    try {
      const movies = await getMovies();
      setTrendingMovies(movies);
    }
    catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <main>

      <div className="pattern" />

      <div className='wrapper'>

        <header>
          <img src="./hero-img.png" alt="hero" />
          <h1><span className='text-gradient'>Movie Web</span></h1>
          <p className='text-white'>Discover the best movies and TV shows, search for your favorite titles, and explore trending content.</p>
          {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2 className='mt-6'>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index) => (
                <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
          <h2>Find your favorite <span className='text-gradient'>Movies and TV shows</span></h2>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        

        <section className='all-movies'>

          <h2 className='mt-6'>All movies</h2>

          {loading ? 
          (<Spinner />) :
          error ?
          (<p className='error'>{error}</p>) :
          (<ul>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
          ))}
            </ul>)}
        </section>
      </div>


    </main>
  )

}

export default App
