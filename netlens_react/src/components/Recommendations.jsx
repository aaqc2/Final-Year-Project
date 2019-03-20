import React, { Component } from "react";
import axios from '../baseUrl';
import MovieImages from '../components/MovieImages';
import Navbar from "../components/Navbar";




class Recommendations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genreMovies: [],

        };

    };

    apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
    /** Hold each genre movie row in an array */

    state = {
        genreMovies: []
    }


    /** Make all API calls as soon as the MovieGenreRow component mounts. */

    componentDidMount() {
        console.log('i am mounted');
        console.log(this.props.location.state);
        if (this.props.location.state.selectedValues !== undefined) {
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
                    //url={url}
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


    render() {

        // const {location: {state: {selectedValues}}} = this.props;
        //console.log(this.state.movies, 'movies')
        console.log(this.state.genreMovies);
        return (

            <div className="movieRow">
                <Navbar/>


                <h1 className="movieRow_heading">Cold Start</h1>
                <div className="movieRow_container">
                    {this.state.genreMovies}
                </div>
            </div>


        );
    }

}
export default Recommendations;