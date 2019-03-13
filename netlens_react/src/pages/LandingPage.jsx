import React, { Component } from "react";
import axios from '../baseUrl'; 
import MovieImages from '../components/MovieImages';
import Navbar from "../components/Navbar";



class LandingPage extends Component {
  apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
  /** Hold each genre movie row in an array */
  state = {
      topRatedRow: [],
      recommendation: [],
      genreMovies: []
  }

  /** Make all API calls as soon as the MovieGenreRow component mounts. */

  componentDidMount() {
      console.log('i am mounted')
      this.getTopRated();
    this.getRecommendation();
    this.getGenreMovies()
  }


    /** Extract our movie data and pass it to our MovieGenre Component. */
  getMovieRows = (row, res, user) => {
    const results = res;
    let movieRows = [];
    console.log(res);
    results.map((movie) => {
       if (movie.data.poster_path != null) {
       const movieComponent = <MovieImages
           id={movie.data.id}
           row={row}
           userid={user}
           //url={url}
           poster={"https://image.tmdb.org/t/p/original" + movie.data.poster_path}
           info={movie} />
        movieRows.push(movieComponent);
       }
    });
   return movieRows;

  }



    getGenreMovies = () => {
              const row = 'movies';
          let result = [];
          //const user = this.props.location.state.user;
          const user = 1;
            const {location: {state: {selectedValues}}} = this.props;
            console.log(selectedValues)
                let url = [];
                  Object.keys(selectedValues).map((gen) => {
                      console.log(gen, "genrews")
                      url.push('&gen=' + gen);
                  });
             const api = 'http://127.0.0.1:8000/api/genres?' + url;
          fetch(api)
              .then((result) => {
                  return result.json();
              })
              .then((data) => {
                 console.log(data)
                  result.push(data);
                   const movieRows = this.getMovieRows(row, result, user);
                  this.setState({genreMovies: movieRows});
                   result.splice(3, 1)
              }).catch((err) => {
                  console.log(err);
              });
        }

        // const row = 'genreMovies';
        // let result = [];
        // let link = [];
        // let count = 0;
        //
        // const user = this.props.location.state.user;
        //
        // const {location: {state: {selectedValues}}} = this.props;
        //     console.log(selectedValues)
        //         let url = [];
        //           Object.keys(selectedValues).map((gen) => {
        //               console.log(gen, "genrews")
        //               url.push('&gen=' + gen);
        //           });
        // const api = 'http://127.0.0.1:8000/api/genres?' + url;
        //
        // fetch(api)
        //     .then((result) => {
        //         return result.json();
        //     })
        //     .then((data) => {
        //         data.map((id) => {
        //             Object.entries(id).forEach(([key, value]) => {
        //                 if (value == null) {
        //                     count++;
        //                 } else {
        //                     let url = '/movie/' + value + '?api_key=' + this.apiKey;
        //                     axios.get(url)
        //                         .then(res => {
        //                             console.log(res);
        //                             result.push(res);
        //                             console.log(count);
        //                             if (count >= data.length - 1) {
        //                                 const movieRows = this.getMovieRows(row, result, user);
        //
        //                                 // this.setState({genreMovies: movieRows});
        //                             }
        //                             count++;
        //                         }).catch(error => {
        //                         count++;
        //                         console.log(error);
        //
        //                     })
        //                 }
        //             });
        //         })
        //     }).catch((err) => {
        //     count++;
        //     console.log(err);



  /**
   * Send request for movies that are top rated
   */
  getTopRated = () => {
    const row = 'toprated';
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
                    if(value == null) {
                    count++;
                    }
                    else {
                        let url = '/movie/' + value + '?api_key=' + this.apiKey;
                        axios.get(url)
                            .then(res => {
                                console.log(res);
                                result.push(res);
                                console.log(count);
                                if (count >= data.length - 1) {
                                    const movieRows = this.getMovieRows(row, result, user);

                                    this.setState({topRatedRow: movieRows});
                                }
                                count++;
                            }).catch(error => {
                            count++;
                            console.log(error);

                        })
                    }
                });
            })
        }).catch((err) => {
            count++;
            console.log(err);
        });

  }

    getRecommendation = () => {
    const row = 'recommendation'
    let result = [];
    let link = [];
    let count = 0;
    //console.log(this.props.location.state.user);
        //const user = this.props.location.state.user;
        const user  = localStorage.getItem('id');
    const api = `http://127.0.0.1:8000/api/recommendation/${user}`;
    console.log(api)
    fetch(api)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            data.map((id) => {
                Object.entries(id).forEach(([key, value]) => {
                    if(value == null) {
                    count++;
                    }
                    else{
                        let url = '/movie/' + value + '?api_key=' + this.apiKey;
                        axios.get(url)
                        .then(res => {
                            result.push(res);
                            count++;
                            if(count >= data.length-1){
                                const movieRows = this.getMovieRows(row, result, user);
                                this.setState({ recommendation: movieRows });
                            }
                        }).catch(error => {
                            count++;
                            console.log(error);

                        })
                    }
                });
            })
        }).catch((err) => {
            console.log(err);
        });

  }

   render() {

       // const {location: {state: {selectedValues}}} = this.props;
       //console.log(this.state.movies, 'movies')

      return (

            <div className="movieRow">
                <Navbar/>

                 <h1> Welcome </h1>
                    <h1 className="movieRow_heading">Top Picks for you</h1>
                    <div className="movieRow_container">
                        {/*{this.state. genreMovies, 'movies genres'}*/}

                        {this.state.recommendation}
                    </div>
                       <h1 className="movieRow_heading">Top Rated</h1>
                    <div className="movieRow_container">
                        {this.state.topRatedRow}
                    </div>


            </div>


      );
   }
}

export default LandingPage;