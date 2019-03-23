import React, { Component } from "react";
import axios from '../baseUrl';
import MovieImages from '../components/MovieImages';



class ColdStartRatings extends Component {
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

    apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';

    /** Make all API calls as soon as the MovieGenreRow component mounts. */

    componentDidMount() {
        console.log('i am mounted');
        console.log(this.props.location.state);
        if(this.props.location.state.selectedValues !== undefined) {
            const {location: {state: {selectedValues}}} = this.props;
            console.log(selectedValues);
            let url = [];
            Object.keys(selectedValues).map((gen) => {
                console.log(gen, "genres");
                url.push('&gen=' + gen);
            });
            this.setState({genreApi: `http://127.0.0.1:8000/api/genres/?${url}`},this.getGenreMovies)
        }
    }



    handleSubmit = (e)  => {
        e.preventDefault();
        fetch(`http://127.0.0.1:8000/api/getCustomRec/${localStorage.getItem('id')}`)
            .then((response) => {
                return response;
            })
            .then((data) => {
                    if(data.status==200){
                        return this.props.history.push({
                            pathname: '/LandingPage',
                            // state:{selectedValues : allSelected}
                        });
                    }
                }
            )};

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

    handleNextGenreClick()
    {
        this.setState({genreApi: this.state.nextGenreApi}, this.getGenreMovies);
    }


    handlePreviousGenreClick()
    {
        this.setState({genreApi: this.state.previousGenreApi}, this.getGenreMovies);
    };

    /**
     * Send request for movies that are top rated
     */
    getTopRated = () => {
        const row = 'toprated';
        let result = [];
        fetch(this.state.topRatedApi)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                data.results.map((id) => {
                    Object.entries(id).forEach(([key, value]) => {
                        let url = '/movie/' + value + '?api_key=' + this.apiKey;
                        axios.get(url)
                            .then(res => {
                                console.log(res);
                                result.push(res);
                                const movieRows = this.getMovieRows(row, result);
                                this.setState({topRatedRow: movieRows});
                            }).catch(error => {
                            console.log(error);

                        })
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

        console.log(this.state.genreMovies);
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
                                                            onClick={this.handlePreviousGenreClick}>Previous</button>}
                    {this.state.hasGenreNext && <button className="nextButton btn btn-sm btn-primary"
                                                        onClick={this.handleNextGenreClick}>Next</button>}
                    <br/><br/>
                </div>
                <button className = "newuser-submit" onClick={this.handleSubmit}> Continue </button>
            </div>

        );
    }
}




export default ColdStartRatings;