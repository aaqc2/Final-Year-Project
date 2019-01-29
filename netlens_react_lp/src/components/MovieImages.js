import React, { Component } from 'react';
 
import StarRating from '../components/StarRating.jsx';
class MovieImages extends Component {


   render() {
      return (
         <div >
            <img src={this.props.posterUrl} alt="movieimages" className="movie_image"/>
        <StarRating/>
        {/* <StarRating tmdbid={this.props.match.params.id}/> */}
         </div>

      ); 
   }
}

export default MovieImages; 