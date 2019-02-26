import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

// List of movies to auto-suggest
let movies = [];
const api = 'http://127.0.0.1:8000/api';
fetch(api)
    .then((result) => {
      console.log(result);
      return result.json();
    })
    .then((data) => {
      data.map((item) => {
        movies.push({
            title: item.title
        })
        //create search page
        //when movie is searched, redirect to search page
      });
    })
    .catch((err) => {
            console.log(err);
    });

// Calculate suggestions for any given input value
const getSuggestions = value => {
  const keywords = value.trim().toLowerCase();
  const keyLength = keywords.length;

  return keyLength === 0 ? [] : movies.filter(mov =>
    mov.title.toLowerCase().slice(0, keyLength) === keywords
  );
};

// Populate the input based on the clicked suggestion
const getSuggestionValue = suggestion => suggestion.title;

// Render suggestions
const renderSuggestion = suggestion => (
  <div>
    {suggestion.title}
  </div>
);


class SearchBar extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Update suggestions
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Clear suggestions
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Pass all props to the input.
    const inputProps = {
      placeholder: 'Search movies...',
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
      />
    );
  }
}

export default SearchBar;

