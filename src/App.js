import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";

const Header = ({heading}) => {
    return (
        <h1>{heading}</h1>
    );
};

const SubList = ({onChange}) => {
    return (
        <div>
            <Link to="/posts" onClick={onChange('posts')}>Sub 1</Link>&nbsp;
            <Link to="/todos" onClick={onChange('todos')}>Sub 2</Link>&nbsp;
            <Link to="/photos" onClick={onChange('photos')}>Sub 3</Link>&nbsp;
        </div>
    );
};

const PostList = ({match, posts}) => {
    return (
        <div>
            {
                posts.map(post => {
                    let href = `/${match.params.sub}/${post.id}`;
                    return <Link to={href} key={post.id}>{post.title}</Link>
                })
            }
        </div>
    );
};

class Post extends Component {
    constructor({match}){
        super();
        this.match = match;
        this.state = {
            title: '',
            body: '',
        };
    }
    
    render(){
        return (
            <div>
                {
                    this.state.title.length === 0 ? <h1>Loading...</h1> : (
                        <div>
                            <h1>{this.state.title}</h1>
                            <div>
                                {this.state.body}
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
    
    componentDidMount(){
        this.getPostDetails(this.match.url);
    }
    
    getPostDetails = async (url) => {
        let response = await fetch('https://jsonplaceholder.typicode.com'+url);
        let data = await response.json();

        const {title, body} = data;
        this.setState({title, body});
    };
}

class App extends Component {
    constructor(){
        super();
        this.state = {
            sub: 'Home',
            heading: '',
            posts: []
        };
    }
    
    changeSub = (sub) => () => {
        this.setState({sub, heading: sub});
        this.getPosts(sub);
    };
    
    render(){
        return (
            <Router>
                <div>
                    <SubList onChange={this.changeSub}/>
                    <Header heading={this.state.heading}/>
                    <hr />
                    <Switch>
                        <Route exact path="/:sub" render={props => <PostList {...props} posts={this.state.posts}/>} />
                        <Route path="/:sub/:post" component={Post} />
                        <Redirect from="/" to="/posts"/>
                    </Switch>
                </div>
            </Router>
        );
    }

    getPosts = async (sub) => {
        let heading = sub;
        sub === '/' ? heading = 'Home' : heading = sub;
        
        let response = await fetch('https://jsonplaceholder.typicode.com/'+sub);
        let data = await response.json();
        
        this.setState({heading});
        this.setState({posts: data});
    };
    
    componentDidMount(){
        this.getPosts('posts');
    }
}

export default App;