/**
 *  Display the poster of the movies get from TMDB for the MovieRows (in LandingPage, ColdStartRating, UserProfile
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserStarRating from './UserStarRating.jsx';
import AverageRating from './AverageRating.jsx';

 const MovieImages  =(props) =>(


         <div key={props.info.data.id}>
             {/* the movie images will link the user to movie info when clicked*/}
            <Link to={{pathname: "/info/"+ props.id, state : {userid: props.userid} }} className= "movielink">
                {/* display the title of the movie */}
                <div className ="movieTitle"> {props.info.data.title || props.info.data.name} </div>
                {/* display the poster of the movie */}
                <img src={props.poster} alt="movieimages" className="movie_image"/>
            </Link>

             {/* pass props to AverageRatingComponent and UserStarRating component in order to display
                the average rating for the movies and the rating the user rated for the movies with stars
             */}
             <AverageRating row={props.row}  tmdbid={props.id} userid={props.userid} key={props.userid}/>
             <UserStarRating  row={props.row}  tmdbid={props.id} userid={props.userid}/>

         </div>
      );


export default MovieImages;