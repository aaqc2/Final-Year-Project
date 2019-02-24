import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating.jsx';

class MovieImages extends Component {
   render() {
      return (
         <div >
            <Link to={"/info/"+ this.props.id} className= "movielink">
                <div className ="movieTitle"> { this.props.info.data.title || this.props.info.data.name} </div>
            <img src={this.props.poster} alt="movieimages" className="movie_image"/>
            </Link>
             {/*<StarRating/>*/}
         <StarRating tmdbid={this.props.id} userid={this.props.userid}/>

         </div>
      );
   }
}

export default MovieImages;