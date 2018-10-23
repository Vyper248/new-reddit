import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import PostLink from './PostLink';
import './PostList.css';

const PostList = ({posts}) => {    
    if (posts && posts.length === 0){
        return (
            <LoadingSpinner />
        );
    } else if (posts) {
        return (
            <div className="postListDiv">
                {
                    posts.map(post => {
                        return <PostLink key={post.id} post={post}/>
                    })
                }
            </div>
        );
    } else {
        return (
            <div className="postListDiv">No Posts Found</div>
        )
    }
};

export default PostList;