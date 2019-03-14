import React, { Component } from "react";
import axios from '../baseUrl'; 
import MovieImages from '../components/MovieImages';
import Navbar from "../components/Navbar";



class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topRatedRow: [],
            recommendation: [],
            genreMovies: [],
            topRatedApi: 'http://127.0.0.1:8000/api/toprated',
            hasTopRatedNext: false,
            hasTopRatedPrevious: false,
            nextTopRatedApi: '',
            prevTopRatedApi: '',
            recommendationApi: '',
            hasRecommendationNext: false,
            hasRecommendationPrevious: false,
            nextRecommendationApi: '',
            prevRecommendationApi: '',
        };
        this.handlePreviousTopRatedClick = this.handlePreviousTopRatedClick.bind(this);
        this.handleNextTopRatedClick = this.handleNextTopRatedClick.bind(this);
        this.handlePreviousRecommendationClick = this.handlePreviousRecommendationClick.bind(this);
        this.handleNextRecommendationClick = this.handleNextRecommendationClick.bind(this);
    };

    apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
    /** Hold each genre movie row in an array */

    state = {
        topRatedRow: [],
        recommendation: [],
        genreMovies: []
    }


    /** Make all API calls as soon as the MovieGenreRow component mounts. */

    componentDidMount() {
        console.log('i am mounted');
        console.log(this.props.location.state);
        this.setState({recommendationApi: `http://127.0.0.1:8000/api/recommendation/${localStorage.getItem('id')}`}, this.getRecommendation);
        this.getTopRated();
        if(this.props.state !== undefined) {
            if(this.props.location.state.selectedValues !== undefined) {
            this.getGenreMovies();
            }
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
                    //url={url}
                    poster={"https://image.tmdb.org/t/p/original" + movie.data.poster_path}
                    info={movie}/>
                movieRows.push(movieComponent);
            }
        });
        return movieRows;

    }

    //still need to implement pagination
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

    getRecommendation = () => {
        const row = 'recommendation';
        let result = [];
        let link = [];
        let count = 0;
        //console.log(this.props.location.state.user);
        //const user = this.props.location.state.user;
        const user = localStorage.getItem('id');
        // const api = `http://127.0.0.1:8000/api/recommendation/${user}`;
        console.log(this.state.recommendationApi);
        fetch(this.state.recommendationApi)
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
                                    result.push(res);
                                    if (count >= data.results.length - 1) {
                                        const movieRows = this.getMovieRows(row, result, user);
                                        this.setState({recommendation: movieRows});
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
                    this.setState({hasRecommendationNext: true, nextRecommendationApi: data.next});
                } else {
                    this.setState({hasRecommendationNext: false, nextRecommendationApi: ''});
                }
                if (data.previous !== null) {
                    this.setState({hasRecommendationPrevious: true, previousRecommendationApi: data.previous});
                } else {
                    this.setState({hasRecommendationPrevious: false, previousRecommendationApi: ''});
                }
            }).catch((err) => {
            console.log(err);
        });

    };

    handleNextRecommendationClick() {
        this.setState({recommendationApi: this.state.nextRecommendationApi}, this.getRecommendation);
    }

    handlePreviousRecommendationClick() {
        // this.state.api = this.state.previousApi;
        // this.getSearchQuery();
        this.setState({recommendationApi: this.state.previousRecommendationApi}, this.getRecommendation);
    };


    render() {

        // const {location: {state: {selectedValues}}} = this.props;
        //console.log(this.state.movies, 'movies')
        console.log(this.state.genreMovies);
        return (

            <div className="movieRow">
                <Navbar/>

                <h1> Welcome </h1>
                <h1 className="movieRow_heading">Top Picks for you</h1>
                <div>
                    {this.state.hasRecommendationPrevious && <button className="btn btn-sm btn-primary"
                                                                     onClick={this.handlePreviousRecommendationClick}>Previous</button>}
                    {this.state.hasRecommendationNext && <button className="nextButton btn btn-sm btn-primary"
                                                                 onClick={this.handleNextRecommendationClick}>Next</button>}
                    <br/><br/>
                </div>
                <div className="movieRow_container">
                    {this.state.recommendation}
                </div>
                <h1 className="movieRow_heading">Top Rated</h1>
                <div>
                    {this.state.hasTopRatedPrevious && <button className="btn btn-sm btn-primary"
                                                               onClick={this.handlePreviousTopRatedClick}>Previous</button>}
                    {this.state.hasTopRatedNext && <button className="nextButton btn btn-sm btn-primary"
                                                           onClick={this.handleNextTopRatedClick}>Next</button>}
                    <br/><br/>
                </div>

                <div className="movieRow_container">
                    {this.state.topRatedRow}
                </div>

                <h1 className="movieRow_heading">Cold Start</h1>
                <div className="movieRow_container">
                    {this.state. genreMovies}
                </div>


            </div>


        );
    }
}

export default LandingPage;