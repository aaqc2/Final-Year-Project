import React, { Component } from 'react';
 

class MovieImages extends Component {


   render() {
      return (
         <div >
            <img src={this.props.posterUrl} alt="movieimages" className="movie_image"/>
         </div>

      ); 
   }
}

export default MovieImages; 