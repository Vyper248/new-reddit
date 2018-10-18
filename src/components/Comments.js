import React from 'react';

const Comments = ({comments}) => {
    console.log(comments);
    if (!comments) comments = [];
    
    if (comments.length > 0) {
        return (
            comments.map(comment => {
                return <div className="commentDiv" key={comment.id} dangerouslySetInnerHTML={{ __html: comment.body_html }}></div>
            })
        );
    } else {
        return (
            <div>Loading Comments...</div>
        );
    }
}

export default Comments;