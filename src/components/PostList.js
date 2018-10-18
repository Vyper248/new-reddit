import React from 'react';
import {Link} from 'react-router-dom';
import Header from './Header';
import './PostList.css';

const PostList = ({posts, sub}) => {
    if (posts.length === 0){
        return (
            <p className="loading">Loading...</p>
        );
    } else {
        return (
            <div className="postListDiv">
                <Header heading={sub} />
                <hr/>
                {
                    posts.map(post => {
                        let href = `${sub}/${post.id}`;
                        return <div key={post.id}><Link to={href} className="postLink">{post.title}</Link></div>
                    })
                }
            </div>
        );
    }
};

export default PostList;