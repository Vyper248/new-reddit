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
            <Link to="/PSVR" onClick={onChange('PSVR')}>PSVR</Link>&nbsp;
            <Link to="/PS4" onClick={onChange('PS4')}>PS4</Link>&nbsp;
            <Link to="/Apple" onClick={onChange('Apple')}>Apple</Link>&nbsp;
        </div>
    );
};

const PostList = ({match, posts}) => {
    console.log(match, posts);
    if (posts.length === 0){
        return (
            <p>Loading...</p>
        );
    } else {
        return (
            <div>
                <Header heading={match.params.sub} />
                <hr/>
                {
                    posts.map(post => {
                        let href = `${match.params.sub}/${post.id}`;
                        return <div key={post.id}><Link to={href}>{post.title}</Link></div>
                    })
                }
            </div>
        );
    }
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
        let {sub, post} = this.match.params;
        this.getPostDetails(`${sub}/comments/${post}.json`);
    }
    
    getPostDetails = async (url) => {
        
        try {
            let response = await fetch('https://www.reddit.com/r/'+url);
            let data = await response.json();
            
            if (data.error){
                this.setState({title: 'Not Found', body: ''});
            } else {
                const {title, selftext_html} = data[0].data.children[0].data;
                this.setState({title, body: selftext_html});
            }
        } catch (error) {
            console.log(error);
        }
            
    };
}

class Page extends Component {
    constructor(){
        super();
        this.state = {
            sub: 'Home',
            heading: '',
            posts: []
        };
    }
    
    changeSub = (sub) => () => {
        this.setState({sub, heading: sub, posts: []});
        this.getPosts(sub);
    };
    
    render(){
        return (
            <div>
                <SubList onChange={this.changeSub}/>
                <Switch>
                    <Route exact path="/:sub" render={props => <PostList {...props} posts={this.state.posts}/>} />
                    <Route path="/:sub/:post" component={Post} />
                    <Redirect from="/" to="/PSVR"/>
                </Switch>
            </div>
        );
    }

    getPosts = async (sub) => {
        let response = await fetch('https://www.reddit.com/r/'+sub+'.json');
        let data = await response.json();

        let posts = data.data.children.map(post => {
            return {
                title: post.data.title,
                id: post.data.id,
                body: post.data.selftext_html
            };
        });
        
        this.setState({posts});
    };
    
    componentDidMount(){
        this.getPosts(this.props.location.pathname.replace('/',''));
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