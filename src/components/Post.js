import React from 'react';
import Comments from './Comments';
import './Post.css';

const Post = (props) => {
    let {title, body, comments} = props.postDetails;
    
    return (
        <div>
            {
                title.length === 0 ? <h1 className="loading">Loading...</h1> : (
                    <div className="postDiv">
                        <h1>{title}</h1>
                        <div dangerouslySetInnerHTML={{ __html: body }}></div>
                        <Comments comments={comments} />
                    </div>
                )
            }
        </div>
    );
}

export default Post;