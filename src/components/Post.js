import React from 'react';

const Post = (props) => {
    let {title, body} = props.postDetails;
    return (
        <div>
            {
                title.length === 0 ? <h1>Loading...</h1> : (
                    <div>
                        <h1>{title}</h1>
                        <div dangerouslySetInnerHTML={{ __html: body }}></div>
                    </div>
                )
            }
        </div>
    );
}

export default Post;