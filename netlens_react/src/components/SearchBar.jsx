/**
 *  Provide Autosuggestion for search bar
 *  and redirect user to advanced search page when user pressed enter
 *  with the results of movie containing the input in movie title
 */

import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import {Redirect} from 'react-router-dom';


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
        // bind the function
        this.onKeyPress = this.onKeyPress.bind(this);
        // initiate states
        this.state = {
            value: '',
            suggestions: [],
            fireRedirect: false,
            keyword: ''
        };
    }

    onKeyPress = (event) => {
        // when enter is pressed
        if (event.key === 'Enter') {
            // set fireRedirect to true and keyword to the value(letter/word input on search bar)
            this.setState({fireRedirect: true, keyword: this.state.value});
        }
    };

    // Check the changes of input in search bar
    onChange = (event, {newValue}) => {
        // update the state to the latest changes
        this.setState({
            value: newValue
        });
    };

    componentWillReceiveProps(nextProps) {
        this.setState({fireRedirect: false});
    }

    // Update suggestions
    onSuggestionsFetchRequested = ({value}) => {
        // reset the suggestion array
        this.setState({
            suggestions: []
        });

        // api call to search function with the input given
        fetch(`http://127.0.0.1:8000/api/search/?q=${value}`)
            .then(response => response.json())
            .then(data => {
                // loop through the array of results retrieve from response
                data.results.map((item) => {
                    // update the suggestion array to all the title of movies retrieved from response
                    this.setState(
                        prevState => ({
                            suggestions: [...prevState.suggestions, item.title]
                        }));
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
            onKeyPress: this.onKeyPress
        };

        // if fireRedirect is true
        if (fireRedirect) {
            return (
                // redirect to advancedsearch page passing the input as state
                <Redirect to={{
                    pathname: '/advancedsearch',
                    state: {value: this.state.keyword}
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

