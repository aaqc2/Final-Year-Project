import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import '../style.css';

class StarRating extends Component {
    constructor() {
        super();

        this.state = {
            rating_avg: [],
            rating_user: 0,
        };
    }

    async componentDidMount() {
      try {
          const res = await fetch(`http://127.0.0.1:8000/api/avgrate/${this.props.tmdbid}`);
          const avg = await res.json();
          this.setState({
              rating_avg: avg
          });
      }
      catch (e) {
          console.log(e);
      }
  }

    onStarClick(nextValue, prevValue, name) {
        this.setState({ rating_user: nextValue });
    }

    onStarClickHalfStar(nextValue, prevValue, name, e) {
        const xPos = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;

        if (xPos <= 0.5) {
            nextValue -= 0.5;
        }

        console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
        // console.log(e);
        this.setState({ rating_user: nextValue });
    }

    render() {
        const { rating_avg } = this.state;
        const { rating_user } = this.state;
        return (
            <div>
                {rating_avg.map(item => (
                    <div style={{ fontSize: 24 }}>
                        <h5>Average rating: {item.avg_rating} </h5>
                        <StarRatingComponent
                            name="rating_avg"
                            starColor="#ffb400"
                            emptyStarColor="#ffb400"
                            value={item.avg_rating}
                            onStarClick={this.onStarClickHalfStar.bind(this)}
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
                <h5>Your rating: {rating_user}</h5>
                <div style={{ fontSize: 24 }}>
                    <StarRatingComponent
                        name="rating_user"
                        starColor="#ffb400"
                        emptyStarColor="#ffb400"
                        value={this.state.rating_user}
                        onStarClick={this.onStarClickHalfStar.bind(this)}
                        editing={true}
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
            </div>
        );
    }
}

export default StarRating;