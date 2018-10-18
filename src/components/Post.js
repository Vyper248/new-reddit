import React from 'react';
import './Post.css';

const Post = (props) => {
    let {title, body, comments} = props.postDetails;
    console.log(comments);
    return (
        <div>
            {
                title.length === 0 ? <h1 className="loading">Loading...</h1> : (
                    <div className="postDiv">
                        <h1>{title}</h1>
                        <div dangerouslySetInnerHTML={{ __html: body }}></div>
                        {
                            comments.map(comment => {
                                return <div className="commentDiv" key={comment.id} dangerouslySetInnerHTML={{ __html: comment.body_html }}></div>
                            })
                        }
                    </div>
                )
            }
        </div>
    );
}

export default Post;