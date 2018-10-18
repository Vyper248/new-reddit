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
            posts: [],
            postDetails: {title: '', body: ''}
        };
    }
    
    render(){
        return (
            <div>
                <SubList />
                <Switch>
                    <Route exact path="/" render={props => <PostList {...props} posts={this.state.posts}/>} />
                    <Route exact path="/:sub" render={props => <PostList {...props} posts={this.state.posts}/>} />
                    <Route exact path="/:sub/:post" render={props => <Post {...props} postDetails={this.state.postDetails} />} />
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
            
            console.log('setting post array for ',sub);
            this.setState({posts});
        }
    };
    
    getPostDetails = async (url) => {
        console.log('getting post details');
        try {
            let response = await fetch('https://www.reddit.com/r/'+url+'.json');
            let data = await response.json();
            
            if (data.error){
                this.setState({title: 'Not Found', body: ''});
            } else {
                let {title, selftext_html} = data[0].data.children[0].data;
                //if this exists, replace &lt etc with proper symbols, otherwise set to empty string
                selftext_html ? selftext_html = selftext_html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;#39;/g,"'") : selftext_html = '';
                this.setState({postDetails: {title, body: selftext_html}});
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    componentDidUpdate(prevProps){
        console.log('update');
        if (prevProps.location.pathname !== this.props.location.pathname){
            console.log('location different');
            //check if needs to get new posts
            let matches = this.props.location.pathname.match(/\//g);
            matches = matches ? matches.length : 0;
            let prevMatches = prevProps.location.pathname.match(/\//g);
            prevMatches = prevMatches ? prevMatches.length : 0;

            if (prevMatches === 2 && matches === 1) {
                //going from post to sub, so don't need to update, already have array
                let oldSub = prevProps.location.pathname.match(/\/([a-zA-Z0-9]+)\//)[1];
                let url = this.props.location.pathname.replace('/','');
                if (url !== oldSub){
                    console.log('post to different sub, need updating');
                    this.setState({posts: []});
                    this.getPostList(url);
                } else if (this.state.posts.length === 0) {
                    console.log('post to sub, getting new array because started with empty');
                    this.getPostList(url);
                } else {
                    console.log('post to sub, no updated needed');
                }
            } else if (prevMatches === 1 && matches === 2) {
                //going from sub to post, so don't need to update
                console.log('sub to post');
                let oldSub = prevProps.location.pathname.match(/\/([a-zA-Z0-9]+)/)[1];
                let newSub = this.props.location.pathname.match(/\/([a-zA-Z0-9]+)\//)[1];
                let url = this.props.location.pathname.replace('/','');
                if (newSub !== oldSub){
                    console.log('sub to different subs post, need updating', url, oldSub);
                    this.getPostList(url.match(/([a-zA-Z0-9]+)\//)[1]);
                }
                
                this.setState({postDetails: {title: '', body: ''}});
                this.getPostDetails(url);
            } else {
                //going from one sub to another sub, so do need to update
                console.log('sub to sub');
                this.setState({posts: []});
                this.getPostList(this.props.location.pathname.replace('/',''));
            }
        }
    }
    
    componentDidMount(){
        let url = this.props.location.pathname.replace('/','');
        //check initial url and fetch required data
        let matches = this.props.location.pathname.match(/\//g);
        matches = matches ? matches.length : 0;
        if (matches === 1){
            //on sub, so get post list
            this.getPostList(url);
        } else if (matches === 2){
            //on post, so get post list and post details
            this.getPostList(url);
            this.getPostDetails(url);
        }
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