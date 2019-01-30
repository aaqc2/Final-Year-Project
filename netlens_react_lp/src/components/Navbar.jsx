import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../style.css';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark navbar-fixed-top">
                <div className="container">
                    <Link className="navbar-brand" to="/">NetLens</Link>
                      <h5 className="slogan"> personalised movie recommendations</h5> 

                    <form className="mx-auto my-auto d-inline w-100">
                        <div className="search-container">
                            <input type="text" className="form-control form-control-sm border border-right-0" placeholder="Search movies..." />
                        </div>
                    </form>
                    <Link className="btn btn-sm btn-primary" to="/advancedsearch" id="advanced_search">Advanced search</Link>
                    
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/LandingPage">Home <span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/userprofile">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;