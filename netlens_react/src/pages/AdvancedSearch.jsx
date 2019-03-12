import React, {Component} from 'react';
import Navbar from "../components/Navbar";
import axios from "../baseUrl";

// import { TablePagination } from 'react-pagination-table';


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
            selected: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handlePreviousGenreClick = this.handlePreviousGenreClick.bind(this);
        this.handleNextGenreClick = this.handleNextGenreClick.bind(this);
        this.getSearchQuery = this.getSearchQuery.bind(this);
        this.getFilter = this.getFilter.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state !== undefined) {
            this.setState({api: `http://127.0.0.1:8000/api/search/?q=${this.props.location.state.value}`}, this.getSearchQuery);

        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.state !== undefined) {
            if (this.props.location.state !== undefined) {
                if (this.props.location.state.value !== prevProps.location.state.value) {
                    document.getElementById('movieList').innerHTML = "";
                    this.setState({api: `http://127.0.0.1:8000/api/search/?q=${this.props.location.state.value}`}, this.getSearchQuery);
                }
            }
        } else {
            if (this.props.location.state !== undefined) {
                this.setState({api: `http://127.0.0.1:8000/api/search/?q=${this.props.location.state.value}`}, this.getSearchQuery);
            }
        }
    }

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
                //displays list of movies
                let list = "";
                for (let i = 0; i < this.state.movieList.length; i++) {
                    let url = '/movie/' + this.state.movieList[i].links__tmdbid + '?api_key=4f65322e8d193ba9623a9e7ab5caa01e';
                    axios.get(url)
                        .then(res => {
                            result.push(res);
                            list = "<tr><td><a href='/info/" + res.data.id + "'><img src='https://image.tmdb.org/t/p/w300" + res.data.poster_path + "' alt=''></a></td>" +
                                "<td>" + res.data.original_title + "</td>" +
                                "<td style='display:none;'>" + res.data.release_date + "</td>" +
                                "<td style='display:none;'>" + res.data.vote_average + "</td></tr>";
                            // console.log(list);
                            document.getElementById('movieList').insertAdjacentHTML('beforeend', list);
                        }).catch(error => {
                        console.log(error);
                    })
                    list += "<tr><td><a href='/info/" + this.state.movieList[i].links__tmdbid + "'>" + this.state.movieList[i].title + "</a></td>" +
                        "<td>" + this.state.movieList[i].title + "</td><td></td><td></td></tr>";

                }
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

    handleNextClick() {
        this.setState({api: this.state.nextApi}, this.getSearchQuery);
    }

    handlePreviousClick() {
        // this.state.api = this.state.previousApi;
        // this.getSearchQuery();
        this.setState({api: this.state.previousApi}, this.getSearchQuery);
    }


    handleChange() {
        let selected = [];
        // this.setState({selected: []});
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
            let chosen = [];
            // let result = [];
            if (selected.length >= 1) {
                let genre = '';
                selected.map((movies) => {
                    genre += '&gen=' + movies;
                });
                this.setState(
                    {
                        genrePage: true,
                        selected: selected,
                        genreApi: `http://127.0.0.1:8000/api/titleandgenre/?q=${this.props.location.state.value + genre}`
                    },
                    this.getFilter
                )
                // this.getFilter(this.state.selected);

            } else {
                this.setState({genrePage: false});
                // chosen = this.state.movieList;
                this.getSearchQuery();
            }

            // let list = "";
            // chosen.map((chose) => {
            //     let url = '/movie/' + chose.links__tmdbid + '?api_key=4f65322e8d193ba9623a9e7ab5caa01e';
            //     axios.get(url)
            //         .then(res => {
            //             result.push(res);
            //             list = "<tr><td><a href='/info/" + res.data.id + "'><img src='https://image.tmdb.org/t/p/w300" + res.data.poster_path + "' alt=''></a></td></tr>";
            //             console.log(list);
            //             document.getElementById('movieList').insertAdjacentHTML('beforeend', list);
            //         }).catch(error => {
            //             console.log(error);
            //         })
            //     list += "<tr><td><a href='/info/" + chose.links__tmdbid + "'>" + chose.title + "</a></td></tr>";
            // });
        }
        // else {
        //     let url = [];
        //     selected.map((movies) => {
        //         url.push('&gen=' + movies);
        //     });
        //
        //     let api = 'http://127.0.0.1:8000/api/genres/?' + url;
        //     let movieList = [];
        //     fetch(api)
        //         .then((result) => {
        //             return result.json();
        //         })
        //         .then((data) => {
        //             data.map((item) => {
        //                 movieList.push(item);
        //             });
        //             //displays list of movies
        //             var list = "";
        //             for (var i = 0; i < movieList.length; i++) {
        //                 list += "<tr><td><a href='/info/" + movieList[i].movieid + "'>" + movieList[i].title + "</a></td></tr>";
        //             }
        //             document.getElementById('movieList').innerHTML = list;
        //         })
        // }

    }

    getFilter() {
        document.getElementById('movieList').innerHTML = "";
        let result = [];
        // let genre = [];
        // this.state.selected.map((movies) => {
        //     genre.push('&gen=' + movies);
        // });
        // this.setState({genreApi: `http://127.0.0.1:8000/api/titleandgenre/?q=${this.props.location.state.value + genre}`});
        // let api = `http://127.0.0.1:8000/api/titleandgenre/?q=${this.props.location.state.value + genre}`;
        this.setState({genreMovieList: []})
        fetch(this.state.genreApi)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                data.results.map((item) => {
                    this.state.genreMovieList.push(item);
                });
                console.log(this.state.genreApi)
                let list = "";
                for (let i = 0; i < this.state.genreMovieList.length; i++) {
                    let url = '/movie/' + this.state.genreMovieList[i].links__tmdbid + '?api_key=4f65322e8d193ba9623a9e7ab5caa01e';
                    axios.get(url)
                        .then(res => {
                            result.push(res);
                            list = "<tr><td><a href='/info/" + res.data.id + "'><img src='https://image.tmdb.org/t/p/w300" + res.data.poster_path + "' alt=''></a></td>" +
                                "<td>" + res.data.original_title + "</td>" +
                                "<td style='display:none;'>" + res.data.release_date + "</td>" +
                                "<td style='display:none;'>" + res.data.vote_average + "</td></tr>";
                            // console.log(list);
                            document.getElementById('movieList').insertAdjacentHTML('beforeend', list);
                        }).catch(error => {
                        console.log(error);
                    })
                    list += "<tr><td><a href='/info/" + this.state.genreMovieList[i].links__tmdbid + "'>" + this.state.genreMovieList[i].title + "</a></td>" +
                        "<td>" + this.state.movieList[i].title + "</td><td></td><td></td></tr>";

                }
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

    sortResults(order) {
        var results, i, rows, changing, a, b, changePosition;
        results = document.getElementById('movieList');
        console.log(results);
        changing = true;
        while (changing) {
            changing = false;
            rows = results.rows;
            for (i = 0; i < rows.length - 1; i++) {
                changePosition = false;
                if (order === 'az') {
                    a = rows[i].getElementsByTagName("td")[1];
                    b = rows[i + 1].getElementsByTagName("td")[1];
                    if (a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase()) {
                        changePosition = true;
                        break;
                    }
                }
                if (order === 'za') {
                    a = rows[i].getElementsByTagName("td")[1];
                    b = rows[i + 1].getElementsByTagName("td")[1];
                    if (a.innerHTML.toLowerCase() < b.innerHTML.toLowerCase()) {
                        changePosition = true;
                        break;
                    }
                }
                if (order === 'date') {
                    a = rows[i].getElementsByTagName("td")[2];
                    b = rows[i + 1].getElementsByTagName("td")[2];
                    if (a.innerHTML.toLowerCase() < b.innerHTML.toLowerCase()) {
                        changePosition = true;
                        break;
                    }
                }
                if (order === 'vote') {
                    a = rows[i].getElementsByTagName("td")[3];
                    b = rows[i + 1].getElementsByTagName("td")[3];
                    if (a.innerHTML.toLowerCase() < b.innerHTML.toLowerCase()) {
                        changePosition = true;
                        break;
                    }
                }
            }
            if (changePosition) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                changing = true;
            }
        }
    }

    handleNextGenreClick() {
        this.setState({genreApi: this.state.nextGenreApi}, this.getFilter);
    }

    handlePreviousGenreClick() {
        // this.state.api = this.state.previousApi;
        // this.getSearchQuery();
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
                                <button className="sortAZ btn btn-sm btn-danger"
                                        onClick={() => this.sortResults('az')}>Sort A-Z
                                </button>
                                <button className="sortAZ btn btn-sm btn-danger"
                                        onClick={() => this.sortResults('za')}>Sort Z-A
                                </button>
                                <button className="sortAZ btn btn-sm btn-danger"
                                        onClick={() => this.sortResults('date')}>Sort by release date
                                </button>
                                <button className="sortAZ btn btn-sm btn-danger"
                                        onClick={() => this.sortResults('vote')}>Sort by vote average
                                </button>
                                <select className="form-control" id="releasedate">
                                    <option defaultValue>Select option...</option>
                                    <option>Your ratings</option>
                                    <option>Average ratings</option>
                                    <option>Highly recommended</option>
                                    <option>Release date</option>
                                </select>
                            </div>
                            {/* card-body.// */}
                        </div>
                    </article>
                    {/* card-group-item.// */}
                </div>
                <div class="movieList">
                    {this.state.hasPrevious && !this.state.genrePage &&
                    <button className="btn btn-sm btn-primary" onClick={this.handlePreviousClick}>Previous</button>}
                    {this.state.hasNext && !this.state.genrePage &&
                    <button className="nextButton btn btn-sm btn-primary" onClick={this.handleNextClick}>Next</button>}
                    {this.state.hasGenrePrevious && this.state.genrePage && <button className="btn btn-sm btn-primary"
                                                                                    onClick={this.handlePreviousGenreClick}>Previous</button>}
                    {this.state.hasGenreNext && this.state.genrePage &&
                    <button className="btn btn-sm btn-primary" className="nextButton"
                            onClick={this.handleNextGenreClick}>Next</button>}
                    <table id="movieList"></table>
                </div>
            </div>
        );
    }
}

export default AdvancedSearch;