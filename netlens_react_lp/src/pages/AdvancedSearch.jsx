import React, { Component } from 'react';


class AdvancedSearch extends Component {
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
                                    <input type="checkbox" className="custom-control-input" id="Check1" />
                                    <label className="custom-control-label" htmlFor="Check1">Action</label>
                                </div> {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="Check2" />
                                    <label className="custom-control-label" htmlFor="Check2">Comedy</label>
                                </div> {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="Check3" />
                                    <label className="custom-control-label" htmlFor="Check3">Drama</label>
                                </div> {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="Check4" />
                                    <label className="custom-control-label" htmlFor="Check4">Romance</label>
                                </div> {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="Check5" />
                                    <label className="custom-control-label" htmlFor="Check5">Thriller</label>
                                </div> {/* form-check.// */}
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="Check6" />
                                    <label className="custom-control-label" htmlFor="Check6">Sci-Fi</label>
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
                                <select className="form-control" id="releasedate">
                                    <option value selected disabled>Select option...</option>
                                    <option>Your ratings</option>
                                    <option>Average ratings</option>
                                    <option>Highly recommended</option>
                                    <option>Release date</option>
                                </select>
                            </div> {/* card-body.// */}
                        </div>
                    </article> {/* card-group-item.// */}
                    <article className="card-group-item">
                        <header className="card-header">
                            <h5 className="title">Age rating</h5>
                        </header>
                        <div className="filter-content">
                            <div className="card-body">
                                <label className="btn btn-sm btn-danger">
                                    <input className type="checkbox" name="myradio" defaultValue />
                                    <span className="form-check-label">   Include adult movies</span>
                                </label>
                            </div> {/* card-body.// */}
                        </div>
                    </article> {/* card-group-item.// */}
                </div>
            </div>
        );
    }
}

export default AdvancedSearch;