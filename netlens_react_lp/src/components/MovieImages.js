import React, { Component } from 'react';
 
import StarRating from '../components/StarRating.jsx';
class MovieImages extends Component {


   render() {
      return (
         <div >
            <img src={this.props.posterUrl} alt="movieimages" className="movie_image"/>
        <StarRating/>
         </div>

      ); 
   }
}

export default MovieImages; 