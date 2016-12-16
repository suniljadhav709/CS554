import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router'
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import axios from 'axios';
import PlaylistAdd from 'material-ui/svg-icons/av/playlist-add';
import PlaylistAddCheck from 'material-ui/svg-icons/av/playlist-add-check';

class SearchBar extends React.Component {
    
    constructor(props) {
        super(props);

        // set the initial component state
        this.state = {
            errors: {},
            data :[],
            styles: {

                titleStyle: {
                    color: 'rgb(0, 0, 0)',
                    fontWeight: 'bold'
                },
                root: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                },
                gridList: {
                    display: 'flex',
                    flexWrap: 'nowrap',
                    overflowX: 'auto',
                },
              imageStyle: {
                    height: '200px',
                    width: '200px',
                }
            },
            parameters: {
                movie: '',
                actor: '',
                director:'',
                genre:''
            },
            currentPage: 1
        };
        
        this.handleMovieNameChange = this.handleMovieNameChange.bind(this);
        this.handleActorChange = this.handleActorChange.bind(this);
        this.handleDirectorChange = this.handleDirectorChange.bind(this);
        this.handleGenreChange = this.handleGenreChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    itemClicked(id) {
        console.log("itemClicked Clicked");
        if (id !== "next") {
            console.log("Item Clicked: " + id);
            browserHistory.push('/movie/' + id);
        } else{
            console.log("Next Clicked");
            this.getQueryStr_Movies();
        }
    }
    additem(index){
        if (!this.state.data[index].isAdded) {
            console.log("Add Movie Clicked "+this.state.data[index].id);
            var react_component = this;
            var movie_index = index;
            
            axios.post('/playlist/' + this.state.data[index].id)
                .then(res => {
                    if (res.data.success === true) {
                        console.log("Movie Added");
                         //[movie_index].isAdded = true;
                         var arr_search = react_component.state.data;
                         arr_search[movie_index].isAdded = true;
                          react_component.setState({
                              data : arr_search
                          });
                        alert("Success : Movie added.");
                    }else{
                        console.log("Movie NOT Added");
                        alert("There was some problem in adding movie to the playlist.");
                    }
                });
        }else{
            alert("Movie Already Added");
        }
    }

    handleMovieNameChange(event) {
        //console.log('@ search bar : handleChange');
        
        const field = 'movie';
        //console.log('@ search bar : target property : ' + field);
        const parameters = this.state.parameters;
        //console.log('@ search bar : value : ' + event.target.value);
        parameters[field] = event.target.value;

        this.setState({parameters});
    }

    handleActorChange(event) {
        //console.log('@ search bar : handleChange');
        
        const field = 'actor';
        //console.log('@ search bar : target property : ' + field);
        const parameters = this.state.parameters;
        //console.log('@ search bar : value : ' + event.target.value);
        parameters[field] = event.target.value;

        this.setState({parameters});
    }
    
    handleDirectorChange(event) {
        //console.log('@ search bar : handleChange');
        
        const field = 'director';
        //console.log('@ search bar : target property : ' + field);
        const parameters = this.state.parameters;
        //console.log('@ search bar : value : ' + event.target.value);
        parameters[field] = event.target.value;

        this.setState({parameters});
    }
    
    handleGenreChange(event) {
        //console.log('@ search bar : handleChange');
        
        const field = 'genre';
        //console.log('@ search bar : target property : ' + field);
        const parameters = this.state.parameters;
        //console.log('@ search bar : value : ' + event.target.value);
        parameters[field] = event.target.value;

        this.setState({parameters});
    }

    applyfilter(playlist, searchResult){
        
        var ids = [];
        var filter_indexes = [];
        
        console.log('Playlist Ids : ' + ids);
        var index = 0;
        var isFound = false;
        
        console.log('Pre Filter');
        searchResult.forEach(function(element) {
            //if(element.title == "300")
                console.log('Id: ' + element.id + ' title' + element.title+ ' isAdded' + element.isAdded);
        }, this);

        var counter = 0;
        searchResult.forEach(function(search_item) {
            //console.log('id : ' + element.id + 'is in ids array @ : ' + ids.indexOf(element.id));
            playlist.forEach(function(pl_item) {
                console.log('Search Item id : ' + search_item.id + " is compared with pl item id : " + pl_item._id + ' and the result is : ' + search_item.id == pl_item._id );
                if(search_item.id == pl_item._id)
                    filter_indexes.push(counter);
            }, this);
            counter++;
        }, this);

        filter_indexes.forEach(function(index) {
            searchResult[index].isAdded = true; 
        }, this);

        //console.log('filtered Indexes : ' + filter_indexes);
        console.log('Post Filter');
        searchResult.forEach(function(element) {
            //if(element.title == "300")
                console.log('Id: ' + element.id + ' title' + element.title+ ' isAdded' + element.isAdded);
        }, this);
        return searchResult;
    }

    
    getQueryStr_Movies(){
        var myplayList = [];
        var get_playlist = {
            url : "/playlist",
            method : "GET",
            contentType: "application/json; charset=utf-8"

        };

        $.ajax(get_playlist).then(function(res){
            myplayList = res;            
        },function(err){
            console.log("error while getting user playlist : " + JSON.stringify(err));
        });
        var params = {
            title : this.state.parameters.movie

        };
        console.log('Getting query search : ' + JSON.stringify(params));
        var _url = "/search?";
        _url += params.title ? ("title=" +params.title) +"&" : "";
        
        var getQueryStr = {
            url: _url,
            method: "GET",
            contentType: "application/json; charset=utf-8"
        };
        var react_com = this;
        $.ajax(getQueryStr).then(function(response){
            //console.log(' ************* Query String  ************** ');
            
            if(response.success){
                var qry_str = "/search/results/"+ react_com.state.currentPage + "?" + response.query;
                //console.log(qry_str);
                var getSearch_result = {
                    url : qry_str,
                    method :"GET",
                    contentType : "application/json"
                };
                $.ajax(getSearch_result).then(function(res){
                    //console.log('Movies : ' + JSON.stringify(res));
                    
                    
                    var newArr = res.movies;
                    newArr = react_com.applyfilter(myplayList, newArr);
                    console.log(newArr);
                    var page = parseInt(res.page);
                    var totalPages = parseInt(res.total);
                    if ((totalPages - page) > 0) {
                        react_com.setState({ currentPage: page });
                        newArr.push({
                            id: "next",
                            poster_path: "/public/images/next.png",
                            title: "Load More"
                        });
                    }
                    react_com.setState({
                        data : newArr
                    });
                },function(err2){
                    console.log('Error  : ' + JSON.stringify(err2));    
                });
            }else{
                console.log('Error  : ' + JSON.stringify(response.error));
            }
            
        },function(err){
            console.log('Error : ' + JSON.stringify(err));
        });
    }

