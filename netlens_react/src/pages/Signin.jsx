/**
  *  User sign in page
  **/

import React, {Component} from 'react';
import {Link} from 'react-router-dom';



class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            msg: '',
            numberOfMoviesRated: 0

        };

        //bind the functions which handle changes
        this.handleChange = this.handleChange.bind(this);
        //bind the functions which handle click(submit button)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /** Keep track of the changes of input on textboxes. */
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    /** handle the submit button when it was clicked. */
    handleSubmit(event) {
        event.preventDefault();
        //api call function to login with post method with submitted username and password
        fetch('http://127.0.0.1:8000/login/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': this.state.username,
                'password': this.state.password,
            },)
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                //token will be given in response
                if (data.token != null) {
                    // token, userid, username and email is stored to local storage.
                    localStorage.setItem('token', data.token['token']);
                    localStorage.setItem('id', data.userid);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('email', data.email);
                    let id = data.userid;
                    // redirect user to landing page
                    this.props.history.push({
                        pathname: '/LandingPage',
                        state: {user: id}
                    })
                } else {
                    // display error message if user fails to login and no token is given
                    this.setState({msg: data});
                }

            })
            .catch((error) => {
                console.log(error);
            });

    }

    render() {
        return (
            <div>
                <div className="wrapper">
                    <header className="header">
                        <h1>TheMovieOracle</h1>
                        <h5>personalised movie recommendations</h5>
                    </header>
                    <div className="login-container">
                        <h2 id="signin">Sign in</h2>
                        <h4> Don't have an account? <Link className="register-link" to="/RegisterPage">Register
                            now</Link></h4>
                        <div id="signinBox">
                            {/* error message to be displayed if user failed to login */}
                            {this.state.msg}
                            <form onSubmit={this.handleSubmit}>
                                <div className="input">
                                    <input type="text" placeholder="Enter username" name="username"
                                           onChange={this.handleChange} required/>
                                </div>
                                <br/>
                                <div className="input">
                                    <input type="password" placeholder="Password" name="password"
                                           onChange={this.handleChange} required/>
                                </div>
                                <br/>
                                <button type="submit" value="Submit"> Login</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="container recommend-text">
                    <h3> recommendations </h3>
                    <p> Struggle to find a movie you will enjoy? TheMovieOracle helps you find movies you will like. Simply
                        provide ratings for movies, then let TheMovieOracle recommends you movies which you will enjoy to watch
                        :)</p>
                </div>
            </div>
        );
    }
}


export default Login;