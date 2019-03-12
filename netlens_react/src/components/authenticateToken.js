let check = 'checking';

const checkToken = function () {
    let token = localStorage.getItem('token');
    if (token != null) {
        // console.log(token)
        fetch('http://127.0.0.1:8000/api/check/' + token)
            .then((result) => {
                return result;
            })
            .then((data) => {
                console.log(data.status);
                if (data.status == 200) {
                    check = 'valid';
                    console.log(check);
                } else {
                    check = 'invalid';
                    console.log(check);
                }
            })
        //console.log(check);
    }
    else {
        check = 'invalid';
    }
    return check;
};

export {checkToken};