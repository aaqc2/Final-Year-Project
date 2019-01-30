import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating.jsx';
class MovieImages extends Component {


   render() {
      return (
         <div >
            <Link to={"/MovieInfo"} className= "link">  { this.props.movie.title || this.props.movie.name}<img src={this.props.posterUrl} alt="movieimages" className="movie_image"/></Link>
        <StarRating/>
        {/* <StarRating tmdbid={this.props.match.params.id}/> */}
         </div>

      ); 
   }
}

export default MovieImages; 