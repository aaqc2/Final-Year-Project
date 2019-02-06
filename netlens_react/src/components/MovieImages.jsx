import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating.jsx';

class MovieImages extends Component {
   render() {
      return (
         <div >
            <Link to={"/info/"+this.props.id} className= "link">
            { this.props.info.data.title || this.props.info.data.name}
            <img src={this.props.poster} alt="movieimages" className="movie_image"/>
            </Link>
             {/*<StarRating/>*/}

         {/*<StarRating tmdbid={this.props.match.params.id}/>*/}
         </div>
      );
   }
}

export default MovieImages;