import React from 'react';
//import Logo from './Logo.js';
import './App.css';


//Components

// Container
class App extends React.Component {
  a = 'http://127.0.0.1:8000/api/toprated/';
  apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';
  constructor(props) {
      super(props);
      this.state = {searchTerm:"", searchUrl:""};
  }
  handleKeyUp(e){
    if (e.key === 'Enter' && this.state.searchTerm !== '') {
      var searchUrl = "search/multi?query=" + this.state.searchTerm + "&api_key=" + this.apiKey;
      this.setState({searchUrl:searchUrl});
    }
  }

  handleChange(e){
      this.setState({searchTerm : e.target.value});
  }

  render() {
    return (
      <div>
        <header className="header">
           <h1>Netlens</h1>
           <h5>personalised movie recommedations</h5>
          <div id="search" className="search-container">
            <input className="search-container" onKeyUp={this.handleKeyUp} onChange={this.handleChange} type="search" placeholder="Search for a title..." value={this.state.searchTerm}/>
          </div>
          <Navigation />
          {/* <UserProfile /> */}

        </header>

        {/*<TitleList title="Search Results" url={this.state.searchUrl} />*/}
        <TitleList title="Top Rated" />
        {/*<TitleList title="Trending now" url='discover/movie?sort_by=popularity.desc&page=1' />*/}

      </div>

    );
  }
}


// Navigation
class Navigation extends React.Component {
  render() {
    return (
      <div id="navigation" className="Navigation" >
        <nav>
          <ul>
            <li> <a href="#userprofile">User Profile</a></li>
            <li><a href="#userprofile"> Settings</a></li>
            <li><a href="#userprofile">Logout</a></li>
          </ul>
        </nav>
      </div>
    );
  }
}

// Title List Container

class TitleList extends React.Component {

    apiKey = '4f65322e8d193ba9623a9e7ab5caa01e';

    constructor(props) {
        super(props);
        this.state = {movies: [], data: [], mounted: false};
    }

    loadContent(id) {
        var requestUrl = 'https://api.themoviedb.org/3/movie/' + id + '?api_key=' + this.apiKey;
        fetch(requestUrl).then((response) => {
            return response.json();
        }).then((data) => {
            //this.setState({data: data});
            let arr = this.state.data;
            arr.push(data);
            this.setState({data: arr});
        }).catch((err) => {
            console.log("There has been an error");
        });
    }

    componentWillReceiveProps(nextProps) {
        //if(nextProps.url !== this.props.url && nextProps.url !== ''){
        //this.setState({mounted:true,url:nextProps.url},()=>{
        this.loadContent();
        //});

        //}
    }

    async componentDidMount() {
        //if(this.props.url !== ''){
        const m = await fetch('http://127.0.0.1:8000/api/toprated');
        const movies = await m.json();
        console.log(movies);
        this.setState({
            movies
        });
        movies.map(item => (
            this.loadContent(item.tmdbid)
        ));
        // this.loadContent();
        this.setState({mounted: true});
        // }

    }

    render() {
        var titles = '';
        if (this.state.data) {
            titles = this.state.data.map(function (title, i) {
                if (i < 5) {
                    var name = '';
                    var backDrop = 'http://image.tmdb.org/t/p/original' + title.backdrop_path;
                    if (!title.name) {
                        name = title.original_title;
                    } else {
                        name = title.name;
                    }

                    return (
                        <Item key={title} title={name} score={title.vote_average}
                              overview={title.overview} backdrop={backDrop}/>
                    );

                } else {
                    return (<div key={title.id}></div>);
                }
            });


        }

      return (
          <div ref="titlecategory" className="TitleList" data-loaded={this.state.mounted}>
              <div className="Title">
                  <h1>{this.props.title}</h1>
                  <div className="titles-wrapper">
                      {titles}
                  </div>
              </div>
          </div>
      );
   }
}

// Title List Item
class Item extends React.Component {
  render() {
    return (
      <div className="Item" style={{backgroundImage: 'url(' + this.props.backdrop + ')'}} >
        </div>

    );
  }

}


export default App;

