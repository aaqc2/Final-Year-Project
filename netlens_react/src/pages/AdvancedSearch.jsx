import React, { Component } from 'react';


class AdvancedSearch extends Component {

    handleChange() {
        var cbAction = document.getElementById("Action");
        if (cbAction.checked === true) {
            console.log(cbAction.id);
        }
        var cbComedy = document.getElementById("Comedy");
        if (cbComedy.checked === true) {
            console.log(cbComedy.id);
        }
        var cbDrama = document.getElementById("Drama");
        if (cbDrama.checked === true) {
            console.log(cbDrama.id);
        }
        var cbRomance = document.getElementById("Romance");
        if (cbRomance.checked === true) {
            console.log(cbRomance.id);
        }
        var cbThriller = document.getElementById("Thriller");
        if (cbThriller.checked === true) {
            console.log(cbThriller.id);
        }
        var cbSciFi = document.getElementById("SciFi");
        if (cbSciFi.checked === true) {
            console.log(cbSciFi.id);
        }
    }

    render() {
        return (
            <div className="container">
            <br /><br /><br />
                <div className="card advanced_search">
                    <article className="card-group-item">
                        <header className="card-header">
                            <h5 className="title">Genre</h5>
                        </header>
                        <div className="filter-content">
                            <div className="card-body">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange} id="Action" />
                                    <label className="custom-control-label" htmlFor="Action">Action</label>
                                </div> {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange} id="Comedy" />
                                    <label className="custom-control-label" htmlFor="Comedy">Comedy</label>
                                </div> {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange} id="Drama" />
                                    <label className="custom-control-label" htmlFor="Drama">Drama</label>
                                </div> {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange} id="Romance" />
                                    <label className="custom-control-label" htmlFor="Romance">Romance</label>
                                </div> {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange} id="Thriller" />
                                    <label className="custom-control-label" htmlFor="Thriller">Thriller</label>
                                </div> {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" onChange={this.handleChange} id="SciFi" />
                                    <label className="custom-control-label" htmlFor="SciFi">Sci-Fi</label>
                                </div> {/* form-check.// */}
                            </div> {/* card-body.// */}
                        </div>
                    </article> {/* card-group-item.// */}
                    <article className="card-group-item">
                        <header className="card-header">
                            <h5 className="title">Sort by</h5>
                        </header>
                        <div className="filter-content">
                            <div className="card-body">
                                <select className="form-control" id="releasedate" >
                                    <option defaultValue>Select option...</option>
                                    <option>Your ratings</option>
                                    <option>Average ratings</option>
                                    <option>Highly recommended</option>
                                    <option>Release date</option>
                                </select>
                            </div> {/* card-body.// */}
                        </div>
                    </article> {/* card-group-item.// */}

                </div>
            </div>
        );
    }
}

export default AdvancedSearch;