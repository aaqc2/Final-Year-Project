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
import NewUserRatings from "./pages/NewUserRatings";
import ColdStartRatings from "./pages/ColdStartRatings";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="site">
                    <div className="site-content">
                        <Route path="/Signin" component={Signin}/>
                        <Route path="/NewUserRatings" component={NewUserRatings}/>
                        <Route path="/ColdStartRatings" component={ColdStartRatings}/>
                        <Route path="/RegisterPage" component={RegisterPage}/>
                        <Route exact path="/LandingPage" component={LandingPage}/>
                        <Route exact path="/info/:id" render={(props) => (<MovieInfo {...props} isAuthed={true}/>)}/>
                        <Route path="/userprofile" component={UserProfile}/>
                        <Route path="/advancedsearch" component={AdvancedSearch}/>
                    </div>
                    div>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default App;
