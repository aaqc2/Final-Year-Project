/**
 *  To check the token before the user can use the webapp
 */

const checkToken = function () {
    // get the token given from the local storage and assigned it to variable token
    let token = localStorage.getItem('token');
        // do api call with the token to check if the token is still valid
        fetch('http://127.0.0.1:8000/api/check/' + token)
            .then((result) => {
                return result;
            })
            .then((data) => {
                // if the token is no longer valid / is not valid
                if (data.status !== 200) {
                    // clear everything in local storage
                    localStorage.clear();
                    // redirect to Sign in page
                    window.location.replace("../Signin");

                }
            })
};

export {checkToken};