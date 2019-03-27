
const checkToken = function () {
    let token = localStorage.getItem('token');
        // console.log(token)
        fetch('http://127.0.0.1:8000/api/check/' + token)
            .then((result) => {
                return result;
            })
            .then((data) => {
                console.log(data.status);
                if (data.status !== 200) {
                    localStorage.clear();
                    window.location.replace("../Signin");

                }
            })
    // if(token == null){
    //     localStorage.clear();
    //     window.onload = function() {
    //         window.location.replace("../Signin");
    //     }
    // }
};

export {checkToken};