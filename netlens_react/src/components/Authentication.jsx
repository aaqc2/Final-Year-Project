/**
 * NOT USED
 */
import decode from 'jwt-decode';

class Authentication{
    constructor(domain) {
        this.domain = 'http://127.0.0.1:8000/'
        this.fetch = this.fetch.bind(this)


        this.login= this.login.bind(this)
        this.getLandingPage = this.getLandingPage.bind(this)

    }


    login(username, password) {
        return this.fetch('${this.domain}/login', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })

        }).then(res => {
            this.setToken(res.token) // set the token
            return Promise.resolve(res);

        })

    }
        //this.signin = this.signin.bind(this)


//check if there is a saved token and if its valid
//need to change so it calls api token checker, not checked on the front end
signedIn() {
        const token = this.getToken()
        return !!token && !this.isTokenExpired(token)
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else
                return false;
        } catch (err) {
            return false;
        }
    }

         // Saves user token to localStorage
setToken(idToken) {

        localStorage.setItem('id_token', idToken)
    console.log(idToken);
    }

      // Retrieves the user token from localStorage

    getToken() {

        return localStorage.getItem('id_token')
    }


      // Clear user token and profile data from localStorage
    logout() {

        localStorage.removeItem('id_token');
    }

 getLandingPage() {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }

    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        if (this.signedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _classStatus(response){
        if(response.status >=200 && response <300)
            return response
        else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }

}


export default Authentication;