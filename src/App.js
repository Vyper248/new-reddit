import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SubList from './components/SubList';
import PostList from './components/PostList';
import Post from './components/Post';

class Page extends Component {
    constructor(){
        super();
        this.state = {
            sub: '',
            postId: '',
            posts: [],
            postDetails: {title: '', body: '', id: '', comments: []}
        };
    }
    
    render(){
        return (
            <div>
                <SubList />
                <Switch>
                    <Route exact path="/" render={props => <PostList {...props} posts={this.state.posts} sub={this.state.sub}/>} />
                    <Route exact path="/:sub" render={props => <PostList {...props} posts={this.state.posts} sub={this.state.sub}/>} />
                    <Route exact path="/:sub/:post" render={props => <Post {...props} postDetails={this.state.postDetails} />} />
                </Switch>
            </div>
        );
    }
    
    parseBodyText(text){
        text ? text = text
                        .replace(/&lt;/g,'<')
                        .replace(/&gt;/g,'>')
                        .replace(/&amp;#39;/g,"'")
                        .replace(/&amp;quot;/g,'"')
                        .replace(/&amp;/,"&")
                         : text = '';
        return text;
    }

    getPostList = async (sub) => {
        if (sub.length > 0) sub = 'r/'+sub;
        
        try {
            let response = await fetch('https://www.reddit.com/'+sub+'.json');
            let data = await response.json();

            if (data.error){
                this.setState({posts: []});
            } else {
                if (data && data.data && data.data.children){
                    let posts = data.data.children.map(post => {
                        return {
                            title: this.parseBodyText(post.data.title),
                            id: post.data.id,
                            body: this.parseBodyText(post.data.selftext_html)
                        };
                    });
                    
                    this.setState({posts});
                }
            }
        } catch (error) {
            console.log(error);
            this.setState({sub: '', postId: ''});
        }
    };
    
    getPostDetails = async (url) => {
        try {
            let response = await fetch('https://www.reddit.com/r/'+url+'.json');
            let data = await response.json();
            
            if (data.error){
                this.setState({postDetails: {title: 'Not Found', body: '', id: ''}});
            } else {
                let {title, selftext_html, id} = data[0].data.children[0].data;
                let comments = data[1].data.children.map(obj => {
                    let {body_html, id, author, permalink} = obj.data;
                    body_html = this.parseBodyText(body_html);
                    return {body_html, id, author, permalink};
                });
                //if this exists, replace &lt etc with proper symbols, otherwise set to empty string
                selftext_html = this.parseBodyText(selftext_html);
                this.setState({postDetails: {title, body: selftext_html, id, comments}});
            }
        } catch (error) {
            console.log(error);
        }
    };

    checkUrlAndUpdate(){
        let url = this.props.location.pathname.replace('/','');
        
        let matches = this.props.location.pathname.match(/\//g);
        matches = matches ? matches.length : 0;

        if (matches === 1){
            //on sub, so get post list
            if (url !== this.state.sub){
                this.setState({sub: url, posts:[]});
                this.getPostList(url);
            }
        } else if (matches === 2){
            //on post, so get post list and post details if different to current state
            let sub = url.replace(/\/[a-zA-Z0-9]+/,'');
            let postId = url.replace(/[a-zA-Z0-9]+\//,'');
            
            if (sub !== this.state.sub){
                this.setState({sub, posts: []});
                this.getPostList(sub);
            }
            
            if (postId !== this.state.postId){
                //check if post details already exists within the current post array, and if so, use that for quicker rendering
                let postInfo = this.state.posts.find(post => post.id === postId);
                if (postInfo){
                    this.setState({sub, postId, postDetails: postInfo});
                } else {
                    this.setState({sub, postId, postDetails: {title:'', body:'', id:''}});
                }
                this.getPostDetails(`${sub}/${postId}`);
            }
        }
    }
    
    componentDidUpdate(prevProps, prevState){
        this.checkUrlAndUpdate();        
    }
    
    componentDidMount(){
        this.checkUrlAndUpdate();
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