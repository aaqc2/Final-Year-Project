/**
  *  New user registration page
  **/

import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class RegisterPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
         msg:''
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
  handleSubmit (event) {
    const { password, confirmPassword } = this.state;
    // perform all neccassary validations

    //check if the password provided is the same as the confirmation password
    if (password !== confirmPassword) {
        //display error message if it is different
        alert("Passwords do not match");
    } else {
        event.preventDefault();
        // api call to register user with username, email and password send with post method
        fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'username': this.state.username,
            'email': this.state.email,
            'password': this.state.password,
        },)
    })
      .then((response) => {
        return response.json();
    })
    .then((data) => {
      console.log(data);
         //if the token is provided (token is given in response)
        if(data.token != null ) {
          //saves token and userid, username and email to local storage.
          localStorage.setItem('token', data.token['token']);
          localStorage.setItem('id', data.userid);
          localStorage.setItem('username', data.username);
          localStorage.setItem('email', data.email);
          let id = data.userid;
          // redirect user tp GenreSelection page to select their favourite movie genres
          this.props.history.push({
            pathname: '/GenreSelection',
            state: {user: id}
          })
      }
      else {
          //error message if no valid token is given
          this.setState({msg: data});
      }

    })
    .catch((error) => {
        console.error(error);
    });
    }
  }

  render(){
    return (
        <div className = "register-container">
             <header className="header">
                <h1>TheMovieOracle</h1>
                <h5>personalised movie recommendations</h5>
            </header>

                <h2 className = "register-text"> Register </h2>
                <h3 className = "register-text"> Create an account to get personalised movie recommendation </h3>
                <h4 className = "register-text">   {this.state.msg}  <br/> <br/> Already have an account?  <Link className="signin-link" to="/Signin">Sign in </Link> </h4>

                    <form id="registerForm" onSubmit={this.handleSubmit}>
                         <div className = "input, col-75">
                            <input type="text" placeholder="Enter Username"  name="username" onChange={this.handleChange} required/>
                        </div>

                        <div className = "input,  col-75">
                            <input type="email"  placeholder="Enter Email" name="email" onChange={this.handleChange} required/>
                        </div>
                        <br/>
                        <div className = "input, col-75">
                            <input type="password" placeholder="Enter a Password" name="password" onChange={this.handleChange} required/>
                        </div>
                        <br/>

                        <div className = "input, col-75">
                            <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={this.handleChange} required/>
                        </div>
                        <br/><br/>
                         <div className = "col-75">
                        <p className = "register-text"> By registering you are agreeing to the NetLens Terms of Use and Privacy Policy </p>
                    </div>

                        <button type="submit"value="Submit"> Register</button>

                    </form>

            </div>

    );
  }
}
export default RegisterPage;