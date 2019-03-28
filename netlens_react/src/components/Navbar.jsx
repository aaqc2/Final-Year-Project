/**
 *  Display the NavBar for every page except sign in and register page
 *  with our TheMovieOracle logo, search bar, home(link), user profile (link) and logout (link)
 */

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import SearchBar from './SearchBar.jsx';

import '../style.css';

class Navbar extends Component {

    // clear everything in the local storage
    logout() {
        localStorage.clear();
    }

    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark navbar-fixed-top">
                <div className="container d-flex flex-row align-items-center">

                    <div>
                        {/* link to landing page and redirect when clicked */}
                        <Link className="navbar-brand" to="/landingpage">TheMovieOracle</Link>
                        <h5 className="slogan">personalised movie recommendations</h5>
                    </div>


                    <div className="mx-auto my-auto d-inline w-100">
                        {/* SearchBar component */}
                        <SearchBar/>
                    </div>

                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <Link className="searchButton btn btn-sm btn-primary" to="/advancedsearch" id="advanced_search">
                        Search</Link>

                    <br/>

                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                {/* link to landing page and redirect when clicked */}
                                <Link className="nav-link" to="/landingpage">Home <span
                                    className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item">
                                {/* link to user profile page and redirect when clicked */}
                                <Link className="nav-link" to="/userprofile">Profile</Link>
                            </li>
                            <li className="nav-item">
                                {/* when logout is clicked, it calls the logout function which clear everything in
                                    local storage: token, userid, email, username and then redirect to sign in
                                    page
                                */}
                                <Link className="nav-link" to="/Signin" onClick={this.logout}>Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;


