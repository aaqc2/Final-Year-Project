import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navbar from "../components/Navbar";


class NewUserRatings extends Component {

    state = {
        checked:[],
}

onChange = checkedValues => {
        this.seState(() => {
            return { checked: checkedValues };
        });

};

    isDisabled = id => {
        return (this.state.checked.length > 1 && this.state.checked.indexOf(id) === -1  );
    };



  handleChange() {
        let selected = [];
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
        var cbSciFi = document.getElementById("SciFi");
        if (cbSciFi.checked === true) {
            selected.push(cbSciFi.id);
            console.log(cbSciFi.id);
        }


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

    render() {
        return (
            <div className="newuserrating-container">
                <Navbar/>
                <br/><br/><br/>
                <div className="card-newuserrating">
                        <header className="card-header">
                            <h5 className="title">Genre</h5>
                        </header>
                        <div className="filter-genres">
                            <div className="card-body">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.onChange}
                                           id="Action"/>
                                    <label className="custom-control-label" htmlFor="Action">Action</label>
                                </div>
                                {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.onChange}
                                           id="Comedy"/>
                                    <label className="custom-control-label" htmlFor="Comedy">Comedy</label>
                                </div>
                                {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.onChange}
                                           id="Drama"/>
                                    <label className="custom-control-label" htmlFor="Drama">Drama</label>
                                </div>
                                {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.onChange}
                                           id="Romance"/>
                                    <label className="custom-control-label" htmlFor="Romance">Romance</label>
                                </div>
                                {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input"  onChange={this.onChange}
                                           id="Thriller"/>
                                    <label className="custom-control-label" htmlFor="Thriller">Thriller</label>
                                </div>
                                {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange}
                                           id="SciFi"/>
                                    <label className="custom-control-label" htmlFor="SciFi">Sci-Fi</label>
                                </div>
                                {/* form-check.// */}
                            </div>
                            {/* card-body.// */}
                        </div>

                    {/* card-group-item.// */}

                <div class="movieList">
                    <table id="movieList"></table>
                </div>
            </div>
            </div>
        );
    }
}

export default NewUserRatings;