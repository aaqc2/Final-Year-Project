/**
 *
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserStarRating from './UserStarRating.jsx';
import AverageRating from './AverageRating.jsx';

 const MovieImages  =(props) =>(


         <div key={props.info.data.id}>
            <Link to={{pathname: "/info/"+ props.id, state : {userid: props.userid} }} className= "movielink">
                <div className ="movieTitle"> {props.info.data.title || props.info.data.name} </div>
            <img src={props.poster} alt="movieimages" className="movie_image"/>
            </Link>


             <AverageRating row={props.row}  tmdbid={props.id} userid={props.userid} key={props.userid}/>
             <UserStarRating  row={props.row}  tmdbid={props.id} userid={props.userid}/>

         </div>
      );


export default MovieImages;