import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import '../style.css';

class AverageRating extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rating_avg: [],
        };
    }

    async componentDidMount() {
      try {
          const res = await fetch(`http://127.0.0.1:8000/api/avgrate/${this.props.tmdbid}`);
          const avg = await res.json();
          console.log(this.props);

          this.setState({
              rating_avg: avg,
          });
      }
      catch (e) {
          console.log(e);
      }
  }

  render() {
        const { rating_avg } = this.state;

        return (
            <div>
                {rating_avg.map(item => (
                    <div style={{ fontSize: 24 }}>
                        <h5>Average rating: {(item.avg_rating).toFixed(2)} </h5>
                        <StarRatingComponent
                            name="rating_avg"
                            starColor="#ffb400"
                            emptyStarColor="#ffb400"
                            value={item.avg_rating}
                            // onStarClick={this.onStarClickHalfStar.bind(this)}
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