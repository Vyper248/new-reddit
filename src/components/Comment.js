import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { formatDistanceStrict } from 'date-fns';

import { parseLinks, getMoreComments, parseBodyText } from '../functions/useful';

import CommentList from './CommentList';

const StyledComment = styled.div`
    padding: 5px;
    padding-bottom: 0px;
    border-left: 1px solid red;
    border-top: 1px solid red;
    margin-bottom: 0px;
    transition: border-left 0.5s;

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

    :hover {
        border-left: 1px solid #fcc203;
    }

    & .md-spoiler-text {
        display: inline-block;
        background-color: gray;
        color: gray;
        transition: 0.3s;
    }

    & .md-spoiler-text:hover {
        background-color: transparent;
        color: white;
        transition: 1s;
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
    color: gray;

    & > span:hover, & > div:hover {
        cursor: pointer;
    }

    & > div {
        margin-top: 10px;
        font-size: 1.2em;
        display: inline-block;
    }
    
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
    const extraComments = useSelector(state => state.extraComments);
    const permalinkUrl = useSelector(state => state.permalinkUrl);

    let permalinkId = permalinkUrl.split('/')[1];
    let permalinkComment = permalinkId === comment.id;

    //test if extra comments have been loaded for this one
    let extras = extraComments.find(obj => obj.id === comment.id && comment.kind !== 'more');
    if (extras !== undefined) {                
        extras = extras.replies;
    } else {
        extras = [];
    }

    //if there are any replies to this comment, create a new Comments object (will work recursively)
    let replies = "";
    if (extras.length > 0) {
        replies = <CommentList comments={extras} author={author}/>;
    } else if (comment.replies.length > 0) {
        replies = <CommentList comments={comment.replies} author={author}/>;
    }

    let body_html = parseLinks(comment.body_html);

    //get relative time string
    let dateString = comment.created_utc !== undefined ? formatDistanceStrict(new Date(), comment.created_utc*1000) : '';

    let pointString = comment.score === 1 || comment.score === -1 ? 'point' : 'points';

    const toggleClosed = () => {
        setClosed(!closed);
    }        

    const getMore = () => {
        getMoreComments(comment.id, comment.permalink);
    }

    //dont' currently support getting more top level comments, so don't show anything
    if (comment.kind === 'more' && comment.permalink.length === 0) return null;

    return (
        <StyledComment single={single}>
            { single ? <CommentLinkTitle onClick={onClickLink(`/${comment.subreddit}/comments/${comment.link_id.replace('t3_','')}`)}>{parseBodyText(comment.link_title)}<span style={{color: 'gray'}}> | {comment.subreddit}</span> </CommentLinkTitle> : null }
            { single ? null : <CommentClose onClick={toggleClosed}>{ closed ? '[ + ] ' : '[ - ] ' }</CommentClose> }
            { single ? null : <CommentAuthor original={comment.author === author} href={`#/user/${comment.author}`}>{comment.author}</CommentAuthor> }
            { comment.kind === 'more' ? null : <span style={{color: 'gray'}}> {single ? '' : '|'} {comment.score} {pointString}{dateString.length > 0 ? ` | ${dateString}` : ''}</span> }
            { closed ? null : <div dangerouslySetInnerHTML={{ __html: body_html }} style={permalinkComment ? {backgroundColor: 'rgba(150,150,0,0.3)'} : {}}></div> }
            { closed ? null : (
                <CommentFooter>
                    { comment.kind !== 'more' ? <a href={`https://www.reddit.com/${comment.permalink}`} target="_blank" rel="noreferrer noopener">Permalink</a> : null }
                    { single ? <span onClick={onClickLink(comment.permalink.replace('r/',''))}> | Go to comment</span> : null }
                    { comment.kind === 'more' ? <div onClick={getMore}>Load More</div> : null }
                </CommentFooter>) }
            { closed ? null : replies }
        </StyledComment>
    );
}

export default Comment;