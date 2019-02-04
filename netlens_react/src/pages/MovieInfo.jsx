import React, { Component } from 'react';

import StarRating from '../components/StarRating.jsx';

class MovieInfo extends Component {

    componentWillMount() {
        this.setState = {info: this.props.match.params.id};
        console.log("information:" + this.props.match.params.id);
        this.loadMovieInfo();
    }

    loadMovieInfo () {
        let apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
        let baseURL = 'https://api.themoviedb.org/3/';
        let baseImageURL = 'http://image.tmdb.org/t/p/';
        let configData = null;
        var title, release, revenue, runtime, languages, genres, tagline, overview, str, str_poster;

        let getConfig = function () {
            let url = "".concat(baseURL, 'configuration?api_key=', apiKey, '&query=The+Dark+Knight'); //change to movie_id parameter
            fetch(url)
                .then((result) => {
                    return result.json();
                })
                .then((data) => {
                    baseImageURL = data.images.secure_base_url;
                    configData = data.images;
                    console.log('config fetched');
                    loadData()
                })
                .catch(function (err) {
                    alert(err);
                });
        }

        let loadData = function () {
            let url = "".concat(baseURL, 'movie/', document.getElementsByClassName('tmdbid')[0].id, '?api_key=', apiKey);
            fetch(url)
                .then((result) => {
                    return result.json();
                })
                .then((data) => {
                    title = data.original_title;
                    console.log(title);
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
        }
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
                                                        
                                                        <StarRating tmdbid={this.props.match.params.id}/>
                                                        <b>
                                                            <p id="release" className="big"></p>

                                                            <p id="revenue" className="big"></p>

                                                            <p id="runtime" className="big"></p>

                                                            <p id="languages" className="big">Languages: </p>

                                                            <p id="movie_genres" className="big">Genres: </p>
                                                        </b><br />
                                                        <p id="movie_tagline" className="card-tagline"></p>
                                                        <p id="movie_overview" className="card-text text-justify"></p>
                                                        <a href="http://thedarkknight.warnerbros.com/dvdsite/" className="btn btn-primary">Visit Website</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comment section */}
                        <div className="container center-div" id="comment_section">
                            <div className="card col-md-10 p-3">
                                <h3>Comments<br /></h3>
                                <div className="media comment-box">
                                    <div className="media-left">
                                        <a href="/">
                                            <img className="img-responsive user-photo" src="https://ssl.gstatic.com/accounts/ui/avatar_2x.png" alt=""/>
                                        </a>
                                    </div>
                                    <div className="media-body">
                                        <h4 className="media-heading">krazycrukids</h4>
                                        <p>Im just gonna start off by saying I LOVE this movie.Its one of my favorites of all
                                            time. I
                                            honestly
                                            cant think of too much wrong with this movie other than its a little long and
                                            Batmans by now
                                            infamous voice. But everything else is top notch. The acting,story,atmosphere,and
                                            actions
                                    scenesare all amazing.</p>
                                    </div>
                                </div>
                                <div className="media comment-box">
                                    <div className="media-left">
                                        <a href="/">
                                            <img className="img-responsive user-photo" src="https://ssl.gstatic.com/accounts/ui/avatar_2x.png" alt=""/>
                                        </a>
                                    </div>
                                    <div className="media-body">
                                        <h4 className="media-heading">filmquestint</h4>
                                        <p>I couldn't believe "The Dark knight" could live up to the hype. That's perhaps the
                                            biggest
                                            surprise. The secret, I believe, is a stunning, mature, intelligent script. That
                                            makes it the
                                            best superhero movie ever made. As if that wasn't enough, Heath Ledger. He, the
                                            newest of the
                                            tragic modern icons present us with a preview of something we'll never see. A
                                            fearless,
                                            extraordinary actor capable to fill up with humanity even the most grotesque of
                                            villains. His
                                            performance is a master className. Fortunately, Christian Bale's Batman is almost a
                                            supporting
                                            character. Bale is good but there is something around his mouth that stops him from
                                            being
                                            great. "The Dark Knight" is visually stunning, powerful and moving. What else could
                                            anyone
                                    want.</p>
                                    </div>
                                </div>
                                <h4>Add a comment<br /></h4>
                                <div className="media comment-box">
                                    <div className="media-left">
                                        <a href="/">
                                            <img className="img-responsive user-photo" src="https://ssl.gstatic.com/accounts/ui/avatar_2x.png" alt=""/>
                                        </a>
                                    </div>
                                    <form>
                                        <div className="form-group">
                                            <textarea id="comment_text" name="comment_text" cols="70" rows="5" className="form-control"></textarea>
                                        </div>
                                        <div className="form-group">
                                            <button name="submit" type="submit" className="btn btn-primary">Submit comment</button>
                                        </div>
                                    </form>
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