
 /**
  *  User profile page of signed-in account which display
  *  the details of user(username and email), list of movies already rated by the user, enables modification of ratings
  *  and the number of movies the user has rated.
  **/

import React, {Component} from 'react';
import MovieImages from "../components/MovieImages";
import axios from "../baseUrl";
import Navbar from "../components/Navbar";
import { checkToken } from "../components/authenticateToken";


class UserProfile extends Component {
    apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
    constructor(props) {
        super(props);
        /** Hold rated list movie row in an array */
        this.state = {
        ratedList: [],
        userid: localStorage.getItem('id'),
        userRatedApi: '',
        hasUserRatedNext: false,
        hasUserRatedPrevious: false,
        nextUserRatedApi: '',
        prevUserRatedApi: '',
        numberOfMoviesRated: 0
        };

        //bind the functions which handle click
        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
    }


    /** Check user's token if it is still valid before the first render
     * and set the api for retrieve user rated movies to userRateApi state with callback function of getUserRating function
     * */

    componentWillMount() {
        checkToken();
        this.setState({userRatedApi:`http://127.0.0.1:8000/api/getUser/${this.state.userid}`},this.getUserRating);
    }



    /** Extract our movie data and pass it to our MovieGenre Component. */
    getMovieRows = (res, url) => {
        const results = res;
        let movieRows = [];
        results.map((movie) => {
            if (movie.data.poster_path !== null) {
                const movieComponent = <MovieImages
                    id={movie.data.id}
                    userid={this.state.userid}
                    url={url}
                    poster={"https://image.tmdb.org/t/p/original" + movie.data.poster_path}
                    info={movie}/>;
                movieRows.push(movieComponent);
            }
        });
        return movieRows;

    };


    /**
     * Send request for movies that have been rated by the user
     */
    getUserRating = () => {
        let result = [];
        let link = [];
        fetch(this.state.userRatedApi)
            .then((result) => {

                return result.json();
            })
            .then((data) => {
                data.results.map((id) => {
                    Object.entries(id).forEach(([key, value]) => {
                        let url = '/movie/' + value + '?api_key=' + this.apiKey;
                        axios.get(url)
                            .then(res => {
                                result.push(res);
                                link.push(url);
                                const movieRows = this.getMovieRows(result, link);
                                this.setState({ratedList: movieRows});
                            }).catch(error => {
                            console.log(error);
                        })
                    });
                });

                // count the number of movies user has rated
                this.setState({numberOfMoviesRated: data.count});

                // check if it has next/previous pages for the results
                // and setState so that the buttons point to the next/previous page respectively
                // and ready to do api call for next/previous page when click
                // sets state for pagination
                if (data.next !== null) {
                    this.setState({hasUserRatedNext: true, nextUserRatedApi: data.next});
                } else {
                    this.setState({hasUserRatedNext: false, nextUserRatedApi: ''});
                }
                if (data.previous !== null) {
                    this.setState({hasUserRatedPrevious: true, previousUserRatedApi: data.previous});
                } else {
                    this.setState({hasUserRatedPrevious: false, previousUserRatedApi: ''});
                }
            }).catch((err) => {
            console.log(err);
        });

    };

    /** Handle the next button on movie rows when next button is clicked. */
    handleNextClick() {
        this.setState({userRatedApi: this.state.nextUserRatedApi}, this.getUserRating);
    }

    /** Handle the previous button on top rated movie rows when previous button is clicked. */
    handlePreviousClick() {
        this.setState({userRatedApi: this.state.previousUserRatedApi}, this.getUserRating);
    }


    render() {
        return (
            <div>
            { this.state &&
            <div className="container">
                <Navbar/>
                <br/><br/><br/>
                <div className="card">
                    <div className="container user_profile">
                        <div className="row">
                            {/* DISPLAYS USERNAME */}
                            <div className="col-sm-10"><h1>{localStorage.getItem('username')}</h1></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-3">{/*left col*/}
                                <div className="text-center">
                                    {/* DISPLAYS AVATAR IMAGE */}
                                    <img src="http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
                                         className="avatar img-circle img-thumbnail" alt="avatar"/>
                                </div>
                                <br/>
                                <div className="panel panel-default">
                                    {/* USER EMAIL ADDRESS */}
                                    <div className="panel-heading">Email address <i className="fas fa-envelope"></i>
                                    </div>
                                    <div className="panel-body">{localStorage.getItem('email')}</div>
                                </div>
                                <ul className="list-group">
                                    {/* COUNT FOR RATED MOVIES */}
                                    <li className="list-group-item">Activity</li>
                                    <li className="list-group-item text-right"><span className="pull-left"><strong>Movies rated</strong></span> {this.state.numberOfMoviesRated}
                                    </li>
                                </ul>
                            </div>
                            {/*/col-3*/}
                            <div className="col-sm-9">
                                <ul className="nav nav-tabs">
                                    <li className="active"><a data-toggle="tab" href="#tab1">Your rated movies</a></li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane active" id="tab1">
                                        {/* DISPLAYS LIST OF RATED MOVIES */}
                                        <div id="Buttons">
                                                {/*paginator to get the previous movies */}
                                                {this.state.hasUserRatedPrevious && <button className="btn btn-sm btn-primary"
                                                                     onClick={this.handlePreviousClick}>Previous</button>}

                                                 {/*paginator to get next set of  movies */}
                                                {this.state.hasUserRatedNext && <button className="nextButton btn btn-sm btn-primary"
                                                                 onClick={this.handleNextClick}>Next</button>}
                                                <br/><br/>
                                        </div>
                                        <div className="ratedlist-container">
                                            {/* show the list of movies the user has rated*/}
                                            {this.state.ratedList}
                                        </div>
                                    </div>
                                </div>
                                {/*/tab-content*/}
                            </div>
                            {/*/col-9*/}
                        </div>
                        {/*/row*/}
                    </div>
                </div>
            </div>
            }
            </div>
        );
    }
}

export default UserProfile;