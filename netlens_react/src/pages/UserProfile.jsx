import React, { Component } from 'react';
import MovieImages from "../components/MovieImages";
import axios from "../baseUrl";
import Navbar from "../components/Navbar";



class UserProfile extends Component {

    apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';

  /** Hold each genre movie row in an array */
  state = {
      // topRatedRow: [],
      ratedList:[]
  }

  /** Make all API calls as soon as the MovieGenreRow component mounts. */
  componentWillMount() {
    // this.getTopRated();
      this.getUserRating();
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
           info={movie} />
        movieRows.push(movieComponent);
       }
    });
   return movieRows;

  }


  /**
   * Send request for movies that are top rated
   */
  getUserRating= () => {
    let result = [];
    let link = [];
    let count = 0;
    const api = 'http://127.0.0.1:8000/api/getUser/1/';
    //const user = this.props.location.state.user;
    const user = 1;
    fetch(api)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            data.map((id) => {
                Object.entries(id).forEach(([key, value]) => {
                    let url = '/movie/' + value + '?api_key=' + this.apiKey;
                    axios.get(url)
                        .then(res => {
                            result.push(res);
                            link.push(url);
                            if(count >= data.length-1){
                                const movieRows = this.getMovieRows(result, link, user);
                                this.setState({ ratedList: movieRows });
                            }
                            count++;
                        }).catch(error => {
                            console.log(error);
                        })
                });
            })
        }).catch((err) => {
            console.log(err);
        });

  }


    render() {
        return (
            <div className="container">
                      <Navbar/>
            <br /><br /><br />
                <div className="card">
                    <div className="container user_profile">
                        <div className="row">
                            <div className="col-sm-10"><h1>username</h1></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-3">{/*left col*/}
                                <div className="text-center">
                                    <img src="http://ssl.gstatic.com/accounts/ui/avatar_2x.png" className="avatar img-circle img-thumbnail" alt="avatar" />
                                    <h5>Upload a photo</h5>
                                    <input type="file" className="text-center center-block file-upload" />
                                </div><br />
                                <div className="panel panel-default">
                                    <div className="panel-heading">Email address  <i className="fas fa-envelope"></i></div>
                                    <div className="panel-body">random_user@gmail.com</div>
                                </div>
                                <ul className="list-group">
                                    <li className="list-group-item">Activity</li>
                                    <li className="list-group-item text-right"><span className="pull-left"><strong>Movies rated</strong></span> 125</li>
                                    <li className="list-group-item text-right"><span className="pull-left"><strong>Comments</strong></span> 13</li>
                                </ul>
                                <div className="panel panel-default">
                                    <div className="panel-heading">Social Media</div>
                                    <div className="panel-body">
                                        <i className="fa fa-facebook fa-2x" /> <i className="fa fa-github fa-2x" /> <i className="fa fa-twitter fa-2x" /> <i className="fa fa-pinterest fa-2x" /> <i className="fa fa-google-plus fa-2x" />
                                    </div>
                                </div>
                            </div>{/*/col-3*/}
                            <div className="col-sm-9">
                                <ul className="nav nav-tabs">
                                    <li className="active"><a data-toggle="tab" href="#tab1">Your rated movies</a></li>
                                    <li><a data-toggle="tab" href="#tab2">Statistics 1</a></li>
                                    <li><a data-toggle="tab" href="#tab3">Statistics 2</a></li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane active" id="tab1">
                                         <div className="ratedlist-container">
                                                {this.state.ratedList}

                                            </div>


                                    </div>{/*/tab-pane*/}

                                    <div className="tab-pane" id="tab2">
                                    <br /><br />Rating statistics 1
                                    </div>{/*/tab-pane*/}

                                    <div className="tab-pane" id="tab3">
                                    <br /><br />Rating statistics 2
                                    </div>{/*/tab-pane*/}

                                </div>{/*/tab-content*/}
                            </div>{/*/col-9*/}
                        </div>{/*/row*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default UserProfile;