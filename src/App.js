import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SubList from './components/SubList';
import PostList from './components/PostList';
import Post from './components/Post';

class Page extends Component {
    constructor(){
        super();
        this.state = {
            sub: 'Home',
            heading: '',
            posts: []
        };
    }
    
    render(){
        return (
            <div>
                <SubList />
                <Switch>
                    <Route exact path="/" render={props => <PostList {...props} posts={this.state.posts}/>} />
                    <Route exact path="/:sub" render={props => <PostList {...props} posts={this.state.posts}/>} />
                    <Route exact path="/:sub/:post" component={Post} />
                </Switch>
            </div>
        );
    }

    getPostList = async (sub) => {
        if (sub.length > 0) sub = 'r/'+sub;
        
        let response = await fetch('https://www.reddit.com/'+sub+'.json');
        let data = await response.json();

        if (data && data.data && data.data.children){
            let posts = data.data.children.map(post => {
                return {
                    title: post.data.title,
                    id: post.data.id,
                    body: post.data.selftext_html
                };
            });
            
            this.setState({posts});
        }
    };
    
    componentDidUpdate(prevProps){
        if (prevProps.location.pathname !== this.props.location.pathname){
            //check if needs to get new posts
            if (prevProps.location.pathname.match(/\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+/) && this.props.location.pathname.match(/\/[a-zA-Z0-9]+/)) {
                //going from post to sub, so don't need to update, already have array
            } else if (prevProps.location.pathname.match(/\/[a-zA-Z0-9]+/) && this.props.location.pathname.match(/\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+/)) {
                //going from sub to post, so don't need to update
            } else {
                //going from one sub to another sub, so do need to update
                this.setState({posts: []});
                this.getPostList(this.props.location.pathname.replace('/',''));
            }
        }
    }
    
    componentDidMount(){
        let url = this.props.location.pathname.replace('/','');
        this.getPostList(url);
    }
}

const App = () => {
    return (
        <Router>
            <Route path='/' component={Page} />
        </Router>
    );
}

export default App;