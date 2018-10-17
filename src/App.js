import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

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
    let title = match.params.sub;
    if (!title) title = 'Home';
    
    if (posts.length === 0){
        return (
            <p>Loading...</p>
        );
    } else {
        return (
            <div>
                <Header heading={title} />
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
                            <div dangerouslySetInnerHTML={{ __html: this.state.body }}></div>
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
                let {title, selftext_html} = data[0].data.children[0].data;
                //if this exists, replace &lt etc with proper symbols, otherwise set to empty string
                selftext_html ? selftext_html = selftext_html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;#39;/g,"'") : selftext_html = '';
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
                    <Route exact path="/" render={props => <PostList {...props} posts={this.state.posts}/>} />
                    <Route exact path="/:sub" render={props => <PostList {...props} posts={this.state.posts}/>} />
                    <Route exact path="/:sub/:post" component={Post} />
                    {/* <Redirect from="/" to="/PSVR"/> */}
                </Switch>
            </div>
        );
    }

    getPosts = async (sub) => {
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
    
    componentDidMount(){
        let url = this.props.location.pathname.replace('/','');
        this.getPosts(url);
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