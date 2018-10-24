import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import SubList from './components/SubList';
import PostList from './components/PostList';
import Post from './components/Post';
import Header from './components/Header';
import SortButtons from './components/SortButtons';
const pjson = require('../package.json');

class Page extends Component {
    constructor(){
        super();
        this.state = {
            sub: '',
            postId: '',
            sortMethod: 'hot',
            commentSortMethod: 'new',
            posts: [],
            postDetails: {title: '', body: '', id: '', comments: []}
        };
    }
    
    render(){
        let startPoint = pjson.startPoint;
        return (
            <div>
                <SubList />
                <Header heading={this.state.sub} onReload={this.onReload}/>
                <SortButtons onClick={this.onChangeSortMethod} currentSort={this.state.sortMethod} sortList={1}/>
                <hr/>
                <Switch>
                    <Route exact path={startPoint+'/'} render={props => <PostList {...props} posts={this.state.posts}/>} />
                    <Route exact path={startPoint+'/:sub'} render={props => <PostList {...props} posts={this.state.posts}/>} />
                    <Route exact path={startPoint+"/:sub/:post"} render={props => <Post {...props} postDetails={this.state.postDetails} commentSortMethod={this.onChangeCommentSortMethod} currentSort={this.state.commentSortMethod} />} />
                </Switch>
            </div>
        );
    }
    
    onReload = () => {
        this.checkUrlAndUpdate(true);
    }
    
    onChangeSortMethod = (e) => {
        let sortMethod = e.target.innerText.toLowerCase();
        this.setState({sortMethod});
    }
    
    onChangeCommentSortMethod = (e) => {
        let commentSortMethod = e.target.innerText.toLowerCase();

        switch(commentSortMethod){
            case 'best': this.setState({commentSortMethod:'confidence'}); break;
            case 'q&a': this.setState({commentSortMethod:'qa'}); break;
            default: this.setState({commentSortMethod}); break;
        }
    }
    
    parseBodyText(text){
        text ? text = text
                        .replace(/&lt;/g,'<')
                        .replace(/&gt;/g,'>')
                        .replace(/&amp;#39;/g,"'")
                        .replace(/&amp;quot;/g,'"')
                        .replace(/&amp;/g,"&")
                        .replace(/&#x200B;/g,' ')
                         : text = '';
        return text;
    }

    getPostList = async (sub) => {
        if (sub.length > 0) sub = 'r/'+sub;
        
        try {
            let url = 'https://www.reddit.com/'+sub+'/'+this.state.sortMethod+'/.json';
            if (sub.length === 0) url = 'https://www.reddit.com/.json';

            let response = await fetch(url);
            let data = await response.json();

            if (data.error){
                this.setState({posts: null});
            } else {
                if (data && data.data && data.data.children){
                    let posts = data.data.children.map(post => {
                        const data = post.data;

                        let media = data.media;
                        if (media && media.oembed){
                            media = this.parseBodyText(media.oembed.html);
                        } else {
                            media = '';
                        }
                        
                        return {
                            created: data.created_utc,
                            author: data.author,
                            domain: data.domain,
                            title: this.parseBodyText(data.title),
                            id: data.id,
                            body: this.parseBodyText(data.selftext_html),
                            num_comments: data.num_comments,
                            score: data.score,
                            subreddit: data.subreddit,
                            stickied: data.stickied,
                            url: data.url,
                            thumbnail: data.thumbnail, //if no thumbnail - "self"
                            permalink: data.permalink,
                            media: media
                        };
                    });
                    
                    if (posts.length === 0) posts = null;
                    this.setState({posts});
                }
            }
        } catch (error) {
            console.log(error);
            this.setState({posts:null});
        }
    };
    
    parseComment(comment){
        let {body_html, id, author, permalink, replies, score} = comment;
        body_html = this.parseBodyText(body_html);
        
        replies = typeof replies === 'object' ? replies.data.children : [];
        
        replies = replies.map(comment => {
            //console.log(comment);
            return this.parseComment(comment.data);
        });
        
        return {body_html, id, author, permalink, replies, score};
    }
    
    getPostDetails = async (url) => {
        try {
            let response = await fetch('https://www.reddit.com/r/'+url+'.json?sort='+this.state.commentSortMethod);
            let data = await response.json();
            
            if (data.error){
                this.setState({postDetails: {title: 'Not Found', body: '', id: ''}});
            } else {
                let {title, selftext_html, id, url, media, author, created_utc} = data[0].data.children[0].data;

                let comments = data[1].data.children.map(obj => {
                    return this.parseComment(obj.data);
                });
                
                if (media && media.oembed){
                    media = this.parseBodyText(media.oembed.html);
                } else {
                    media = '';
                }

                //if this exists, replace &lt etc with proper symbols, otherwise set to empty string
                selftext_html = this.parseBodyText(selftext_html);
                this.setState({postDetails: {title, body: selftext_html, id, url, media, comments, author, created: created_utc}});
            }
        } catch (error) {
            console.log(error);
        }
    };

    checkUrlAndUpdate(force = false){
        let startPoint = pjson.startPoint;
        let url = this.props.location.pathname.replace(startPoint,'').replace('/','');
        let parts = url.split('/');

        if (parts.length === 1){
            let sub = parts[0];
            //on sub, so get post list
            if (sub.toLowerCase() !== this.state.sub.toLowerCase() || force){
                this.setState({sub: sub, posts:[]});
                this.getPostList(url);
            }
        } else if (parts.length === 2){
            let sub = parts[0];
            let postId = parts[1];

            if (sub.toLowerCase() !== this.state.sub.toLowerCase() || force){
                this.setState({sub, posts: []});
                this.getPostList(sub);
            }
            
            if (postId.toLowerCase() !== this.state.postId.toLowerCase() || force){
                //check if post details already exists within the current post array, and if so, use that for quicker rendering
                let posts = this.state.posts || [];
                let postInfo = posts.find(post => post.id === postId);
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
        let force = false;
        if (prevState.sortMethod !== this.state.sortMethod) force = true;
        if (prevState.commentSortMethod !== this.state.commentSortMethod) force = true;
        this.checkUrlAndUpdate(force);        
    }
    
    componentDidMount(){
        this.checkUrlAndUpdate(true);
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