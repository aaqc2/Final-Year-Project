/**
 *  Displays information about the selected movie, allows user to input/change rating
 *  Retrieves movie information from TMDb
 */

import React, { Component } from 'react';
import Navbar from "../components/Navbar";
import UserStarRating from '../components/UserStarRating.jsx';
import AverageRating from '../components/AverageRating.jsx';
import { checkToken } from "../components/authenticateToken";

class MovieInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: localStorage.getItem('id')
        };
    }

    /** Check user's token if it is still valid
     *  and load the movie info
     * before the first render. */
    componentWillMount() {
        checkToken();
        // initialise info state to store the tmdbid of movies
        this.setState = {info: this.props.match.params.id};
        this.loadMovieInfo();
    }

    /** Retrieve the movie info by passing the tmdbid to the tmdb api.
     *  and display the movie info
     * */
    loadMovieInfo () {
        let apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
        let baseURL = 'https://api.themoviedb.org/3/';
        let baseImageURL = 'http://image.tmdb.org/t/p/';
        var title, release, revenue, runtime, languages, genres, tagline, overview, str, str_poster;

        // gets the base configuration for displaying movie posters (standard across all movies)
        let getConfig = function () {
            let url = "".concat(baseURL, 'configuration?api_key=', apiKey, '&query=The+Dark+Knight'); //change to movie_id parameter
            fetch(url)
                .then((result) => {
                    return result.json();
                })
                .then((data) => {
                    baseImageURL = data.images.secure_base_url;
                    loadData()
                })
                .catch(function (err) {
                    alert(err);
                });
        };


        /** Structure the movie api into our webpage for display with the movie details retrieve from tmdb. */
        let loadData = function () {
            let url = "".concat(baseURL, 'movie/', document.getElementsByClassName('tmdbid')[0].id, '?api_key=', apiKey);
            fetch(url)
                .then((result) => {
                    return result.json();
                })
                .then((data) => {
                    console.log(data);

                    // renders the information in specified containers
                    if(data.original_language !== "en") {
                        title = data.title + " (" + data.original_title + ")";
                    }
                    else {
                         title = data.title
                    }
                    document.getElementById('movie_title').innerHTML = title;

                    let posterurl = "".concat(baseImageURL, 'w342', data.poster_path);
                    console.log(posterurl);
                    str_poster = '<img className="w-100" src='+posterurl+' alt="" />';
                    document.getElementById('movie_poster').innerHTML = str_poster;

                    release = data.release_date;
                    document.getElementById('release').innerHTML = "Release date: "+release;
                    revenue = data.revenue;
                    document.getElementById('revenue').innerHTML = "Revenue: $"+revenue;
                    runtime = data.runtime;
                    document.getElementById('runtime').innerHTML = "Runtime: "+runtime+" minutes";
                    languages = data.spoken_languages;
                    var lanspan = document.getElementById('languages');
                    for(var i = 0; i < languages.length; i++) {
                        var obj = languages[i].name;

                        str = '<span class="badge badge-dark"><a href="#" style="color:white">'+ obj +'</a></span>   ';
                        lanspan.insertAdjacentHTML( 'beforeend', str );
                    }

                    genres = data.genres;
                    var genspan = document.getElementById('movie_genres');
                    for(i = 0; i < genres.length; i++) {
                        obj = genres[i].name;

                        str = '<span class="badge badge-dark"><a href="#" style="color:white">'+ obj +'</a></span>   ';
                        genspan.insertAdjacentHTML( 'beforeend', str );
                    }

                    tagline = data.tagline;
                    document.getElementById('movie_tagline').innerHTML = tagline;

                    overview = data.overview;
                    document.getElementById('movie_overview').innerHTML = overview;
                })
        };
        getConfig();
    }

    render() {
        return (
            <div className="container">
                <br /><br /><br />
                <div id="wrapper">
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <div className="container">
                                <Navbar />

                                {/* Movie information */}
                                <div className="container">
                                    <div className="row">
                                        <div className="card col-md-10 p-4">
                                            <div className="row">
                                                <div className="col-md-6" id="movie_poster"></div>
                                                <div className="col-md-6">
                                                    <div className="card-block">
                                                        <div className="tmdbid" id={this.props.match.params.id}> </div>
                                                        <h2 id="movie_title" className="card-title">title</h2>
                                                          {/* INPUT STAR RATING */}
                                                          <AverageRating tmdbid={this.props.match.params.id} userid={this.state.userid} />
                                                           <UserStarRating tmdbid={this.props.match.params.id} userid={this.state.userid} />
                                                        {/*<StarRating tmdbid={this.props.match.params.id} userid={this.props.location.state.userid}/>*/}
                                                        <b>
                                                            {/* INFORMATION CONTAINERS*/}
                                                            <p id="release" className="big"></p>

                                                            <p id="revenue" className="big"></p>

                                                            <p id="runtime" className="big"></p>

                                                            <p id="languages" className="big">Languages: </p>

                                                            <p id="movie_genres" className="big">Genres: </p>
                                                        </b><br />
                                                        <p id="movie_tagline" className="card-tagline"></p>
                                                        <p id="movie_overview" className="card-text text-justify"></p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

        );
    }
}
export default MovieInfo;