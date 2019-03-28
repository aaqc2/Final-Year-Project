/**
 *  Display average rating of the movies
 */

import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import '../style.css';

class AverageRating extends Component {
    constructor(props) {
        super(props);

        //initiate rating_avg state as empty array
        this.state = {
            rating_avg: [],
        };
    }

    //if the component is mounted and ready to use
    async componentDidMount() {
      try {
          //api call to retrieve average rating of the movie with tmdbid
          const res = await fetch(`http://127.0.0.1:8000/api/avgrate/${this.props.tmdbid}`);
          // get the response in json format
          const avg = await res.json();

          // set the rating_avg state to the response received (average rating of the movie in object type)
          this.setState({
              rating_avg: avg,
          });
      }
      catch (e) {
          console.log(e);
      }
  }

  render() {
        // get the rating_avg state of the current movie
        const { rating_avg } = this.state;

        return (
            <div>
                {/* loop through the array of object*/}
                {rating_avg.map(item => (
                    <div style={{ fontSize: 24 }}>
                        {/* display the average rating of the current movie with 2 decimal places */}
                        <h5>Average rating: {(item.avg_rating).toFixed(2)} </h5>
                        {/* pass the current average rating of the current movie to StarRatingComponent
                            and the css of the "Stars" and whole number to renderStarIcon to display
                            number of filled full star based on the whole number
                            and pass decimals to renderStarIconHalf to display half filled star
                        */}
                        <StarRatingComponent
                            name="rating_avg"
                            starColor="#ffb400"
                            emptyStarColor="#ffb400"
                            value={item.avg_rating}
                            editing={false}
                            renderStarIcon={(index, value) => {
                                return (
                                    <span>
                                    <i className={index <= value ? 'fas fa-star' : 'far fa-star'} />
                                </span>
                                );
                            }}
                            renderStarIconHalf={() => {
                                return (
                                    <span>
                                    <span style={{ position: 'absolute' }}><i className="far fa-star" /></span>
                                    <span><i className="fas fa-star-half" /></span>
                                </span>
                                );
                            }} />
                    </div>
                ))}
            </div>
        );
    }
}

export default AverageRating;