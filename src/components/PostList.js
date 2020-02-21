import React from 'react';

import PostLink from './PostLink';
import LoadingSpinner from './LoadingSpinner';

const PostList = ({posts, sub, sort}) => {
    if (posts.length === 0) return <div><LoadingSpinner/></div>;    

    return (
        <div style={{margin: 'auto'}}>
            {
                posts.map(post => {
                    return <PostLink key={post.id} post={post} sub={sub} sort={sort}/>
                })
            }
        </div>
    );
}

export default PostList;