import React, { Component } from 'react';


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.email);
    event.preventDefault();
  }

  render() {
    return (
        <div className = "wrapper">
            <div className = "login-container">
                <h2 id= "signin">Sign in</h2>
                <h4> Don't have an account? <a href="#registerpage.html">Register here</a></h4>
                <div id = "signinBox">
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
                <img src="/Users/direna/Desktop/final year/final year project/NetLens homescreen.png" alt="homescreen"/>
            </div>
        </div>

    );
  }
}


export default Login;