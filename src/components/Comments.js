import React from 'react';
import Comment from './Comment';

const Comments = ({comments}) => {
    if (comments && comments.length > 0) {
        return (
            <div className="comments">
            {
                comments.map(comment => {
                    return <Comment key={comment.id} comment={comment} />
                })
            }
            </div>
        );
    } else if (comments) {
        return (
            <div></div>
        );
    } else if (!comments){
        return (
            <div>Loading Comments...</div>
        );
    }
}

export default Comments;