/**
 *  Display the footer at the end of each page
 */

import React, { Component } from 'react';
import '../style.css';

class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="container">
                    {/*a footer to show at the end of each page with "TheMovieOracle ©" + the current year*/}
                    <span>TheMovieOracle © {new Date().getFullYear()}</span>
                </div>
            </footer>
        );
    }
}

export default Footer;