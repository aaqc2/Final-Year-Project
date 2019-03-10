import React, { Component } from 'react';



class GenreImages extends Component {


   render() {
      return (
         <div >
             <img src={this.props.posterUrl} alt="movieimages" className="genreImages"/>
         </div>

      );
   }
}

export default GenreImages;