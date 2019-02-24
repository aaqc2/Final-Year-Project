import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class RegisterPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
        username: '',
        email: '',
        password: '',
        retypePassword: '',

    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.username);
    event.preventDefault();
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
      if(typeof data === 'object' ) {
          let id ='';
          data.map((item) => {
            id = item.userid
            console.log(id);
          });
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
        <div className = "register-container">
             <header className="header">
                <h1>NetLens</h1>
                <h5>personalised movie recommendations</h5>
            </header>
            
                <h2 className = "register-text"> Register </h2>
                <h3 className = "register-text"> Create an account to get personalised movie recommendation </h3>
                <h4 className = "register-text"> Already have an account?  <Link className="signin-link" to="/Signin">Sign in </Link> </h4>
            
                    <form id="registerForm" onSubmit={this.handleSubmit}>
                         <div className = "input, col-75">
                            <input type="text" placeholder="Enter Username"  name="username" onChange={this.handleChange} required/>
                        </div>

                        <div className = "input,  col-75">
                            <input type="text" placeholder="Enter Email" name="email" onChange={this.handleChange} required/>
                        </div>
                        <br/>
                        <div className = "input, col-75">
                            <input type="password" placeholder="Enter a Password" name="password" onChange={this.handleChange} required/>
                        </div>
                        <br/>

                        <div className = "input, col-75">
                            <input type="password" placeholder="Retype Password" name="retypePassword" onChange={this.handleChange} required/>
                        </div>
                       
                        <br/>


                        <br/>

                        <button type="submit"value="Submit"> Register</button>
                    </form>

                    <div className = " col-75">
                        <p className = "register-text"> By registering you are agreeing to the NetLens Terms of Use and Privacy Policy </p>
                    </div>
            </div>
       


    );
  }
}


export default RegisterPage;