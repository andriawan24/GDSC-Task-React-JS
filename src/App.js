import './App.css';
import { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Route, Routes, useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Context } from './Context';

function App() {
  const [context, setContext] = useState([]);
  return (
    <div className="App">
      <Context.Provider value={[context, setContext]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wishlist" element={<Bookmarked />} />
          <Route path="/detail/:movieId" element={<Detail />} />
        </Routes>
      </Context.Provider>
    </div>
  );
}

function Home() {
  const [movies, setMovies] = useState([])
  const [moviesFiltered, setMoviesFiltered] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  let navigate = useNavigate()

  useEffect(() => {
    (async function getMovies() {
      setLoading(true)

      try {
        const fetchApi = await fetch(
          "https://api.themoviedb.org/3/movie/now_playing?api_key=8b886b323a43519ec5acdccd84c0b501&language=en-US&page=1"
        )
        const jsonData = await fetchApi.json()
        setMovies(jsonData.results)
        setMoviesFiltered(jsonData.results)
      } catch (error) {
        setErr(error.message)
        console.error(error.message)
      }

      setLoading(false)
    })()
  }, [])

  const handleSearch = (e) => {
    const keyword = e.target.value
    const moviesFilter = movies.filter((movie) => {
      if (keyword) {
        return movie.original_title.toLowerCase().includes(keyword.toLowerCase())
      }

      return movie
    })
    setMoviesFiltered(moviesFilter)
  }


  const goToDetail = (mov) => {
    console.log('clicked ' + mov.original_title)
    navigate('/detail/' + mov.id)
  }

  return (
    <div className="container">
      <div className="header">
        <img src="/logo/logo.png" className="header-image" height="100" alt="This is Logo" />
        <h1>Selamat Datang di NontonKuy</h1>
        <p>Silahkan pilih informasi film terpopuler dibawah ini</p>
        <button className="btn btn-info text-light btn-sm" onClick={() => {
          navigate('/wishlist')
        }}>Lihat Wishlist</button>
      </div>
      <div className="search-layout">
        <input type="search" name="search" id="search" onChange={handleSearch} placeholder={'Cari Film'} />
      </div>
      <div className="content">
        <ul className="movie-list">
          {!err && loading && <li>Loading...</li>}
          {!loading && !err &&
            moviesFiltered.map((movie) => (
              <li className="item" key={movie.id}>
                <img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt="Dummy" onClick={() => goToDetail(movie)}/>
                <h1 className="title">{movie.original_title} ({moment(Date.parse(movie.release_date)).format('YYYY')})</h1>
                <p className="genres">Drama, History, Legend</p>
              </li>
            ))
          }
        </ul>
      </div>
      <footer className="footer">
          <p>&copy; All Right Reserved. Naufal Fawwaz Andriawan</p>
      </footer>
    </div>
  )
}

function Detail() {
  const [context, setContext] = useContext(Context)
  console.log("Data Context", context)

  const param = useParams()

  const [movie, setMovie] = useState({})
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    (async function getMovie() {
      setLoading(true)

      try {
        const fetchApi = await fetch(
          `https://api.themoviedb.org/3/movie/${param.movieId}?api_key=8b886b323a43519ec5acdccd84c0b501&language=en-US`
        )
        const jsonData = await fetchApi.json()
        setMovie(jsonData)
        const isAdd = context.find((e) => {
          return e === jsonData
        })
        if (isAdd) {
          setIsAdded(true)
        }
      } catch (error) {
        setErr(error.message)
        console.error(error.message)
      }

      setLoading(false)
    })()
  }, [])

  const addToWishlist = (movie) => {
    console.log("Movie", movie)
    if (!context.includes(movie)) {
      setContext(arr => [...arr, movie])
      setIsAdded(true)
    }
  }

  return (
    <div className="container">
      <Link to="/">Kembali ke Beranda</Link>
      {!err && loading && <p>Loading...</p>}
      {!loading && !err &&
        <div className="container-fluid mt-4">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt="Dummy" width="300px" />
              <h4 className="mt-4">Judul</h4>
              <p className="text-bold">{movie.original_title}</p>
              <h4 className="mt-4">Deskripsi</h4>
              <p>{movie.overview}</p>
              <h4 className="mt-4">Tanggal Rilis</h4>
              <p>{moment(Date.parse(movie.release_date)).format('d MMMM YYYY')}</p>
              {!isAdded && 
                <button className="btn btn-primary" onClick={() => addToWishlist(movie)}>+ Add to wishlist</button>
              }

              {isAdded && 
                <button className="btn btn-secondary disabled">+ Already added</button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}

function Bookmarked() {
  const [context, setContext] = useContext(Context)

  const [movies, setMovies] = useState(context)
  const [moviesFiltered, setMoviesFiltered] = useState(context)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  let navigate = useNavigate()

  console.log("Data " + moviesFiltered)

  const goToDetail = (mov) => {
    console.log('clicked ' + mov.original_title)
    navigate('/detail/' + mov.id)
  }

  const handleSearch = (e) => {
    const keyword = e.target.value
    const moviesFilter = movies.filter((movie) => {
      if (keyword) {
        return movie.original_title.toLowerCase().includes(keyword.toLowerCase())
      }

      return movie
    })
    setMoviesFiltered(moviesFilter)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>List Wishlist</h1>
        <button className="btn btn-info text-light btn-sm mt-4" onClick={() => {
          navigate('/')
        }}>Kembali ke Beranda</button>
      </div>
      <div className="search-layout">
        <input type="search" name="search" id="search" onChange={handleSearch} placeholder={'Cari Film'} />
      </div>
      <div className="content">
        <ul className="movie-list">
          {!err && loading && <li>Loading...</li>}
          {!loading && !err &&
            moviesFiltered.map((movie) => (
              <li className="item" key={movie.id}>
                <img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt="Dummy" onClick={() => goToDetail(movie)}/>
                <h1 className="title">{movie.original_title} ({moment(Date.parse(movie.release_date)).format('YYYY')})</h1>
                <p className="genres">Drama, History, Legend</p>
              </li>
            ))
          }
        </ul>
      </div>
      <footer className="footer">
          <p>&copy; All Right Reserved. Naufal Fawwaz Andriawan</p>
      </footer>
    </div>
  )
}

export default App;
