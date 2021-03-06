/**
 *  Root component of React app
 */

import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import './style.css';
import MovieInfo from './pages/MovieInfo.jsx';
import UserProfile from './pages/UserProfile.jsx';
import AdvancedSearch from './pages/AdvancedSearch';
import LandingPage from './pages/LandingPage.jsx';
import Signin from './pages/Signin.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Footer from './components/Footer.jsx';
import ColdStartRatings from "./pages/ColdStartRatings";
import GenreSelection from "./pages/GenreSelection";

class App extends Component {
    render() {
        return (
            // all paths for page routing
            <Router>
                <div className="site">
                    <div className="site-content">
                        {/* container for site content */}
                        <Route exact path="/" component={Signin}/> {/* routes to sign in by default */}
                        <Route exact path="/Signin" component={Signin}/>
                        <Route path="/GenreSelection" component={GenreSelection}/>
                        <Route path="/ColdStartRatings" component={ColdStartRatings}/>
                        <Route path="/RegisterPage" component={RegisterPage}/>
                        <Route exact path="/LandingPage" component={LandingPage}/>
                        {/* passes movie id parameter to information page */}
                        <Route exact path="/info/:id" render={(props) => (<MovieInfo {...props} isAuthed={true}/>)}/>
                        <Route path="/userprofile" component={UserProfile}/>
                        <Route path="/advancedsearch" component={AdvancedSearch}/>
                    </div>
                    {/* display foote under site content */}
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default App;
