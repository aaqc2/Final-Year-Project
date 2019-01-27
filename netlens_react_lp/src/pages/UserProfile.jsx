import React, { Component } from 'react';


class UserProfile extends Component {
    render() {
        return (
            <div className="container">
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
                                    <div className="panel-heading">Email address  <i class="fas fa-envelope"></i></div>
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
                                    <br /><br />List of rated movies
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