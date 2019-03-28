
/**
*Landing page
*This page is rendered directly for registered users. For new users, this page is rendered after the first initial 2 steps.
*This is the main page, where the movie recommendations for that user is rendered.
*/



import React, { Component } from "react";
import axios from '../baseUrl'; 
import MovieImages from '../components/MovieImages';
import Navbar from "../components/Navbar";
import {checkToken} from "../components/authenticateToken";



class LandingPage extends Component {
    apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
    constructor(props) {
        super(props);
        this.state = {
            user: localStorage.getItem('id'),
            topRatedRow: [],
            recommendation: [],
            topRatedApi: `http://127.0.0.1:8000/api/toprated/?width=${window.screen.width}`,
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
        //bind the functions which handle click
        this.handlePreviousTopRatedClick = this.handlePreviousTopRatedClick.bind(this);
        this.handleNextTopRatedClick = this.handleNextTopRatedClick.bind(this);
        this.handlePreviousRecommendationClick = this.handlePreviousRecommendationClick.bind(this);
        this.handleNextRecommendationClick = this.handleNextRecommendationClick.bind(this);
    };

    /** Check user's token if it is still valid before the first render. */
    componentWillMount() {
        checkToken();
    }


    /** Make all API calls as soon as the MovieGenreRow component mounts. */
    componentDidMount() {
        this.setState({recommendationApi: `http://127.0.0.1:8000/api/recommendation/${this.state.user}?width=${window.screen.width}`}, this.getRecommendation);
        this.getTopRated();
    }

    /** Extract our movie data and pass it to our MovieGenre Component. */
    getMovieRows = (row, res) => {
        let movieRows = [];
        console.log(res);
        res.map((movie) => {
            if (movie.data.poster_path != null) {
                const movieComponent = <MovieImages
                    id={movie.data.id}
                    row={row}
                    userid={this.state.user}
                    poster={"https://image.tmdb.org/t/p/original" + movie.data.poster_path}
                    info={movie}/>;
                movieRows.push(movieComponent);
            }
        });
        return movieRows;

    };

    /**
     * Send request for movies that are top rated
     */
    getTopRated = () => {
        const row = 'toprated';
        let result = [];
        fetch(this.state.topRatedApi)
            .then(response => {
                return response.json();
            })
            .then((data) => {
                data.results.map((id) => {
                    Object.entries(id).forEach(([key, value]) => {
                        let url = '/movie/' + value + '?api_key=' + this.apiKey;
                        axios.get(url)
                            .then(res => {
                                result.push(res);
                                const movieRows = this.getMovieRows(row, result);
                                this.setState({topRatedRow: movieRows});
                            }).catch(error => {
                                console.log(error);
                            })
                    });
                });

                // check if it has next/previous pages for the results
                // and setState so that the buttons point to the next/previous page respectively
                // and ready to do api call for next/previous page when click
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
            console.log(err);
        });

    };

    /** Handle the next button on top rated movie rows when next button is clicked. */
    handleNextTopRatedClick() {
        this.setState({topRatedApi: this.state.nextTopRatedApi}, this.getTopRated);
    }

    /** Handle the previous button on top rated movie rows when previous button is clicked. */
    handlePreviousTopRatedClick() {
        this.setState({topRatedApi: this.state.previousTopRatedApi}, this.getTopRated);
    };

    /** Send request for movies that are recommended to the user. */
    getRecommendation = () => {
        const row = 'recommendation';
        let result = [];
        console.log(this.state.recommendationApi);
        fetch(this.state.recommendationApi)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                data.results.map((id) => {
                    Object.entries(id).forEach(([key, value]) => {
                        let url = '/movie/' + value + '?api_key=' + this.apiKey;
                        axios.get(url)
                            .then(res => {
                                result.push(res);
                                const movieRows = this.getMovieRows(row, result);
                                this.setState({recommendation: movieRows});
                            }).catch(error => {
                                console.log(error);
                            })
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

    /** Handle the next button on top rated movie rows when next button is clicked. */
    handleNextRecommendationClick() {
        this.setState({recommendationApi: this.state.nextRecommendationApi}, this.getRecommendation);
    }

    /** Handle the previous button on recommended movie rows when previous button is clicked. */
    handlePreviousRecommendationClick() {
        this.setState({recommendationApi: this.state.previousRecommendationApi}, this.getRecommendation);
    };


    render() {
        return (
            <div>
            { this.state &&
            <div className="movieRow">
                <Navbar/>
                <h1> Welcome {localStorage.getItem('username')} </h1>

                {/* Render the recommendation list */}
                <h1 className="movieRow_heading">Top Picks for you</h1>
                <div className="movieRow_container">
                    {this.state.recommendation}
                </div>

                 {/* Render the paginator element to render the   */}
                <div>
                    {this.state.hasRecommendationPrevious && <button className="btn btn-sm btn-primary"
                                                                     onClick={this.handlePreviousRecommendationClick}>Previous</button>}
                    {this.state.hasRecommendationNext && <button className="nextButton btn btn-sm btn-primary"
                                                                 onClick={this.handleNextRecommendationClick}>Next</button>}
                    <br/><br/>
                </div>


                   {/* Render the top rated list */}
                <h1 className="movieRow_heading">Top Rated</h1>
                <div className="movieRow_container">
                    {this.state.topRatedRow}
                </div>
                <div>
                    {/*paginator to get the previous movies */}
                    {this.state.hasTopRatedPrevious && <button className="btn btn-sm btn-primary"
                                                               onClick={this.handlePreviousTopRatedClick}>Previous</button>}

                    {/*paginator to get next set of  movies */}
                    {this.state.hasTopRatedNext && <button className="nextButton btn btn-sm btn-primary"
                                                           onClick={this.handleNextTopRatedClick}>Next</button>}
                    <br/><br/>
                </div>
                </div>
                }
            </div>


        );
    }
}

export default LandingPage;