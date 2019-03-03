import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserStarRating from './UserStarRating.jsx';
import AverageRating from './AverageRating.jsx';

class MovieImages extends Component {
   render() {
      return (
         <div >
            <Link to={{pathname: "/info/"+ this.props.id, state : {userid: this.props.userid} }} className= "movielink">
                <div className ="movieTitle"> { this.props.info.data.title || this.props.info.data.name} </div>
            <img src={this.props.poster} alt="movieimages" className="movie_image"/>
            </Link>
             {/*<StarRating/>*/}

             <AverageRating row={this.props.row}  tmdbid={this.props.id} userid={this.props.userid}/>
             <UserStarRating  row={this.props.row}  tmdbid={this.props.id} userid={this.props.userid}/>

         {/*<StarRating tmdbid={this.props.id} userid={this.props.userid}/>*/}

         </div>
      );
   }
}

export default MovieImages;