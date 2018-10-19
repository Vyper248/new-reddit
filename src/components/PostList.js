import React from 'react';
import {Link} from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import './PostList.css';

const PostList = ({posts, sub}) => {
    if (posts.length === 0){
        return (
            <LoadingSpinner />
        );
    } else {
        return (
            <div className="postListDiv">
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