
/**
 * Used for the genreSelection page to get the movie posters from TMDB for the different genres
 */

import React, { Component } from 'react';


class GenreImages extends Component {


    render() {
        return (
            // Movie posters for the different genres that is pulled using TMDB
            <div >
                <img className="genreImages" src={this.props.posterUrl} alt="movieimages" />
            </div>

        );
    }
}

export default GenreImages;