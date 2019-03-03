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
      // topRatedRow: [],
      genres:[]


  }

  /** Make all API calls as soon as the MovieGenreRow component mounts. */
  componentWillMount() {
    // this.getTopRated();
      this.getGenres();
  }

  /** Extract our movie data and pass it to our MovieGenre Component. */
  getMovieRows = (res, url, user) => {
    const results = res;
    let movieRows = [];
    console.log(res);
    results.map((movie) => {
      console.log("asd");
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
  getGenres= () => {
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




    render() {
        return (
            <div className="container">
               <header className="header">
                <h1>TheMovieOracle</h1>
                <h5>personalised movie recommendations</h5>
            </header>
                <br /><br /><br />
                <div className="card">
                    <div className="container user_profile">
                        <h1> Welcome </h1>
                        <h2> To get started, provide us with your ratings for the following movies.</h2>
                        <div className="row">
                            <div className="col-sm-10"><h3>Action</h3>
                            </div>
                            <div className="newUserRatingList">
                                {this.state.genres}
                              </div>
                            <div className="col-sm-10"><h3>Comedy</h3>
                            </div>
                            <div className="newUserRatingList">
                                {this.state. genres}
                              </div>
                            <div className="col-sm-10"><h3>Romantic</h3>
                            </div>
                            <div className="newUserRatingList">
                                {this.state.genres}
                              </div>
                            <div className="col-sm-10"><h3>Horror</h3>
                            </div>
                            <div className="newUserRatingList">
                                {this.state.genres}
                              </div>
                            <div className="col-sm-10"><h3>Computer animation</h3>
                            </div>
                            <div className="newUserRatingList">
                                {this.state.genres}
                              </div>
                        </div>
                        <div className="col-sm-10">
                            <Link className="landing-page-link" to="/LandingPage">Next</Link>
                        </div>
                    </div>

                </div>
            </div>

        );
    }
}


export default NewUserRatings;