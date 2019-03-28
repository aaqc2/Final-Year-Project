/**
 * ColdStartRatings - Page is rendered after the GenreSelection page.
 * This page help in getting direct rating from the users to build the recommednation model and address the cold start problem
 */

import React, { Component } from "react";
import axios from '../baseUrl';
import MovieImages from '../components/MovieImages';
import { checkToken } from "../components/authenticateToken";


class ColdStartRatings extends Component {
    apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
    constructor(props) {
        super(props);
        this.state = {
            userid: localStorage.getItem('id'),
            genreMovies: [],
             recommendation: [],
            genreApi: '',
            hasGenreNext: false,
            hasGenrePrevious: false,
            nextGenreApi: '',
            prevGenreApi: '',
        };

        this.handlePreviousGenreClick = this.handlePreviousGenreClick.bind(this);
        this.handleNextGenreClick = this.handleNextGenreClick.bind(this);
    };



    componentWillMount() {
        checkToken();
    }

    /** Make all API calls as soon as the MovieGenreRow component mounts. */

    componentDidMount() {
        //console.log('i am mounted');
        console.log(this.props.location.state);

        if (this.props.location.state !== undefined) {
            if (this.props.location.state.selectedValues !== undefined) {
                const {location: {state: {selectedValues}}} = this.props;
                console.log(selectedValues);
                let url = '';
                Object.keys(selectedValues).map((gen) => {
                    console.log(gen, "genres");
                    url += '&gen=' + gen;
                });
                this.setState({genreApi: `http://127.0.0.1:8000/api/genres/?${url}`}, this.getGenreMovies)
            }
        }
    }


 /** When the continue button is pressed, check that at least one movie has been rate. Then move to the landing page */
    handleSubmit = (e)  => {
        e.preventDefault();
        fetch(`http://127.0.0.1:8000/api/getNumMovies/${localStorage.getItem('id')}`)

            .then((response) => {
                console.log(response)
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if(data <= 2){
                    return alert ('Please rate at least 3 movies!');
                }
                else{
                    fetch(`http://127.0.0.1:8000/api/getCustomRec/${localStorage.getItem('id')}`)
                        .then((response) => {
                            return response;
                        })
                        .then((data) => {

                                if (data.status == 200) {
                                    return this.props.history.push({
                                        pathname: '/LandingPage',
                                        // state:{selectedValues : allSelected}
                                    });
                                }
                            }
                        )
                }
            })

        };


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
                    userid={this.state.userid}
                    //url={url}
                    poster={"https://image.tmdb.org/t/p/original" + movie.data.poster_path}
                    info={movie}/>
                movieRows.push(movieComponent);
            }
        });
        return movieRows;

    }

    /**
     * Send request for the genre movies
     */

    getGenreMovies = () => {
        const row = 'movies';
        let result = [];
        fetch(this.state.genreApi)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                console.log(data.results);
                // result.push(data.results);
                data.results.map((movie) => {
                    let url = '/movie/' + movie.links__tmdbid + '?api_key=' + this.apiKey;
                    axios.get(url)
                        .then(res => {
                            console.log(res);
                            result.push(res);
                            const movieRows = this.getMovieRows(row, result);
                            this.setState({genreMovies: movieRows});
                        }).catch(error => {
                        console.log(error);
                    });
                    if (data.next !== null) {
                        this.setState({hasGenreNext: true, nextGenreApi: data.next});
                    } else {
                        this.setState({hasGenreNext: false, nextGenreApi: ''});
                    }
                    if (data.previous !== null) {
                        this.setState({hasGenrePrevious: true, previousGenreApi: data.previous});
                    } else {
                        this.setState({hasGenrePrevious: false, previousGenreApi: ''});
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            });


    };

     /**
     * Pagination
     */


    handleNextGenreClick() {
        this.setState({genreApi: this.state.nextGenreApi}, this.getGenreMovies);
    }


    handlePreviousGenreClick() {
        this.setState({genreApi: this.state.previousGenreApi}, this.getGenreMovies);
    };


     /**
     * Render the movies based on the genre selected
     */
    render() {

        return (
            <div className="movieRow">
                <header className="header">
                    <h1>TheMovieOracle</h1>
                    <h5>personalised movie recommendations</h5>
                </header>


                <h3>To receive accurate recommendation, we need to understand your movie preferences.</h3>
                <h3> Provide ratings for the movies below </h3>
                <h1 className="movieRow_heading"> </h1>
                <div className="movieRow_container">
                    {this.state.genreMovies}
                </div>
                <div>
                    {this.state.hasGenrePrevious && <button className="btn btn-sm btn-primary"
                                                            onClick={this.handlePreviousGenreClick}>View previous</button>}
                    {this.state.hasGenreNext && <button className="nextButton btn btn-sm btn-primary"
                                                        onClick={this.handleNextGenreClick}>View more</button>}
                    <br/><br/>
                </div>
                <button className = "newuser-submit" onClick={this.handleSubmit}> Continue </button>
            </div>
        );
    }
}




export default ColdStartRatings;