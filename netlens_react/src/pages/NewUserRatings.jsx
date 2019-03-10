import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GenreImages from "../components/GenreImages";
import axios from "../baseUrl";
import Navbar from "../components/Navbar";
import action1 from "../images/action1.png";



class NewUserRatings extends Component {

 apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
    constructor(props) {
    super(props);
    this.state = {
      checked: [],
    dramaMovieRow: [],
    comedyMovieRow: [],
    horrorMovieRow: [],
    actionMovieRow: [],
    animatedMovieRow: [],
    romanceMovieRow: [],

    };
  }


  // onChange = checkedValues => {
  //   this.setState(() => {
  //     return { checked: checkedValues };
  //   });
  // };
  //
  // isDisabled = id => {
  //   return (
  //     // this.state.checked.length > 1 && this.state.checked.indexOf(id) === -1
  //   );
  // };
  //


  /** Make all API calls as soon as the MovieGenreRow component mounts. */
  componentWillMount() {

      this.getDramaMovies();
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
       const movieComponent = <GenreImages
           key={movie.id}
           url={url}
            posterUrl={movieImageUrl}
           movie={movie} />
        movieRows.push(movieComponent);
          movieRows.splice(3, 1)

       }
    })
   console.log(movieRows.length);
   return movieRows;

  }


    getDramaMovies = () => {
    const url = "/discover/movie?api_key=224ce27b38a3805ecf6f6c36eb3ba9d0&with_genres=18";

    axios.get(url)
      .then(res => {
        const movieRows = this.getMovieRows(res, url);

        this.setState({ dramaMovieRow: movieRows });
      })
      .catch(error => {
        console.log(error);
      });
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







  handleChange() {
        let selected = [];
        var cbAction = document.getElementById("Action");
        if (cbAction.checked === true) {
            selected.push(cbAction.id);
            console.log(cbAction.id);
        }
        var cbComedy = document.getElementById("Comedy");
        if (cbComedy.checked === true) {
            selected.push(cbComedy.id);
            console.log(cbComedy.id);
        }
        var cbDrama = document.getElementById("Drama");
        if (cbDrama.checked === true) {
            selected.push(cbDrama.id);
            console.log(cbDrama.id);
        }
        var cbRomance = document.getElementById("Romance");
        if (cbRomance.checked === true) {
            selected.push(cbRomance.id);
            console.log(cbRomance.id);
        }
        var cbThriller = document.getElementById("Thriller");
        if (cbThriller.checked === true) {
            selected.push(cbThriller.id);
            console.log(cbThriller.id);
        }
        var cbSciFi = document.getElementById("Sci-Fi");
        if (cbSciFi.checked === true) {
            selected.push(cbSciFi.id);
            console.log(cbSciFi.id);
        }


        let url = [];
        selected.map((movies) => {
            url.push('&gen=' + movies);
        });

        let api = 'http://127.0.0.1:8000/api/genres/?' + url;
        let movieList = [];
        fetch(api)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                data.map((item) => {
                    movieList.push(item);
                });
                //displays list of movies
                console.log("Movie List", movieList)
                var list = "";
                for (var i = 0; i < movieList.length; i++) {


                    list += "<tr><td><a href='/info/" + movieList[i].movieid + "'>" + movieList[i].title + "</a></td></tr>";
                }
                document.getElementById('movieList').innerHTML = list;
            })
    }

//
// handleFormSubmit(e) {
//     e.preventDefault();
//     let userData = this.state.newUser;
//
//     fetch('http://example.com',{
//         method: "POST",
//         body: JSON.stringify(userData),
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//       }).then(response => {
//         response.json().then(data =>{
//           console.log("Successful" + data);
//         })
//     })
//   }


    render() {
        return (
            <div className="newuserrating-container">
                <Navbar/>
                <br/><br/><br/>


                <div className="newuser-card">
                    <br/>  <br/>
                          <h1> Welcome </h1>

                    <h3> To get started, tell us about your movie preferences. Select your top two favourite movie genres</h3>

                        <div className="filter-content">
                            <div className="newusercard-body">
                                <form className="newuser-rating-form" action="/" method="get" onSubmit={this.handleSubmit} >

                                    <table>
                                        <tr>
                                            <td>
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input"
                                            onChange= {this.handleChange}
                                           // disabled={this.isDisabled("Action")}
                                    />
                                    <label className="custom-control-label" htmlFor="Action">Action</label> <br/>

                                    <div className="movie-genres">   {this.state.actionMovieRow} </div>

                                </div>
                                {/* form-check.// */}

                                            </td>
                                            <td>
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                          // disabled={this.isDisabled("Comedy")}
                                    />
                                    <label className="custom-control-label" htmlFor="Comedy" >Comedy</label>

                                     <div className="movie-genres"> {this.state.comedyMovieRow} </div>
                                </div>
                                            </td>
                                        </tr>

                                        <tr>

                                            <td>

                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                           // disabled={this.isDisabled("Drama")}
                                    />
                                     <label className="custom-control-label" htmlFor="Drama" >Drama</label>
                                    <div className="movie-genres"> {this.state.dramaMovieRow} </div>
                                </div>
                                            </td>

                                    <td>
                                 <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                           // disabled={this.isDisabled("Romance")}
                                    />
                                    <label className="custom-control-label" htmlFor="Romance">Romance</label>

                                      <div className="movie-genres"> {this.state.romanceMovieRow} </div>
                                </div>
                                    </td>
                                    </tr>

                                        <tr>
                                    <td>
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                           // disabled={this.isDisabled("Thriller")}
                                    />
                                    <label className="custom-control-label" htmlFor="Thriller">Thriller</label>

                                      <div className="movie-genres"> {this.state.horrorMovieRow} </div>
                                </div>
                                    </td>

                                    <td>

                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                         // disabled={this.isDisabled("Sci-Fi")}
                                    />
                                    <label className="custom-control-label" htmlFor="Sci-Fi">Sci-Fi</label>

                                   <div className="movie-genres"> {this.state.animatedMovieRow} </div>
                                    <button className = "newuser-submit"> Next </button>
                                </div>
                                    </td>
                                    </tr>
                                    </table>


</form>

                            </div>

                        </div>
                </div>
            </div>




        );
    }
}






export default NewUserRatings;