import React, { useState } from 'react';
import styled from 'styled-components';

import CommentList from './CommentList';

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
        replies = <CommentList comments={comment.replies} author={author}/>;
    }

    let body_html = parseBody(comment.body_html);

    const toggleClosed = () => {
        setClosed(!closed);
    }

    return (
        <StyledComment>
            <CommentClose onClick={toggleClosed}>{ closed ? '[ + ] ' : '[ - ] ' }</CommentClose>
            <CommentAuthor original={comment.author === author}>{comment.author}</CommentAuthor>
            <span style={{color: 'gray'}}> | {comment.score}</span>
            { closed ? null : <div dangerouslySetInnerHTML={{ __html: body_html }}></div> }
            { closed ? null : <CommentFooter><a href={`https://www.reddit.com/${comment.permalink}`} target="_blank" rel="noreferrer noopener">Permalink</a></CommentFooter> }
            { closed ? null : replies }
        </StyledComment>
    );
}

const parseBody = (body) => {    
    //make sure any links within the body open in a new tab
    let newBody = body.replace(/<a/g, '<a target="_blank" rel="noopener noreferrer"');
    
    //make sure links to reddit are adjusted
    newBody = newBody.replace(/href="\/u/g, 'href="https://www.reddit.com/$1');

    //but links to other reddit subs can be kept on this website
    newBody = newBody.replace(/target="_blank" rel="noopener noreferrer" href="\/r/g, 'href="#');

    return newBody; 
}

export default Comment;