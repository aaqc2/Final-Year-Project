/**
  *  Search page that shows the movies that the user is searching for
 *   has a panel for user to filter the genre as well as sorting the list of movies.
  **/
import React, {Component} from 'react';
import Navbar from "../components/Navbar";
import axios from "../baseUrl";
import {checkToken} from "../components/authenticateToken";


class AdvancedSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movieList: '',
            genreMovieList: '',
            hasNext: false,
            hasPrevious: false,
            hasGenreNext: false,
            hasGenrePrevious: false,
            api: '',
            nextApi: '',
            prevApi: '',
            genreApi: '',
            nextGenreApi: '',
            prevGenreApi: '',
            genrePage: false,
            selected: '',
            genre:'',
            orderby: ''
        };

        //bind the functions which handle changes
        this.handleChange = this.handleChange.bind(this);
        //bind the functions which handle click
        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handlePreviousGenreClick = this.handlePreviousGenreClick.bind(this);
        this.handleNextGenreClick = this.handleNextGenreClick.bind(this);
        //bind the functions
        this.getSearchQuery = this.getSearchQuery.bind(this);
        this.getFilter = this.getFilter.bind(this);
    }

    /** Check user's token if it is still valid before the first render. */
    componentWillMount() {
        checkToken();
    }

    /** Set the search api to the api state with getSearchQuery() as callback function
     * as soon as the the component mounts.
     * */
    componentDidMount() {
        if (this.props.location.state !== undefined) {
            this.setState({api: `http://127.0.0.1:8000/api/search/?q=${this.props.location.state.value}`}, this.getSearchQuery);

        }
    }

    /** If the there is update in props */
    componentDidUpdate(prevProps) {
        if (prevProps.location.state !== undefined) {
            if (this.props.location.state !== undefined) {
                // if previous props is different from current props
                if (this.props.location.state.value !== prevProps.location.state.value) {
                    document.getElementById('movieList').innerHTML = "";
                    // set the api state with the new(current) value the user searched
                    this.setState({api: `http://127.0.0.1:8000/api/search/?q=${this.props.location.state.value}`}, this.getSearchQuery);
                }
            }
        } else { // there is no previous props and there is current props
            if (this.props.location.state !== undefined) {
                // set the api state with the current value from current props the user searched
                this.setState({api: `http://127.0.0.1:8000/api/search/?q=${this.props.location.state.value}`}, this.getSearchQuery);
            }
        }
    }

    /** Search function that retrieve a list of movies that the user searched with letter/words. */
    getSearchQuery() {
        document.getElementById('movieList').innerHTML = "";
        document.querySelectorAll('input[type=checkbox]').forEach(checkboxes => checkboxes.checked = false); //uncheck checkbox
        this.setState({movieList: []});
        let result = [];
        fetch(this.state.api)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                data.results.map((item) => {
                    this.state.movieList.push(item);
                });

                let promises = [];
                let list = "";
                for (let i = 0; i < this.state.movieList.length; i++) {
                    let url = '/movie/' + this.state.movieList[i].links__tmdbid + '?api_key=4f65322e8d193ba9623a9e7ab5caa01e';
                    promises.push(axios.get(url));

                }
                //retrieve a list of movies(for the page)[pagination] at once
                Promise.all(promises.map(promise => promise.catch(e => e)))
                    .then(res => {
                        result.push(res);
                        res.map(res => {
                            if(res.data !== undefined) {
                                if (res.data.original_language !== "en") {
                                    list = "<tr><td><a href='/info/" + res.data.id + "'><img src='https://image.tmdb.org/t/p/w300" + res.data.poster_path + "' alt=''></a></td>" +
                                        "<td><a href='/info/" + res.data.id + "'>" + res.data.title + " (" + res.data.original_title + ")" + "</td>" +
                                        "<td style='display:none;'>" + res.data.release_date + "</td>" +
                                        "<td style='display:none;'>" + res.data.vote_average + "</td></tr>";
                                }
                                else {
                                    list = "<tr><td><a href='/info/" + res.data.id + "'><img src='https://image.tmdb.org/t/p/w300" + res.data.poster_path + "' alt=''></a></td>" +
                                        "<td><a href='/info/" + res.data.id + "'>" + res.data.original_title + "</a></td>" +
                                        "<td style='display:none;'>" + res.data.release_date + "</td>" +
                                        "<td style='display:none;'>" + res.data.vote_average + "</td></tr>";
                                }
                                document.getElementById('movieList').insertAdjacentHTML('beforeend', list);
                                list += "<tr><td><a href='/info/" + res.data.tmdbid + "'>" + res.data.title + "</a></td>" +
                                    "<td>" + res.data.title + "</td><td></td><td></td></tr>";
                            }
                        });
                    }).catch(error => {
                    console.log(error);
                    });

                // check if it has next/previous pages for the results
                // and setState so that the buttons point to the next/previous page respectively
                // and ready to do api call for next/previous page when click
                if (data.next !== null) {
                    this.setState({hasNext: true, nextApi: data.next});
                } else {
                    this.setState({hasNext: false, nextApi: ''});
                }
                if (data.previous !== null) {
                    this.setState({hasPrevious: true, previousApi: data.previous});
                } else {
                    this.setState({hasPrevious: false, previousApi: ''});
                }
            });
    }

    /** Handle the next button when next button is clicked. */
    handleNextClick() {
        this.setState({api: this.state.nextApi}, this.getSearchQuery);
    }

    /** Handle the previous button when previous button is clicked. */
    handlePreviousClick() {
        this.setState({api: this.state.previousApi}, this.getSearchQuery);
    }

    /** Handle the changes of checkbox for genre filter. */
    handleChange() {
        let selected = [];
        document.getElementById('movieList').innerHTML = "";
        var cbAction = document.getElementById("Action");
        if (cbAction.checked === true) {
            selected.push(cbAction.id);
            console.log(cbAction.id);
        }
        var cbComedy = document.getElementById("Comedy");
        if (cbComedy.checked === true) {
            selected.push(cbComedy.id);
            console.log(cbComedy.id);
        }
        var cbDrama = document.getElementById("Drama");
        if (cbDrama.checked === true) {
            selected.push(cbDrama.id);
            console.log(cbDrama.id);
        }
        var cbRomance = document.getElementById("Romance");
        if (cbRomance.checked === true) {
            selected.push(cbRomance.id);
            console.log(cbRomance.id);
        }
        var cbThriller = document.getElementById("Thriller");
        if (cbThriller.checked === true) {
            selected.push(cbThriller.id);
            console.log(cbThriller.id);
        }
        var cbSciFi = document.getElementById("Sci-Fi");
        if (cbSciFi.checked === true) {
            selected.push(cbSciFi.id);
            console.log(cbSciFi.id);
        }
        console.log(selected);
        if (this.state.movieList.length >= 1) {
            if (selected.length >= 1) {
                let genre = '';
                selected.map((movies) => {
                    genre += '&gen=' + movies;
                });
                this.setState(
                    {
                        genre: genre,
                        genrePage: true,
                        selected: selected,
                        genreApi: `http://127.0.0.1:8000/api/titleandgenre/?q=${this.props.location.state.value + this.state.genre}`
                    },
                    this.getFilter
                )

            } else {
                this.setState({genrePage: false});
                this.getSearchQuery();
            }
        }
    }

    /** Filter the list of movies with the genre filter checked by the user from the checkboxes. */
    getFilter() {
        document.getElementById('movieList').innerHTML = "";
        let result = [];
        this.setState({genreMovieList: []});
        fetch(this.state.genreApi)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                data.results.map((item) => {
                    this.state.genreMovieList.push(item);
                });

                //displays list of movies
                let promises = [];
                let list = "";
                for (let i = 0; i < this.state.genreMovieList.length; i++) {
                    let url = '/movie/' + this.state.genreMovieList[i].links__tmdbid + '?api_key=4f65322e8d193ba9623a9e7ab5caa01e';
                    promises.push(axios.get(url));

                }
                //retrieve a list of movies(for the page)[pagination] at once
                Promise.all(promises.map(promise => promise.catch(e => e)))
                    .then(res => {
                        result.push(res);
                        res.map(res => {
                            if(res.data !== undefined) {
                                if (res.data.original_language !== "en") {
                                    list = "<tr><td><a href='/info/" + res.data.id + "'><img src='https://image.tmdb.org/t/p/w300" + res.data.poster_path + "' alt=''></a></td>" +
                                        "<td><a href='/info/" + res.data.id + "'>" + res.data.title + " (" + res.data.original_title + ")" + "</td>" +
                                        "<td style='display:none;'>" + res.data.release_date + "</td>" +
                                        "<td style='display:none;'>" + res.data.vote_average + "</td></tr>";
                                }
                                else {
                                    list = "<tr><td><a href='/info/" + res.data.id + "'><img src='https://image.tmdb.org/t/p/w300" + res.data.poster_path + "' alt=''></a></td>" +
                                        "<td><a href='/info/" + res.data.id + "'>" + res.data.original_title + "</a></td>" +
                                        "<td style='display:none;'>" + res.data.release_date + "</td>" +
                                        "<td style='display:none;'>" + res.data.vote_average + "</td></tr>";
                                }
                                document.getElementById('movieList').insertAdjacentHTML('beforeend', list);
                                list += "<tr><td><a href='/info/" + res.data.tmdbid + "'>" + res.data.title + "</a></td>" +
                                    "<td>" + res.data.title + "</td><td></td><td></td></tr>";
                            }
                        });
                    }).catch(error => {
                        console.log(error);
                    });

                // check if it has next/previous pages for the results
                // and setState so that the buttons point to the next/previous page respectively
                // and ready to do api call for next/previous page when click
                if (data.next !== null) {
                    this.setState({hasGenreNext: true, nextGenreApi: data.next});
                } else {
                    this.setState({hasGenreNext: false, nextGenreApi: ''});
                }
                if (data.previous !== null) {
                    this.setState({hasGenrePrevious: true, previousGenreApi: data.previous});
                } else {
                    this.setState({hasGenrePrevious: false, previousGenreApi: ''});
                }
            })
    }

    /** Sort the movie list with different order ( alphabetical/ reverse alphabetical / descending average rating. */
    sortResults(order) {
        var results, i, rows, changing, changePosition;
        results = document.getElementById('movieList');
        console.log(results);
        changing = true;
        while (changing) {
            changing = false;
            rows = results.rows;
            for (i = 0; i < rows.length - 1; i++) {
                changePosition = false;
                //alphabetical
                if (order === 'az') {
                    document.getElementById('movieList').innerHTML = "";
                    if(this.state.genrePage) {
                        this.setState({genreApi: `http://127.0.0.1:8000/api/titleandgenre/?q=${this.props.location.state.value + this.state.genre}&orderby=title`}, this.getFilter)
                    }
                    else {
                        this.setState({api: `http://127.0.0.1:8000/api/search/?q=${this.props.location.state.value}&orderby=title`}, this.getSearchQuery)
                    }
                }
                //reverse alphabetical
                if (order === 'za') {
                    document.getElementById('movieList').innerHTML = "";
                    if(this.state.genrePage) {
                        this.setState({genreApi: `http://127.0.0.1:8000/api/titleandgenre/?q=${this.props.location.state.value + this.state.genre}&orderby=-title`}, this.getFilter)
                    }
                    else {
                        this.setState({api: `http://127.0.0.1:8000/api/search/?q=${this.props.location.state.value}&orderby=-title`}, this.getSearchQuery)
                    }
                }
                //average vote(descending)
                if (order === 'vote') {
                    document.getElementById('movieList').innerHTML = "";
                    if(this.state.genrePage) {
                        this.setState({genreApi: `http://127.0.0.1:8000/api/titleandgenre/?q=${this.props.location.state.value + this.state.genre}&orderby=-avg_rating`}, this.getFilter)
                    }
                    else {
                        this.setState({api: `http://127.0.0.1:8000/api/search/?q=${this.props.location.state.value}&orderby=-avg_rating`}, this.getSearchQuery)
                    }
                }
            }
            if (changePosition) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                changing = true;
            }
        }
    }

    /** Handle the next button when next button is clicked. */
    handleNextGenreClick() {
        this.setState({genreApi: this.state.nextGenreApi}, this.getFilter);
    }

    /** Handle the previous button when previous button is clicked. */
    handlePreviousGenreClick() {
        this.setState({genreApi: this.state.previousGenreApi}, this.getFilter);
    }

    render() {
        return (
            <div className="container">
                <Navbar/>
                <br/><br/><br/>
                <div className="card advanced_search">
                    <article className="card-group-item">
                        <header className="card-header">
                            <h5 className="title">Genre</h5>
                        </header>
                        <div className="filter-content">
                            <div className="card-body">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                           id="Action"/>
                                    <label className="custom-control-label" htmlFor="Action">Action</label>
                                </div>
                                {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                           id="Comedy"/>
                                    <label className="custom-control-label" htmlFor="Comedy">Comedy</label>
                                </div>
                                {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                           id="Drama"/>
                                    <label className="custom-control-label" htmlFor="Drama">Drama</label>
                                </div>
                                {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                           id="Romance"/>
                                    <label className="custom-control-label" htmlFor="Romance">Romance</label>
                                </div>
                                {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                           id="Thriller"/>
                                    <label className="custom-control-label" htmlFor="Thriller">Thriller</label>
                                </div>
                                {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                           id="Sci-Fi"/>
                                    <label className="custom-control-label" htmlFor="Sci-Fi">Sci-Fi</label>
                                </div>
                                {/* form-check.// */}
                            </div>
                            {/* card-body.// */}
                        </div>
                    </article>
                    {/* card-group-item.// */}
                    <article className="card-group-item">
                        <header className="card-header">
                            <h5 className="title">Sort by</h5>
                        </header>
                        <div className="filter-content">
                            <div className="card-body">
                                <button className="btn btn-sm btn-danger"
                                        onClick={() => this.sortResults('az')}>Sort A-Z
                                </button>
                                <button className="btn btn-sm btn-danger"
                                        onClick={() => this.sortResults('za')}>Sort Z-A
                                </button>
                                {/*<button className="btn btn-sm btn-danger"*/}
                                        {/*onClick={() => this.sortResults('date')}>Sort by release date*/}
                                {/*</button>*/}
                                <button className="btn btn-sm btn-danger"
                                        onClick={() => this.sortResults('vote')}>Sort by vote average
                                </button>
                            </div>
                            {/* card-body.// */}
                        </div>
                    </article>
                    {/* card-group-item.// */}
                </div>
                <div class="movieList">
                    <div id="topButtons">
                        {this.state.hasPrevious && !this.state.genrePage &&
                        <button className="btn btn-sm btn-primary" onClick={this.handlePreviousClick}>Previous</button>}
                        {this.state.hasNext && !this.state.genrePage &&
                        <button className="nextButton btn btn-sm btn-primary" onClick={this.handleNextClick}>Next</button>}
                        {this.state.hasGenrePrevious && this.state.genrePage && <button className="btn btn-sm btn-primary"
                                                                                        onClick={this.handlePreviousGenreClick}>Previous</button>}
                        {this.state.hasGenreNext && this.state.genrePage &&
                        <button className="nextButton btn btn-sm btn-primary"
                                onClick={this.handleNextGenreClick}>Next</button>}
                    </div>

                    <table id="movieList"></table>

                    <div id="bottomButtons">
                        {this.state.hasPrevious && !this.state.genrePage &&
                        <button className="btn btn-sm btn-primary" onClick={this.handlePreviousClick}>Previous</button>}
                        {this.state.hasNext && !this.state.genrePage &&
                        <button className="nextButton btn btn-sm btn-primary" onClick={this.handleNextClick}>Next</button>}
                        {this.state.hasGenrePrevious && this.state.genrePage && <button className="btn btn-sm btn-primary" onClick={this.handlePreviousGenreClick}>Previous</button>}
                        {this.state.hasGenreNext && this.state.genrePage &&
                        <button className="nextButton btn btn-sm btn-primary"
                                onClick={this.handleNextGenreClick}>Next</button>}
                    </div>
                </div>
            </div>
        );
    }
}

export default AdvancedSearch;