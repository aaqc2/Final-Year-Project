let apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
let baseURL = 'https://api.themoviedb.org/3/';
let configData = null;
let baseImageURL = null;
var title, release, revenue, runtime, languages, genres, tagline, overview;

let getConfig = function () {
    let url = "".concat(baseURL, 'configuration?api_key=', apiKey, '&query=The+Dark+Knight'); //change to movie_id parameter
    fetch(url)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            baseImageURL = data.images.secure_base_url;
            configData = data.images;
            //console.log('config:', data);
            console.log('config fetched');
            loadData()
        })
        .catch(function (err) {
            alert(err);
        });
}

let loadData = function () {
    let url = "".concat(baseURL, 'movie/155?api_key=', apiKey);
    fetch(url)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            title = data.original_title;
            console.log(title);
            document.getElementById('movie_title').innerHTML = title;

            release = data.release_date;
            document.getElementById('release').innerHTML = "Release date: "+release;
            revenue = data.revenue;
            document.getElementById('revenue').innerHTML = "Revenue: $"+revenue;
            runtime = data.runtime;
            document.getElementById('runtime').innerHTML = "Runtime: "+runtime+" minutes";
            languages = data.spoken_languages;
            var lanspan = document.getElementById('languages');
            for(var i = 0; i < languages.length; i++) {
                var obj = languages[i].name;
            
                str = '<span class="badge badge-dark"><a href="#" style="color:white">'+ obj +'</a></span>   ';
                lanspan.insertAdjacentHTML( 'beforeend', str );
            }

            genres = data.genres;
            var genspan = document.getElementById('movie_genres');
            for(var i = 0; i < genres.length; i++) {
                var obj = genres[i].name;
            
                str = '<span class="badge badge-dark"><a href="#" style="color:white">'+ obj +'</a></span>   ';
                genspan.insertAdjacentHTML( 'beforeend', str );
            }

            tagline = data.tagline;
            document.getElementById('movie_tagline').innerHTML = tagline;

            overview = data.overview;
            document.getElementById('movie_overview').innerHTML = overview;
        })
}

document.addEventListener('DOMContentLoaded', getConfig);


// class MovieInfo extends React.Component {
//     render(){
//        alert("Hi");
//      }
// }

// ReactDOM.render(
//     <MovieInfo />,
//     document.getElementById('movie_info')
// );


// var MovieInfo = React.createClass({
//     apiKey: '4f65322e8d193ba9623a9e7ab5caa01e',
//     baseURL: 'https://api.themoviedb.org/3/',
//     configData: null,
//     baseImageURL: null,

//     getConfig: function () {
//         url = "".concat(this.baseURL, 'configuration?api_key=', this.apiKEY);
//         fetch(url)
//             .then((result) => {
//                 return result.json();
//             })
//             .then((data) => {
//                 baseImageURL = data.images.secure_base_url;
//                 configData = data.images;
//                 console.log('config:', data);
//                 console.log('config fetched');
//                 //runSearch('jaws')
//             })
//             .catch(function (err) {
//                 alert(err);
//             });
//     },


// });