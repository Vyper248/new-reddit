import React from 'react';
import styled from 'styled-components';

import Comment from './Comment';

const StyledCommentList = styled.div`
    margin-top: 10px;

    & > div {
        margin-bottom: 5px;
    }
`;

const CommentList = ({comments, author}) => {
    if (comments.length === 0) return null;

    return (
        <StyledCommentList>
            {
                comments.map(comment => {
                    return <Comment key={comment.id} comment={comment} author={author}/>
                })
            }
        </StyledCommentList>
    );
}

export default CommentList;