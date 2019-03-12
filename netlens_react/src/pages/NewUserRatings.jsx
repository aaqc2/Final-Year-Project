import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GenreImages from "../components/GenreImages";
import axios from "../baseUrl";
import Navbar from "../components/Navbar";


class NewUserRatings extends Component {

    constructor(props) {
    super(props);
    this.changeCheckbox = this.changeCheckbox.bind(this);
    this.state = {
        dramaMovieRow: [],
        comedyMovieRow: [],
        horrorMovieRow: [],
        actionMovieRow: [],
        animatedMovieRow: [],
        romanceMovieRow: [],
        checkedOptions: {},

    }
  }


  onChange = checkedValues => {
        console.log("CheckedValues", checkedValues)
    this.setState(() => {
      return { checked: checkedValues };
    });
  };


    changeCheckbox(e) {
      console.log("Changing checkbox", e.target.name, e.target.checked)
        let selected = e.target.name
        let value = e.target.checked
        let allSelected = this.state.checkedOptions
        let allValues = Object.keys(allSelected).map(key => {
            return allSelected[key]
        })
        let  filtered = allValues.filter(value => value)
        console.log("Filtered", filtered)
        if(filtered.length >= 2 && value ) { return alert ('Select a maximum of 2 genres') }

        allSelected[selected] = value
        this.setState({
            checkedOptions: allSelected
        })
    }

    checked = (element) => {
          // checks whether an element is checked
          return element  === true;
        };

    handleSubmit = (e)  => {
        e.preventDefault();
        let value = e.target.checked
        let allSelected = this.state.checkedOptions;

        let allValues = Object.keys(allSelected).map(key => {
            return allSelected[key]
        })

        if (!allValues.some(this.checked)) {
             return alert ('You should select at least 1 genre!')

        }
        return this.props.history.push('/LandingPage', {selectedValues : allSelected})

        }



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
    const url = "/discover/movie?api_key=4f65322e8d193ba9623a9e7ab5caa01e&with_genres=18";

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
    const url = "/discover/movie?api_key=4f65322e8d193ba9623a9e7ab5caa01e&with_genres=28";

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
    const url = "/discover/movie?api_key=4f65322e8d193ba9623a9e7ab5caa01e&with_genres=27";

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
    const url = "/discover/movie?api_key=4f65322e8d193ba9623a9e7ab5caa01e&with_genres=10749";

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
    const url = "/discover/movie?api_key=4f65322e8d193ba9623a9e7ab5caa01e&with_genres=16";

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
      console.log(this.props, 'checkedboxs test')
        return (
            <div className="newuserrating-container">
                <Navbar/>

                <div className="newuser-card"> <br/> <br/>
                    <h1> Welcome </h1>
                    <h3> To get started, tell us about your movie preferences. Select your top two favourite movie genres</h3>

                            <div className="newusercard-body">

                                <form name="new_user_form" className="newuser-rating-form"   >
                                    <table>
                                       <tbody>

                                        <tr>
                                            <td>
                                                <div>
                                                    <input type="checkbox"
                                                           name="action"
                                                           onChange={this.changeCheckbox}
                                                           checked = {this.state.checkedOptions.action || false}
                                                    />
                                                    <label  htmlFor="Action">Action</label> <br/>
                                                    <div className="movie-genres">   {this.state.actionMovieRow} </div>
                                                </div>
                                            </td>
                                             <td>
                                                 <div>
                                                    <input type="checkbox"
                                                           name="animated"
                                                           onChange={this.changeCheckbox}
                                                           checked = {this.state.checkedOptions.animated || false}
                                                    />
                                                    <label  htmlFor="Animated">Animated</label>
                                                    <div className="movie-genres"> {this.state.animatedMovieRow} </div>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                              <td>
                                                <div>
                                                    <input type="checkbox"
                                                           name="horror"
                                                            onChange={this.changeCheckbox}
                                                           checked = {this.state.checkedOptions.horror || false}
                                                    />
                                                    <label  htmlFor="Thriller">Thriller</label>
                                                    <div className="movie-genres"> {this.state.horrorMovieRow} </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <input type="checkbox"
                                                           name="romance"
                                                           onChange={this.changeCheckbox}
                                                           checked = {this.state.checkedOptions.romance || false}
                                                           />
                                                    <label htmlFor="Romance">Romance</label>
                                                     <div className="movie-genres"> {this.state.romanceMovieRow} </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>


                                            <td>
                                                <div>
                                                   <input type="checkbox"
                                                           name="drama"
                                                           onChange={this.changeCheckbox}
                                                           checked = {this.state.checkedOptions.drama || false}
                                                           />
                                                     <label  htmlFor="Drama" >Drama</label>
                                                     <div className="movie-genres"> {this.state.dramaMovieRow} </div>
                                                </div>
                                            </td>

                                            <td>
                                            <div>
                                                <input type="checkbox"
                                                           name="comedy"
                                                           onChange={this.changeCheckbox}
                                                           checked = {this.state.checkedOptions.comedy|| false}
                                                           />
                                                <label htmlFor="Comedy" >Comedy</label>
                                                 <div className="movie-genres"> {this.state.comedyMovieRow} </div>
                                            </div>
                                            </td>
                                        </tr>
                                       </tbody>
                                    </table>
                                       <button className = "newuser-submit" onClick={this.handleSubmit}> Next </button>
                                </form>
                           </div>
                </div>
            </div>
        );
    }

}

export default NewUserRatings;