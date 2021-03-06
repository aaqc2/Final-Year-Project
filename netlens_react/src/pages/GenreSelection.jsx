
 /**
  * *  This is first page that is rendered when a new user is registered.
 *   This is the first step in understanding the user, so that we can make recommendations and tackle the cold start problem.
 *  This allows the user to pick 2 of their favourite genres before proceeding on to the next page.
 *  This step enables us to narrow the user’s movie preferences according to genres. Once the checkbox’s are selected,
 *  the user can move to the next page where user will be presented with options to rate movies from their choice of genre.
  *  TMDB API calls are made to retrieve the posters
  *  */

import React, { Component } from 'react';
import GenreImages from "../components/GenreImages";
import axios from "../baseUrl";
import { checkToken } from "../components/authenticateToken";



class GenreSelection extends Component {

    constructor(props) {
        super(props);
        //bind the functions which handle changes
        this.changeCheckbox = this.changeCheckbox.bind(this);
        this.state = {
            dramaMovieRow: [],
            comedyMovieRow: [],
            horrorMovieRow: [],
            actionMovieRow: [],
            thrillerMovieRow: [],
            romanceMovieRow: [],
            checkedOptions: {},
            user: localStorage.getItem('id'),
        }
    }

    /** Keep track of the changes of check boxes. */
    onChange = checkedValues => {
        console.log("CheckedValues", checkedValues)
        this.setState(() => {
            return { checked: checkedValues };
        });
    };


//stores the values of the checkbox so that it be passed to the next page. Ensure that no more than 2 checkboxs are selected
    changeCheckbox(e) {
        console.log("Changing checkbox", e.target.name, e.target.checked);
        let selected = e.target.name;
        let value = e.target.checked;
        let allSelected = this.state.checkedOptions;
        let allValues = Object.keys(allSelected).map(key => {
            return allSelected[key]
        });
        let  filtered = allValues.filter(value => value);
        console.log("Filtered", filtered);
        // check to make sure that no more than 2 checkboxs are selected.
        if(filtered.length >= 2 && value ) {
            return alert ('You can only select a maximum of 2 genres')
        }

        allSelected[selected] = value;
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
        let allSelected = this.state.checkedOptions;

        let allValues = Object.keys(allSelected).map(key => {
            return allSelected[key]
        });

        // check to make sure that alleast one genre is selected

        if (!allValues.some(this.checked)) {
            return alert ('You should select at least 1 genre!')

        }

        // goes to the cold start rating page, and passes the checkbox values(genres) to the next page
        return this.props.history.push({
            pathname: '/ColdStartRatings',
            state:{selectedValues : allSelected}
        });
    };



    /** Make all API calls and check if the user token is valid
     * before the first render.
     **/
    componentWillMount() {
        checkToken();
        this.getDramaMovies();
        this.getComedyMovies();
        this.getActionMovies();
        this.getHorrorMovies();
        this.getRomanceMovies();
        this.getThillerMovies();

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
                    movie={movie} />;
                movieRows.push(movieComponent);
                movieRows.splice(3, 1)

            }
        });
        console.log(movieRows.length);
        return movieRows;

    };



    // API call to retrieve the drama movie posters
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
    };


    // API call to retrieve the action movie posters
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
    };

    // API call to retrieve the comedy movie posters
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
    };

    // API call to retrieve the horror movie posters
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
    };

// API call to retrieve the romance movie posters
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
    };


// API call to retrieve the Thriller movie posters
    getThillerMovies = () => {
        const url = "/discover/movie?api_key=4f65322e8d193ba9623a9e7ab5caa01e&with_genres=53";

        axios.get(url)
            .then(res => {
                const movieRows = this.getMovieRows(res, url);
                this.setState({ thrillerMovieRow: movieRows });
            })
            .catch(error => {
                console.log(error);
            })
    };



    render() {
        return (
            <div  className="newuserrating-container">

                {/*display header without the navbar*/}
                <header className="header">
                    <h1>TheMovieOracle</h1>
                    <h5>personalised movie recommendations</h5>
                </header>

                <div className="newuser-card">

                    {/*retrieve the username stored in the token to present to the user*/}
                    <h2> Welcome {localStorage.getItem('username')}  </h2>
                    <h3> To get started, tell us about your movie preferences. Using the checkboxs, select a maximum of 2 genres</h3>

                    <div className="newusercard-body">
                        <form name="new_user_form" className="newuser-rating-form"   >

                            {/*table which holds the movie posters */}
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <div >
                                            <input
                                                id="action"
                                                type="checkbox"
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
                                            <input
                                                id="thriller"
                                                type="checkbox"
                                                name="thriller"
                                                onChange={this.changeCheckbox}
                                                checked = {this.state.checkedOptions.thriller || false}
                                            />
                                            <label  htmlFor="Animated">Thriller</label>
                                            <div className="movie-genres"> {this.state.thrillerMovieRow} </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div>
                                            <input
                                                id="horror"
                                                type="checkbox"
                                                name="horror"
                                                onChange={this.changeCheckbox}
                                                checked = {this.state.checkedOptions.horror || false}
                                            />
                                            <label  htmlFor="horror">Horror</label>
                                            <div className="movie-genres"> {this.state.horrorMovieRow} </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <input
                                                id="Romance"
                                                type="checkbox"
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
                                            <input
                                                id="Drama"
                                                type="checkbox"
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
                                            <input
                                                id="comedy"
                                                type="checkbox"
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


                            {/* button to move to the next page - calls handlesubmit */}
                            <button className = "newuser-submit" onClick={this.handleSubmit}> Next </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}




export default GenreSelection;