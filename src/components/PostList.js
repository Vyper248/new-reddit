import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import PostLink from './PostLink';
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
                        return <PostLink key={post.id} post={post} sub={sub}/>
                    })
                }
            </div>
        );
    }
};

export default PostList;