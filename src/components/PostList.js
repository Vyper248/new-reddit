import React from 'react';
import {Link} from 'react-router-dom';
import Header from './Header';

const PostList = ({posts, sub}) => {
    if (posts.length === 0){
        return (
            <p>Loading...</p>
        );
    } else {
        return (
            <div>
                <Header heading={sub} />
                <hr/>
                {
                    posts.map(post => {
                        let href = `${sub}/${post.id}`;
                        return <div key={post.id}><Link to={href}>{post.title}</Link></div>
                    })
                }
            </div>
        );
    }
};

export default PostList;