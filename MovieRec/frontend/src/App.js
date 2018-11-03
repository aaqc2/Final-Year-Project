import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
      NetLens: []
  };

  async componentDidMount() {
      try {
          const res = await fetch('http://127.0.0.1:8000/api/');
          const NetLens = await res.json();
          this.setState({
              NetLens
          });
      }
      catch (e) {
          console.log(e);
      }
  }
  render() {
    return (
      <div>
        {this.state.NetLens.map(item => (
          <div key={item.movieid}>
            <h1>{item.title}</h1>
            <span>{item.genres}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
