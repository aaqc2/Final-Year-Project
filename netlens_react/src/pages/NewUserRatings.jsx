import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MovieImages from "../components/MovieImages";
import axios from "../baseUrl";
import Navbar from "../components/Navbar";
// import homescreen from '../images/homescreen.png';

class NewUserRatings extends Component {
apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
  /** Hold each genre movie row in an array */
  state = {
      topRatedRow: [],
       genres: [],
  }

  /** Make all API calls as soon as the MovieGenreRow component mounts. */
  componentWillMount() {
    this.getTopRated();
    this.getGenres();
  }

  /** Extract our movie data and pass it to our MovieGenre Component. */
  getMovieRows = (res, url, user) => {
    const results = res;
    let movieRows = [];
    console.log(res);
    results.map((movie) => {
      // console.log("asd");
       if (movie.data.poster_path !== null) {
       const movieComponent = <MovieImages
           id={movie.data.id}
           userid={user}
           url={url}
           poster={"https://image.tmdb.org/t/p/original" + movie.data.poster_path}
           info={movie} />
        movieRows.push(movieComponent);
       }
    });
   return movieRows;

  }


  /**
   * Send request for movies that are top rated
   */
  getTopRated = () => {
    let result = [];
    let link = [];
    let count = 0;
    const api = 'http://127.0.0.1:8000/api/toprated';
    //const user = this.props.location.state.user;
    const user = 1;
    fetch(api)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            data.map((id) => {
                Object.entries(id).forEach(([key, value]) => {
                    let url = '/movie/' + value + '?api_key=' + this.apiKey;
                    axios.get(url)
                        .then(res => {
                            result.push(res);
                            link.push(url);
                            if(count >= data.length-1){
                                const movieRows = this.getMovieRows(result, link, user);
                                this.setState({ topRatedRow: movieRows });
                            }
                            count++;
                        }).catch(error => {
                            console.log(error);
                        })
                });
            })
        }).catch((err) => {
            console.log(err);
        });

  }

    getTopRated = () => {
    let result = [];
    let link = [];
    let count = 0;
    const api = 'http://127.0.0.1:8000/api/toprated';
    //const user = this.props.location.state.user;
    const user = 1;
    fetch(api)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            data.map((id) => {
                Object.entries(id).forEach(([key, value]) => {
                    let url = '/movie/' + value + '?api_key=' + this.apiKey;
                    axios.get(url)
                        .then(res => {
                            result.push(res);
                            link.push(url);
                            if(count >= data.length-1){
                                const movieRows = this.getMovieRows(result, link, user);
                                this.setState({ genres: movieRows });
                            }
                            count++;
                        }).catch(error => {
                            console.log(error);
                        })
                });
            })
        }).catch((err) => {
            console.log(err);
        });

  }

    getGenres = () => {
    let result = [];
    let link = [];
    let count = 0;
    //console.log(this.props.location.state.user);
    // const user = this.props.location.state.user;
    const user = 1;
    const api = `http://127.0.0.1:8000/api/recommendation/${user}`;
    fetch(api)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            data.map((id) => {
                Object.entries(id).forEach(([key, value]) => {
                    let url = '/movie/' + value + '?api_key=' + this.apiKey;
                    axios.get(url)
                        .then(res => {
                            result.push(res);
                            link.push(url);
                            if(count >= data.length-1){
                                const movieRows = this.getMovieRows(result, link, user);
                                this.setState({ recommendation: movieRows });
                            }
                            count++;
                        }).catch(error => {
                            console.log(error);
                        })
                });
            })
        }).catch((err) => {
            console.log(err);
        });

  }

   render() {

      return (

            <div className="newuserratings-container">
                <Navbar/>

                <h1> Welcome </h1>
                <h3> To start receiving recommendations, tell us your preferences by rating the movies below </h3>

                <h1 className="movieRow_heading">Top Rated</h1>
                    <div className="movieRow_container">
                        {this.state.topRatedRow}
                    </div>
                <h1 className="movieRow_heading">Top Picks for you</h1>
                    <div className="movieRow_container">
                        {this.state.genres}
                    </div>
                </div>

      );
   }
}


export default NewUserRatings;