import React, { Component } from "react";
import axios from '../baseUrl'; 
import MovieImages from '../components/MovieImages'; 

//import StarRating from '../components/StarRating.js';

class LandingPage extends Component {

  /** Hold each genre movie row in an array */
  state = {
    trendingMovieRow: [],
    topRatedRow: [],
    comedyMovieRow: [],
    horrorMovieRow: [],
    actionMovieRow: [],
    animatedMovieRow: [],
    romanceMovieRow: [],
    
  }

  /** Make all API calls as soon as the MovieGenreRow component mounts. */
  componentWillMount() {
    this.getTrending(); 
    this.getTopRated(); 
    this.getComedyMovies(); 
    this.getActionMovies(); 
    this.getHorrorMovies(); 
    this.getRomanceMovies(); 
    this.getAnimatedMovies(); 
  }
  

  /** Extract our movie data and pass it to our MovieGenre Component. */
  getMovieRows = (res, url) => {
    const results = res.data.results; 
    let movieRows = []; 
     
    results.forEach((movie) => {
      let movieImageUrl = "https://image.tmdb.org/t/p/original/" + movie.poster_path;
    
       if (movie.poster_path !== null) {
       
       const movieComponent = <MovieImages
          // movieDetailsPage={() => this.getMovieDetails(movie)}
           key={movie.id}
           url={url}
           posterUrl={movieImageUrl}
           movie={movie} />
        movieRows.push(movieComponent);
//        console.log(movieComponent.key);
       }
    })
    
   return movieRows; 
       
  }

    /* TOP PICKS--- */
   
  getTrending = () => {
    const url = "/discover/movie?api_key=224ce27b38a3805ecf6f6c36eb3ba9d0&with_genres=28"; 
   
    axios.get(url)
      .then(res => {
        const movieRows = this.getMovieRows(res, url);
        
        this.setState({ trendingMovieRow: movieRows });
      })
      .catch(error => {
        console.log(error);
      });
  }
  /**
   * Send request for movies that are popular right now
   */
  getTrending = () => {
    const url = "/trending/all/week?api_key=224ce27b38a3805ecf6f6c36eb3ba9d0&language=en-US"; 
   
    axios.get(url)
      .then(res => {
        const movieRows = this.getMovieRows(res, url);
        
        this.setState({ trendingMovieRow: movieRows });
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Send request for movies that are top rated 
   */
  getTopRated = () => {
    const url = "/movie/top_rated?api_key=4f65322e8d193ba9623a9e7ab5caa01e"; 

    axios.get(url)
      .then(res => {
        const movieRows = this.getMovieRows(res, url);

        this.setState({ topRatedRow: movieRows }); 
      }).catch(error => {
        console.log(error); 
      })
  }

  getActionMovies = () => {
    const url = "/discover/movie?api_key=224ce27b38a3805ecf6f6c36eb3ba9d0&with_genres=28";

    axios.get(url)
      .then(res => {
        const movieRows = this.getMovieRows(res, url);

        this.setState({ actionMovieRow: movieRows });
      })
      .catch(error => {
        console.log(error);
      })
  }

  getComedyMovies = () => {
    const url = "/discover/movie?api_key=224ce27b38a3805ecf6f6c36eb3ba9d0&with_genres=35";

    axios.get(url)
      .then(res => {
        const movieRows = this.getMovieRows(res, url);

        this.setState({ comedyMovieRow: movieRows });
      })
      .catch(error => {
        console.log(error);
      })
  }

  getHorrorMovies = () => {
    const url = "/discover/movie?api_key=224ce27b38a3805ecf6f6c36eb3ba9d0&with_genres=27";

    axios.get(url)
      .then(res => {
        const movieRows = this.getMovieRows(res, url);

        this.setState({ horrorMovieRow: movieRows });
      })
      .catch(error => {
        console.log(error);
      })
  }

  getRomanceMovies = () => {
    const url = "/discover/movie?api_key=224ce27b38a3805ecf6f6c36eb3ba9d0&with_genres=10749";

    axios.get(url)
      .then(res => {
        const movieRows = this.getMovieRows(res, url);

        this.setState({ romanceMovieRow: movieRows });
      })
      .catch(error => {
        console.log(error);
      })
  }

  getAnimatedMovies = () => {
    const url = "/discover/movie?api_key=224ce27b38a3805ecf6f6c36eb3ba9d0&with_genres=16";

    axios.get(url)
      .then(res => {
        const movieRows = this.getMovieRows(res, url);

        this.setState({ animatedMovieRow: movieRows });
      })
      .catch(error => {
        console.log(error);
      })
  }


   render() {

      return (  
        <div className="movieRow">

        <h1 className="movieRow_heading">Top picks for you </h1>
          <div className="movieRow_container">
              {this.state.trendingMovieRow}
          </div>
          <h1 className="movieRow_heading">Trending Now</h1>
          <div className="movieRow_container">
              {this.state.trendingMovieRow}
          </div>

           {/* <StarRating />  */}

          <h1 className="movieRow_heading">Top Rated</h1>
          <div className="movieRow_container">
              {this.state.topRatedRow}
          </div>

          <h1 className="movieRow_heading">Action Movies</h1>
          <div className="movieRow_container">
              {this.state.actionMovieRow}
          </div>

          <h1 className="movieRow_heading">Comedy Movies</h1>
          <div className="movieRow_container">
              {this.state.comedyMovieRow}
          </div>

          <h1 className="movieRow_heading">Horror Movies</h1>
          <div className="movieRow_container">
              {this.state.horrorMovieRow}
          </div>

          <h1 className="movieRow_heading">Romance Movies</h1>
          <div className="movieRow_container">
              {this.state.romanceMovieRow}
          </div>

          <h1 className="movieRow_heading">Animated Films</h1>
          <div className="movieRow_container">
              {this.state.animatedMovieRow}
          </div>
        
        </div>
      );
   }
}

export default LandingPage; 