    handleSubmit(event) {   

        event.preventDefault();
        this.getQueryStr_Movies();
        
    }
    
    
    render(){

        console.log('rendering search bar');
        return (
            <div>
                <div className="container">
                    <form onSubmit={this.handleSubmit} id="search" >
                        <div className="form-group">
                            <label>Movie :</label>
                            <input
                                className="form-control"
                                type="text" 
                                placeholder="Movie" value={this.state.parameters.movie} 
                                onChange={this.handleMovieNameChange} />
                        </div>
                        <div className="form-group">
                            <label>Actor :</label> 
                            <input type="text" 
                            className="form-control"
                            placeholder="Actor" value={this.state.parameters.actor} 
                                onChange={this.handleActorChange}/>
                        </div>
                        <div className="form-group">
                            <label>Director :</label> 
                            <input type="text" 
                            className="form-control"
                            placeholder="Director" value={this.state.parameters.director} 
                                onChange={this.handleDirectorChange} />
                        </div>
                        <div className="form-group">
                            <label>Genre :</label> 
                            <input type="text" 
                            className="form-control"
                            placeholder="Genre" value={this.state.parameters.genre} 
                                onChange={this.handleGenreChange} />
                        </div>
                        <div className="form-group">
                            <label>Keywords :</label> 
                            <input type="text" 
                            className="form-control"
                            placeholder="Keywords" value={this.state.parameters.keywords} 
                                onChange={this.handleGenreChange} />
                        </div>
                        <div className="form-group"> 
                            <input type="submit" placeholder="Search" />
                        </div>
                        
                    </form>
                </div>
                <div>
                    <div style={this.state.styles.root}>
                        <GridList className="container" style={this.state.styles.gridList} cols={2.2}>
                            {this.state.data.map((tile, i) => (
                                <GridTile
                                    key={i}
                                    title={tile.title}
                                    actionIcon={tile.id === "next"?null : <IconButton onClick={this.additem.bind(this, i)}>{tile.isAdded ? (<PlaylistAddCheck color="rgb(0, 0, 0)" />) : (<PlaylistAdd color="rgb(0, 0, 0)" />)}</IconButton>}
                                    titleStyle={this.state.styles.titleStyle}
                                    titleBackground="linear-gradient(to top, rgba(255,255,255,0.9) 0%,rgba(255,255,255,0.7) 70%,rgba(255,255,255,0.6) 100%)"
                                    >
                                    <img style={this.state.styles.imageStyle} 
                                        onClick={this.itemClicked.bind(this, tile.id)} 
                                        src={tile.id == "next" ? tile.poster_path : (
                                                            tile.poster_path === null?"/public/images/movie-icon.png":"https://image.tmdb.org/t/p/w300_and_h450_bestv2/" + tile.poster_path
                                                            )} />
                                </GridTile>
                            ))}
                        </GridList>
                    </div>
                </div>
            </div>
        );
    }
}

const HomePage =  withRouter(React.createClass({ 
  api:"e443ee14fb107feee75db8b448e6a13e",
  getInitialState: function() {
		return {data: [], mounted: false};
	},
  // getInitialState : function() {
  //   console.log('Initial State');
  //   return {title : "Title is Null"}
  // },
  // <Banners playlist={this.state.data}/>);
  componentWillReceiveProps : function(nextProps){
    
	this.setState({ mounted: false });
  },
  componentDidMount : function(){
    
	this.setState({ mounted: true });
  },
  

  render: function(){  
    console.log('In Home Page Component');
    // return (<Card className="container">
    //           <CardTitle title={this.state.title} subtitle="This is the home page." />
    //         </Card>  );
    //return ( <Banners playlist={playlist_fake}/>);
    //if(this.state.data) {
    return (<div>
                <SearchBar />
            </div>);
    //}
  }
}

));

export default HomePage;