import React, { Component } from 'react';



class GenreImages extends Component {


   render() {
      return (
         <div >
             <img className="genreImages" src={this.props.posterUrl} alt="movieimages" />
         </div>

      );
   }
}

export default GenreImages;