import React, {Component} from 'react';
import Navbar from "../components/Navbar";
import axios from "../baseUrl";
// import { TablePagination } from 'react-pagination-table';


class AdvancedSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movieList: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if(this.props.location.state !== undefined) {
            this.getSearchQuery(this.props.location.state.value);
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.location.state !== undefined) {
            if(this.props.location.state !== undefined) {
                if(this.props.location.state.value !== prevProps.location.state.value) {
                    document.getElementById('movieList').innerHTML="";
                    this.getSearchQuery(this.props.location.state.value);
                }
            }
        }
        else {
            if(this.props.location.state !== undefined) {
                this.getSearchQuery(this.props.location.state.value);
            }
        }

    }

    getSearchQuery(keyword) {
        document.getElementById('movieList').innerHTML="";
        document.querySelectorAll('input[type=checkbox]').forEach( checkboxes => checkboxes.checked = false ); //uncheck checkbox
        let api = `http://127.0.0.1:8000/api/search/?q=${keyword}`;
        this.setState({movieList: []});
        let result = [];
        fetch(api)
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                data.map((item) => {
                    // movieList.push(item);
                    this.state.movieList.push(item);
                });
                //displays list of movies
                let list = "";
                for (let i = 0; i < this.state.movieList.length; i++) {
                    // console.log(this.state.movieList[i].links__tmdbid);
                    let url = '/movie/' + this.state.movieList[i].links__tmdbid + '?api_key=4f65322e8d193ba9623a9e7ab5caa01e';
                    axios.get(url)
                        .then(res => {
                            result.push(res);
                            list = "<tr><td><a href='/info/" + res.data.id + "'><img src='https://image.tmdb.org/t/p/w300" + res.data.poster_path + "' alt=''></a></td></tr>";
                            console.log(list);
                            document.getElementById('movieList').insertAdjacentHTML('beforeend', list);
                        }).catch(error => {
                            console.log(error);
                        })
                    list += "<tr><td><a href='/info/" + this.state.movieList[i].links__tmdbid + "'>" + this.state.movieList[i].title + "</a></td></tr>";

                }
            })
    }

    handleChange() {
        let selected = [];
        document.getElementById('movieList').innerHTML="";
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

        if(this.state.movieList.length >= 1) {
            let chosen = [];
            let result = [];
            if(selected.length >= 1) {
                this.state.movieList.map((movies) => {
                    selected.map((genres) => {
                        if(movies.genre.includes(genres)) {
                            if(!chosen.some(existed => existed.links__tmdbid === movies.links__tmdbid)) { //to prevent movies to be added more than once
                                chosen.push(movies);
                            }
                        }
                    });
                });
            }
            else {
                chosen = this.state.movieList;
            }

            let list = "";
            chosen.map((chose) => {
                let url = '/movie/' + chose.links__tmdbid + '?api_key=4f65322e8d193ba9623a9e7ab5caa01e';
                axios.get(url)
                    .then(res => {
                        result.push(res);
                        list = "<tr><td><a href='/info/" + res.data.id + "'><img src='https://image.tmdb.org/t/p/w300" + res.data.poster_path + "' alt=''></a></td></tr>";
                        console.log(list);
                        document.getElementById('movieList').insertAdjacentHTML('beforeend', list);
                    }).catch(error => {
                        console.log(error);
                    })
                list += "<tr><td><a href='/info/" + chose.links__tmdbid + "'>" + chose.title + "</a></td></tr>";
            });
        }
        else {
            let url = [];
            selected.map((movies) => {
                url.push('&gen=' + movies);
            });

            let api = 'http://127.0.0.1:8000/api/genres/?' + url;
            let movieList = [];
            fetch(api)
                .then((result) => {
                    return result.json();
                })
                .then((data) => {
                    data.map((item) => {
                        movieList.push(item);
                    });
                    //displays list of movies
                    var list = "";
                    for (var i = 0; i < movieList.length; i++) {
                        list += "<tr><td><a href='/info/" + movieList[i].movieid + "'>" + movieList[i].title + "</a></td></tr>";
                    }
                    document.getElementById('movieList').innerHTML = list;
                })
        }

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
                    <table id="movieList"></table>
                </div>
            </div>
        );
    }
}

export default AdvancedSearch;