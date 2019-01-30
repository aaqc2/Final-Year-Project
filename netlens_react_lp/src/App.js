import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './style.css';

import Navbar from './components/Navbar.jsx';
import MovieInfo from './pages/MovieInfo.jsx';
import UserProfile from './pages/UserProfile.jsx';
import AdvancedSearch from './pages/AdvancedSearch';
import LandingPage from './pages/LandingPage.js';
import Footer from './components/Footer.jsx';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path="/LandingPage" component={LandingPage}/>
           <Route path="/MovieInfo" component={MovieInfo}/> 
          <Route path="/userprofile" component={UserProfile}/>
          <Route path="/advancedsearch" component={AdvancedSearch}/>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
