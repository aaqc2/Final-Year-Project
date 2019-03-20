import React, {Component} from 'react';
import MovieImages from "../components/MovieImages";
import axios from "../baseUrl";
import Navbar from "../components/Navbar";
import { checkToken } from "../components/authenticateToken";


class UserProfile extends Component {
    constructor(props) {
        super(props);
        /** Hold rated list movie row in an array */
        this.state = {
        ratedList: [],
        //checkToken: " "
        user: localStorage.getItem('id'),
        userRatedApi: '',
        hasUserRatedNext: false,
        hasUserRatedPrevious: false,
        nextUserRatedApi: '',
        prevUserRatedApi: '',
        numberOfMoviesRated: 0
        };

        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
    }
    apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';



    componentWillMount() {
       this.setState({userRatedApi:`http://127.0.0.1:8000/api/getUser/${this.state.user}`},this.getUserRating);
       // this.getUserRating();
    }

    check() {
        if(checkToken() == 'invalid') {
            this.props.history.push({
            pathname: '/Signin'
          })
        }
    }



    /** Extract our movie data and pass it to our MovieGenre Component. */
    getMovieRows = (res, url, user) => {
        const results = res;
        let movieRows = [];
        console.log(res);
        results.map((movie) => {
            console.log("asd");
            if (movie.data.poster_path !== null) {
                const movieComponent = <MovieImages
                    id={movie.data.id}
                    userid={user}
                    url={url}
                    poster={"https://image.tmdb.org/t/p/original" + movie.data.poster_path}
                    info={movie}/>
                movieRows.push(movieComponent);
            }
        });
        return movieRows;

    }


    /**
     * Send request for movies that have been rated by the user
     */
    getUserRating = () => {
        let result = [];
        let link = [];
        let count = 0;
        // const user = localStorage.getItem('id');
        //const user = this.props.location.state.user;
        // const api = 'http://127.0.0.1:8000/api/getUser/'+user;

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
                                if (count <= data.results.length - 1) {
                                    const movieRows = this.getMovieRows(result, link, this.state.user);
                                    this.setState({ratedList: movieRows});
                                }
                                count++;
                            }).catch(error => {
                            console.log(error);
                        })
                    });
                });
                this.setState({numberOfMoviesRated: data.count});
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

    handleNextClick() {
        this.setState({userRatedApi: this.state.nextUserRatedApi}, this.getUserRating);
    }

    handlePreviousClick() {
        this.setState({userRatedApi: this.state.previousUserRatedApi}, this.getUserRating);
    }


    render() {
         this.check();
        return (
            <div>
                {/*<span>{this.check()}</span>*/}
                {/*{this.check()}*/}
            { this.state &&
            <div className="container">
                <Navbar/>
                <br/><br/><br/>
                <div className="card">
                    <div className="container user_profile">
                        <div className="row">
                            <div className="col-sm-10"><h1>{localStorage.getItem('username')}</h1></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-3">{/*left col*/}
                                <div className="text-center">
                                    <img src="http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
                                         className="avatar img-circle img-thumbnail" alt="avatar"/>
                                    <h5>Upload a photo</h5>
                                    <input type="file" className="text-center center-block file-upload"/>
                                </div>
                                <br/>
                                <div className="panel panel-default">
                                    <div className="panel-heading">Email address <i className="fas fa-envelope"></i>
                                    </div>
                                    <div className="panel-body">{localStorage.getItem('email')}</div>
                                </div>
                                <ul className="list-group">
                                    <li className="list-group-item">Activity</li>
                                    <li className="list-group-item text-right"><span className="pull-left"><strong>Movies rated</strong></span> {this.state.numberOfMoviesRated}
                                    </li>
                                    <li className="list-group-item text-right"><span
                                        className="pull-left"><strong>Comments</strong></span> 13
                                    </li>
                                </ul>
                                <div className="panel panel-default">
                                    <div className="panel-heading">Social Media</div>
                                    <div className="panel-body">
                                        <i className="fa fa-facebook fa-2x"/> <i className="fa fa-github fa-2x"/> <i
                                        className="fa fa-twitter fa-2x"/> <i className="fa fa-pinterest fa-2x"/> <i
                                        className="fa fa-google-plus fa-2x"/>
                                    </div>
                                </div>
                            </div>
                            {/*/col-3*/}
                            <div className="col-sm-9">
                                <ul className="nav nav-tabs">
                                    <li className="active"><a data-toggle="tab" href="#tab1">Your rated movies</a></li>
                                    <li><a data-toggle="tab" href="#tab2">Statistics </a></li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane active" id="tab1">
                                        <div id="Buttons">
                                                {this.state.hasUserRatedPrevious && <button className="btn btn-sm btn-primary"
                                                                     onClick={this.handlePreviousClick}>Previous</button>}
                                                {this.state.hasUserRatedNext && <button className="nextButton btn btn-sm btn-primary"
                                                                 onClick={this.handleNextClick}>Next</button>}
                                                <br/><br/>
                                        </div>
                                        <div className="ratedlist-container">
                                            {this.state.ratedList}
                                        </div>
                                    </div>
                                    {/*/tab-pane*/}

                                    <div className="tab-pane" id="tab2">
                                        <br/><br/>Rating statistics 1
                                    </div>
                                    {/*/tab-pane*/}

                                    <div className="tab-pane" id="tab3">
                                        <br/><br/>Rating statistics 2
                                    </div>
                                    {/*/tab-pane*/}

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