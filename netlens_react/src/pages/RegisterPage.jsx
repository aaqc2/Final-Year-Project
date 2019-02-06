import React, { Component } from 'react';
//  import './App.css';


class RegisterPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      retypePassword: '',
      currentCity: '',
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
        <div className = "register-container"> 
            
                <h2 className = "register-text"> Register </h2>
                <h3 className = "register-text"> Create an account to get personalised movie recommendation </h3>
                <h4 className = "register-text"> Already have an account? <a href="#registerpage.html"> Sign in</a></h4>
            
                    <form id="registerForm" onSubmit={this.handleSubmit}>
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

                        <div className = "input, col-75">
                            <input type="text" placeholder="Enter your current" city name="city" onChange={this.handleChange} required/>
                        </div>
                       
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