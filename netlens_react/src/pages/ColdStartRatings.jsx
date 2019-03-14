import React, { Component } from "react";
import axios from '../baseUrl';
import MovieImages from '../components/MovieImages';
import Recommendations from '../components/Recommendations';
import Navbar from "../components/Navbar";



class ColdStartRatings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topRatedRow: [],
            genreMovies: [],
            topRatedApi: 'http://127.0.0.1:8000/api/toprated',
            hasTopRatedNext: false,
            hasTopRatedPrevious: false,
            nextTopRatedApi: '',
            prevTopRatedApi: '',
        };
        this.handlePreviousTopRatedClick = this.handlePreviousTopRatedClick.bind(this);
        this.handleNextTopRatedClick = this.handleNextTopRatedClick.bind(this);
    };

    apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
    /** Hold each genre movie row in an array */

    state = {
        topRatedRow: [],
        genreMovies: []
    }


    handleSubmit = (e)  => {
        e.preventDefault();
        // let value = e.target.checked
        // let allSelected = this.state.checkedOptions;
        //
        // let allValues = Object.keys(allSelected).map(key => {
        //     return allSelected[key]
        // })
        //
        // if (!allValues.some(this.checked)) {
        //      return alert ('You should select at least 1 genre!')
        //
        // }
        return this.props.history.push({
            pathname: '/LandingPage',
            // state:{selectedValues : allSelected}
        });
    };


    /** Make all API calls as soon as the MovieGenreRow component mounts. */

    componentDidMount() {
        console.log('i am mounted');
        console.log(this.props.location.state);
        this.getTopRated();
        if(this.props.location.state.selectedValues !== undefined) {
            this.getGenreMovies();
        }
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
                    poster={"https://image.tmdb.org/t/p/original" + movie.data.poster_path}
                    info={movie}/>
                movieRows.push(movieComponent);
            }
        });
        return movieRows;

    }


    getGenreMovies = () => {
        const row = 'movies';
        let result = [];
        let count = 0;
        //const user = this.props.location.state.user;
        const user = 1;
        const {location: {state: {selectedValues}}} = this.props;
        console.log(selectedValues);
        let url = [];
        Object.keys(selectedValues).map((gen) => {
            console.log(gen, "genres");
            url.push('&gen=' + gen);
        });
        const api = 'http://127.0.0.1:8000/api/genres/?' + url;
        fetch(api)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                console.log(data.results);
                // result.push(data.results);
                data.results.map((movie) => {
                    // const movieRows = this.getMovieRows(row, movie, user);
                    // this.setState({genreMovies: movieRows});
                    // console.log(movie.links__tmdbid);
                    let url = '/movie/' + movie.links__tmdbid + '?api_key=' + this.apiKey;
                    axios.get(url)
                        .then(res => {
                            console.log(res);
                            result.push(res);
                            console.log(count);
                            if (count >= data.results.length - 1) {
                                const movieRows = this.getMovieRows(row, result, user);
                                this.setState({genreMovies: movieRows});
                            }
                            count++;
                        }).catch(error => {
                        count++;
                        console.log(error);
                    });
                });
            }).catch((err) => {
            console.log(err);
        });
    }




    /**
     * Send request for movies that are top rated
     */
    getTopRated = () => {
        const row = 'toprated';
        let result = [];
        let link = [];
        let count = 0;
        // const api = 'http://127.0.0.1:8000/api/toprated';
        //const user = this.props.location.state.user;
        const user = 1;
        fetch(this.state.topRatedApi)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                data.results.map((id) => {
                    Object.entries(id).forEach(([key, value]) => {
                        if (value == null) {
                            count++;
                        } else {
                            let url = '/movie/' + value + '?api_key=' + this.apiKey;
                            axios.get(url)
                                .then(res => {
                                    console.log(res);
                                    result.push(res);
                                    console.log(count);
                                    if (count >= data.results.length - 1) {
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
                });
                if (data.next !== null) {
                    this.setState({hasTopRatedNext: true, nextTopRatedApi: data.next});
                } else {
                    this.setState({hasTopRatedNext: false, nextTopRatedApi: ''});
                }
                if (data.previous !== null) {
                    this.setState({hasTopRatedPrevious: true, previousTopRatedApi: data.previous});
                } else {
                    this.setState({hasTopRatedPrevious: false, previousTopRatedApi: ''});
                }
            }).catch((err) => {
            count++;
            console.log(err);
        });

    };

    handleNextTopRatedClick() {
        this.setState({topRatedApi: this.state.nextTopRatedApi}, this.getTopRated);
    }

    handlePreviousTopRatedClick() {
        // this.state.api = this.state.previousApi;
        // this.getSearchQuery();
        this.setState({topRatedApi: this.state.previousTopRatedApi}, this.getTopRated);
    };

    render() {

        // const {location: {state: {selectedValues}}} = this.props;
        //console.log(this.state.movies, 'movies')
        console.log(this.state.genreMovies);
        return (

            <div className="coldstart-container">
                 < Navbar/>
                <div className='movieRow'>
                         <h1> Welcome </h1>
                <h2>To receive accurate recommendation, we need to understand your movie preferences.</h2>
                <h2> Provide ratings for the movies below </h2>

                  <h1 className="movieRow_heading">You might like...</h1>
                <div className="movieRow_container">
                    {this.state. genreMovies}
                </div>

                {/*<h1 className="movieRow_heading">Top Rated</h1>*/}
                {/*<div>*/}
                    {/*{this.state.hasTopRatedPrevious && <button className="btn btn-sm btn-primary"*/}
                                                               {/*onClick={this.handlePreviousTopRatedClick}>Previous</button>}*/}
                    {/*{this.state.hasTopRatedNext && <button className="nextButton btn btn-sm btn-primary"*/}
                                                           {/*onClick={this.handleNextTopRatedClick}>Next</button>}*/}
                    {/*<br/><br/>*/}
                {/*</div>*/}

                {/*<div className="movieRow_container">*/}
                    {/*{this.state.topRatedRow}*/}
                {/*</div>*/}
            {/*</div>*/}

 <button className = "btn btn-sm btn-primary" onClick={this.handleSubmit}> Next </button>
            </div>
            </div>


        );
    }
}

export default ColdStartRatings;