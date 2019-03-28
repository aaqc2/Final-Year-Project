/**
 *  Display the side bar for advanced search page as a panel for user to filter the list of movies searched in terms
 *  of genre
 */

import React, { Component } from 'react';
import '../style.css';

class Sidebar extends Component {
    render() {
        return (
            <div className="container">
                <div id="wrapper">
                    <div id="sidebar-wrapper">
                        <ul className="sidebar-nav">
                            <div className="card rounded-0">

                                <article className="card-group-item">
                                    <header className="card-header">
                                        <h6 className="title">Genre</h6>
                                    </header>
                                    {/* checkbox for genres filter */}
                                    <div className="filter-content">
                                        <div className="card-body">
                                            <div className="custom-control custom-checkbox">
                                                <span className="float-right badge badge-light round">52</span>
                                                <input type="checkbox" className="custom-control-input" id="Check1" />
                                                {/* checkbox for Action */}
                                                <label className="custom-control-label" htmlFor="Check1">Action</label>
                                            </div>

                                            <div className="custom-control custom-checkbox">
                                                <span className="float-right badge badge-light round">132</span>
                                                {/* checkbox Comedy */}
                                                <input type="checkbox" className="custom-control-input" id="Check2" />
                                                <label className="custom-control-label" htmlFor="Check2">Comedy</label>
                                            </div>

                                            <div className="custom-control custom-checkbox">
                                                <span className="float-right badge badge-light round">17</span>
                                                {/* checkbox for Drama */}
                                                <input type="checkbox" className="custom-control-input" id="Check3" />
                                                <label className="custom-control-label" htmlFor="Check3">Drama</label>
                                            </div>

                                            <div className="custom-control custom-checkbox">
                                                <span className="float-right badge badge-light round">78</span>
                                                {/* checkbox for Romance */}
                                                <input type="checkbox" className="custom-control-input" id="Check4" />
                                                <label className="custom-control-label" htmlFor="Check4">Romance</label>
                                            </div>

                                            <div className="custom-control custom-checkbox">
                                                <span className="float-right badge badge-light round">43</span>
                                                {/* checkbox for genres Thriller */}
                                                <input type="checkbox" className="custom-control-input" id="Check5" />
                                                <label className="custom-control-label" htmlFor="Check5">Thriller</label>
                                            </div>

                                            <div className="custom-control custom-checkbox">
                                                <span className="float-right badge badge-light round">16</span>
                                                {/* checkbox for Sci-Fi */}
                                                <input type="checkbox" className="custom-control-input" id="Check6" />
                                                <label className="custom-control-label" htmlFor="Check6">Sci-Fi</label>
                                            </div>
                                        </div>
                                    </div>
                                </article>

                                <article className="card-group-item">
                                    <header className="card-header">
                                        <h6 className="title">Release date</h6>
                                    </header>
                                    <div className="filter-content">
                                        <div className="card-body">
                                            <select className="form-control" id="releasedate">
                                                <option value="" defaultValue="">Select range...</option>
                                                <option>2010 - Present</option>
                                                <option>2000 - 2010</option>
                                                <option>1990 - 2000</option>
                                                <option>1980 - 1990</option>
                                            </select>
                                        </div>
                                    </div>
                                </article>

                                <article className="card-group-item">
                                    <header className="card-header">
                                        <h6 className="title">Age rating</h6>
                                    </header>
                                    <div className="filter-content">
                                        <div className="card-body">
                                            <label className="btn btn-sm btn-danger">
                                                <input className="" type="checkbox" name="myradio" value="" />
                                                <span className="form-check-label">G</span>
                                            </label>
                                            <label className="btn btn-sm btn-danger">
                                                <input className="" type="checkbox" name="myradio" value="" />
                                                <span className="form-check-label">PG</span>
                                            </label>
                                            <label className="btn btn-sm btn-danger">
                                                <input className="" type="checkbox" name="myradio" value="" />
                                                <span className="form-check-label">PG-13</span>
                                            </label>
                                            <label className="btn btn-sm btn-danger">
                                                <input className="" type="checkbox" name="myradio" value="" />
                                                <span className="form-check-label">R</span>
                                            </label>
                                            <label className="btn btn-sm btn-danger">
                                                <input className="" type="checkbox" name="myradio" value="" />
                                                <span className="form-check-label">NC-17</span>
                                            </label>
                                        </div>
                                    </div>
                                </article>
                                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;