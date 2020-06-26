import React, { useState } from 'react';
import styled from 'styled-components';
import { formatDistanceStrict } from 'date-fns';

import { parseLinks } from '../functions/useful';

import CommentList from './CommentList';

const StyledComment = styled.div`
    padding: 5px;
    padding-bottom: 0px;
    border-left: 1px solid red;
    border-top: 1px solid red;
    margin-bottom: 0px;

    ${props => {
        if (props.single) {
            return `
                border: 1px solid red;
                width: 95%;
                max-width: 1200px;
                margin: 5px auto;
            `;
        }
    }}

    & a {
        color: rgb(0, 225, 255);
    }

    & pre {
        overflow: scroll;
    }
`;

const CommentClose = styled.span`
    :hover {
        cursor: pointer;
    }
`;

const CommentAuthor = styled.a`
    color: white !important;

    ${props => props.original ? `
        color: #059afe !important; 
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

const CommentLinkTitle = styled.div`
    margin-bottom: 10px;

    :hover {
        cursor: pointer;
    }
`;

const Comment = ({comment, author, single=false, onClickLink}) => {  
    const [closed, setClosed] = useState(false);

    //if there are any replies to this comment, create a new Comments object (will work recursively)
    let replies = "";
    if (comment.replies.length > 0){
        replies = <CommentList comments={comment.replies} author={author}/>;
    }

    let body_html = parseLinks(comment.body_html);

    //get relative time string
    let dateString = comment.created_utc !== undefined ? formatDistanceStrict(new Date(), comment.created_utc*1000) : '';

    let pointString = comment.score === 1 || comment.score === -1 ? 'point' : 'points';

    const toggleClosed = () => {
        setClosed(!closed);
    }    

    return (
        <StyledComment single={single}>
            { single ? <CommentLinkTitle onClick={onClickLink(`/${comment.subreddit}/comments/${comment.link_id.replace('t3_','')}`)}>{comment.link_title}<span style={{color: 'gray'}}> | {comment.subreddit}</span> </CommentLinkTitle> : null }
            { single ? null : <CommentClose onClick={toggleClosed}>{ closed ? '[ + ] ' : '[ - ] ' }</CommentClose> }
            { single ? null : <CommentAuthor original={comment.author === author} href={`#/user/${comment.author}`}>{comment.author}</CommentAuthor> }
            <span style={{color: 'gray'}}> {single ? '' : '|'} {comment.score} {pointString}{dateString.length > 0 ? ` | ${dateString}` : ''}</span>
            { closed ? null : <div dangerouslySetInnerHTML={{ __html: body_html }}></div> }
            { closed ? null : <CommentFooter><a href={`https://www.reddit.com/${comment.permalink}`} target="_blank" rel="noreferrer noopener">Permalink</a></CommentFooter> }
            { closed ? null : replies }
        </StyledComment>
    );
}

export default Comment;