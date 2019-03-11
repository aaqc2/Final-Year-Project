import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import  { Redirect } from 'react-router-dom'
// import homescreen from '../images/homescreen.png';
import Authentication from '../components/Authentication.jsx';


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      msg: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.Auth = new Authentication();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.email);
    event.preventDefault();
    fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({
            'email': this.state.email,
            'password': this.state.password,
        },)
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
      console.log(data);
      if(data.token != null ) {

          //saves token and id to local storage.
          localStorage.setItem('token', data.token['token'])
          localStorage.setItem('id', data.userid)
          localStorage.setItem('username', data.username)
          localStorage.setItem('email', data.email)
          let id = data.userid;

          this.props.history.push({
            pathname: '/LandingPage',
            state: {user: id}
          })
      }
      else {
          this.setState({msg: data});
      }

    })
    .catch((error) => {
        console.error(error);
    });

  }

  render() {
    return (
        <div className = "wrapper">
            <header className="header">
                <h1>TheMovieOracle</h1>
                <h5>personalised movie recommendations</h5>
            </header>
            <div className = "login-container">
                <h2 id= "signin">Sign in</h2>
                <h4> Don't have an account?  <Link className="register-link" to="/RegisterPage">Register now</Link></h4>
                <div id = "signinBox">
                    {this.state.msg}
                    <form onSubmit={this.handleSubmit}>
                        <div className = "input">
                            <input type="text" placeholder="Enter Email" name="email" onChange={this.handleChange} required/>
                        </div>
                        <br/>
                        <div className = "input">
                            <input type="password" placeholder="Password" name="password" onChange={this.handleChange} required/>
                        </div>
                        <br/>
                        <button type="submit"value="Submit"> Login </button>
                    </form>
                </div>
            </div>

            <div className ="col-md-12">
                <h3> recommendations </h3>
                <p> Struggle to find a movie you will enjoy? NetLens helps you find movies you will like. Simply provide ratings for movies,  then NetLens recommends you movies which you will enjoy to watch :)</p>
                {/* <img src={homescreen} alt="homescreen"/> */}
            </div>
        </div>

    );
  }
}


export default Login;