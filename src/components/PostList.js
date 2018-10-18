import React from 'react';
import {Link} from 'react-router-dom';
import Header from './Header';

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

export default PostList;