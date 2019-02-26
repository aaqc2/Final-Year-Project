import React, { Component } from 'react';
import '../style.css';

class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="container">
                    <span>TheMovieOracle © {new Date().getFullYear()}</span>
                </div>
            </footer>
        );
    }
}

export default Footer;