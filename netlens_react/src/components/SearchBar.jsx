import React, {Component} from 'react';
import AdvancedSearch from '../pages/AdvancedSearch';
import Autosuggest from 'react-autosuggest';
import {Redirect} from 'react-router-dom';

// List of movies to auto-suggest
// let movies = [];
// const api = 'http://127.0.0.1:8000/api';
// fetch(api)
//     .then((result) => {
//       console.log(result);
//       return result.json();
//     })
//     .then((data) => {
//       data.map((item) => {
//         movies.push({
//             title: item.title
//         })
//         //create search page
//         //when movie is searched, redirect to search page
//       });
//     })
//     .catch((err) => {
//             console.log(err);
//     });

// Calculate suggestions for any given input value
// const getSuggestions = value => {
//   const keywords = value.trim().toLowerCase();
//   const keyLength = keywords.length;
//
//   return keyLength === 0 ? [] : movies.filter(mov =>
//     mov.title.toLowerCase().slice(0, keyLength) === keywords
//   );
// };

// Populate the input based on the clicked suggestion
const getSuggestionValue = suggestion => suggestion;

// Render suggestions
const renderSuggestion = suggestion => (
    <div>
        {suggestion}
    </div>
);


class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.state = {
            value: '',
            suggestions: [],
            enter: false,
            fireRedirect: false
        };
    }

    onKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.setState({enter: true, fireRedirect: true});
        }
    };

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });
    };

    componentWillReceiveProps(nextProps) {
        this.setState({fireRedirect: false});
    }

    // Update suggestions
    onSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: []
        });
        fetch(`http://127.0.0.1:8000/api/search/?q=${value}`)
            .then(response => response.json())
            .then(data => {
                data.map((item) => {
                    this.setState(
                        prevState => ({
                            suggestions: [...prevState.suggestions, item.title]
                        }));
                    //create search page
                    //when movie is searched, redirect to search page
                });
            })
    };

    // Clear suggestions
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const {value, suggestions} = this.state;
        const {fireRedirect} = this.state;
        // Pass all props to the input.
        const inputProps = {
            placeholder: 'Search movies...',
            value,
            onChange: this.onChange,
            onKeyDown: this.onKeyDown
        };
        if (this.state.enter && fireRedirect) {
            return (
                <Redirect to={{
                    pathname: '/advancedsearch',
                    state: {value: this.state.value}
                }}/>
            )
        }

        return (
            <div>
                <Autosuggest
                    suggestions={suggestions}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                />
            </div>
        );
    }
}

export default SearchBar;

