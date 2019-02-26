import React from 'react';
import './App.css';

//Components

// Container

var App = React.createClass({
  apiKey: '4f65322e8d193ba9623a9e7ab5caa01e',
  getInitialState: function() {
    return {searchTerm:"", searchUrl:""};
  },
  handleKeyUp :function(e){
    if (e.key === 'Enter' && this.state.searchTerm !== '') {
      var searchUrl = "search/multi?query=" + this.state.searchTerm + "&api_key=" + this.apiKey;
      this.setState({searchUrl:searchUrl});
    }
  },

  handleChange : function(e){
      this.setState({searchTerm : e.target.value});    
  },
  render: function() {
    return (
      <div>
        <header className="header">
        <h1>Netlens</h1>
           <h5>personalised movie recommedations</h5>
          <div id="search" className="search-container">
            <input  onKeyUp={this.handleKeyUp} onChange={this.handleChange} type="search" placeholder="Search for a title..." value={this.state.searchTerm}/>
          </div>
          <Navigation />
        </header>
        <div id="searchresultContainter"><TitleList title="Search Results" url={this.state.searchUrl} /></div>
        
        <TitleList title="Top TV picks" url='discover/tv?sort_by=popularity.desc' />
        <TitleList title="Trending now" url='discover/movie?sort_by=popularity.desc' />
        <TitleList title="In Cinema now" url='discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2018-11-09'/>
      </div>
    );
  }
});

// Navigation
var Navigation = React.createClass({
  render: function() {
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
});

var SearchList = React.createClass({
  render: function() {
    return (
      <div className="Item" style={{backgroundImage: 'url(' + this.props.backdrop + ')'}} >  
        </div>
     
    );
  }
})


// Title List Container

var TitleList = React.createClass({

  apiKey: '4f65322e8d193ba9623a9e7ab5caa01e',
  getInitialState: function() {
    return {data: [], mounted: false};
  },
  loadContent: function() {
    var requestUrl = 'https://api.themoviedb.org/3/' + this.props.url + '&api_key=' + this.apiKey;
    fetch(requestUrl).then((response)=>{
        return response.json();
    }).then((data)=>{
        this.setState({data : data});
    }).catch((err)=>{
        console.log("There has been an error");
    });
  },
  componentWillReceiveProps : function(nextProps){
    if(nextProps.url !== this.props.url && nextProps.url !== ''){
      this.setState({mounted:true,url:nextProps.url},()=>{
        this.loadContent();
      });
      
    }
  },
  componentDidMount: function() {
    if(this.props.url !== ''){
      this.loadContent();
      this.setState({mounted:true});
    }
    
  },
  render: function() {
    var titles ='';
    if(this.state.data.results) {
      titles = this.state.data.results.map(function(title, i) {
        if(i < 5) {
          var name = '';
          var backDrop = 'http://image.tmdb.org/t/p/original' + title.backdrop_path;
          if(!title.name) {
            name = title.original_title;
          } else {
            name = title.name;
          }

          return (
            <Item key={title.id} title={name} score={title.vote_average} overview={title.overview} backdrop={backDrop} />
            
          );  

        }else{
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
});

// Title List Item
var Item = React.createClass({
  render: function() {
    return (
      <div className="Item" style={{backgroundImage: 'url(' + this.props.backdrop + ')'}} >  
        </div>
     
    );
  }
  
});



export default App;
