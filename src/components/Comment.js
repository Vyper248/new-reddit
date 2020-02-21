import React, { useState } from 'react';
import styled from 'styled-components';

import Comments from './CommentList';

const StyledComment = styled.div`
    padding: 5px;
    padding-bottom: 0px;
    border-left: 1px solid red;
    border-top: 1px solid red;
    margin-bottom: 0px;

    & a {
        color: rgb(0, 225, 255);
    }
`;

const CommentClose = styled.span`
    :hover {
        cursor: pointer;
    }
`;

const CommentAuthor = styled.span`
    ${props => props.original ? `
        color: #059afe; 
        font-weight: bold;
    ` : ''};
`;

const CommentFooter = styled.div`
    font-size: 0.8em;
    margin-bottom: 5px;
    
    & > a {
        color: gray;
    }
`;

const Comment = ({comment, author}) => {  
    const [closed, setClosed] = useState(false);

    //if there are any replies to this comment, create a new Comments object (will work recursively)
    let replies = "";
    if (comment.replies.length > 0){
        replies = <Comments comments={comment.replies} author={author}/>;
    }

    //make sure any links within the body open in a new tab
    comment.body_html = comment.body_html.replace(/<a/g, '<a target="_blank" rel="noopener noreferrer"');
    
    //make sure links to reddit are adjusted
    comment.body_html = comment.body_html.replace(/href="\/u/, 'href="https://www.reddit.com/$1');

    const toggleClosed = () => {
        setClosed(!closed);
    }

    return (
        <StyledComment>
            <CommentClose onClick={toggleClosed}>{ closed ? '[ + ] ' : '[ - ] ' }</CommentClose>
            <CommentAuthor original={comment.author === author}>{comment.author}</CommentAuthor>
            <span style={{color: 'gray'}}> | {comment.score}</span>
            { closed ? null : <div dangerouslySetInnerHTML={{ __html: comment.body_html }}></div> }
            { closed ? null : <CommentFooter><a href={`https://www.reddit.com/${comment.permalink}`} target="_blank" rel="noreferrer noopener">Permalink</a></CommentFooter> }
            { closed ? null : replies }
        </StyledComment>
    );
}

export default Comment;