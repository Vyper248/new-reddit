import React from 'react';
import Comment from './Comment';
import LoadingSpinner from './LoadingSpinner';

const Comments = ({comments, author}) => {
    if (comments && comments.length > 0) {
        return (
            <div className="comments">
            {
                comments.map(comment => {
                    if (!comment.author) return null;
                    return <Comment key={comment.id} comment={comment} author={author} />
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
            // <div>Loading Comments...</div>
            <LoadingSpinner />
        );
    }
}

export default Comments;