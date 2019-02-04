import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import MovieInfo from './pages/MovieInfo.jsx';
import UserProfile from './pages/UserProfile.jsx';
import AdvancedSearch from './pages/AdvancedSearch';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
//          <Route exact path="/:id" render={(props) => (<MovieInfo {...props} isAuthed={true} />)} />
          <Route exact path="/:id" component={MovieInfo} />
          <Route path="/userprofile" component={UserProfile}/>
          <Route path="/advancedsearch" component={AdvancedSearch}/>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
