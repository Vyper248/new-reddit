import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaRegComment, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { formatDistanceStrict } from 'date-fns';

import { parseLinks, parseBodyText, parseFlair } from '../functions/useful';

import PostTitle from './Styled/PostTitle';
import PostTextGroup from './Styled/PostTextGroup';
import PostDetails from './Styled/PostDetails';
import PostExpand from './Styled/PostExpand';
import Flair from './Styled/Flair';
import Spoiler from './Spoiler';

const StyledPostLink = styled.div`
    border: 1px solid ${props => props.stickied ? '#50ec11' : 'red'};
    padding: 0px 0px 0px 10px;
    margin: 5px auto;
    width: 95%;
    max-width: 1200px;
    display: flex;
    position: relative;
`;

const PostThumbnail = styled.div`
    min-width: 70px;
    max-width: 70px;
    max-height: 70px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 10px;
    margin-top: 10px;

    & > img {
        height: 70px;
        width: auto;
        margin: auto;
    }
`;

const PostComments = styled.div`
    font-size: 0.9em;
    display: inline-block;
    margin-bottom: 10px;
    cursor: pointer;

    & > span > svg {
        position: relative;
        top: 2px;
        margin-left: 2px;
    }
`;

const PostBody = styled.div`
    padding: 5px;
    overflow: hidden;

    & img {
        max-width: 95%;
        max-height: 900px;
    }

    p.bodyImage {
        max-width: fit-content;

        & img {
            max-width: 100%;
        }
    
        & span {
            display: block;
            font-size: 0.8em;
            color: #AAA;
            text-align: center;
        }
    }

    & iframe {
        max-width: 100%;
        margin: auto;
        display: block;
    }

    & a {
     color: rgb(0, 225, 255);
    }

    & .embedly-card-hug {
        background-color: white;
        margin: 5px !important;
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

    & blockquote {
        color: #AAA;
        border-left: 2px solid #333;
        padding-left: 10px;
        margin-inline-start: 10px;
    }
`;

const SpoilerTag = styled.span`
    background-color: red;
    margin-right: 10px;
    font-weight: bold;
    padding: 2px;
    text-transform: uppercase;
    font-size: 0.8em;
`;

const PostLink = ({ post, onClickLink, currentSub, currentSort, onClickFlair=()=>{} }) => {
    const [expanded, setExpanded] = useState(false);

    const onToggleExpand = () => {
        setExpanded(!expanded);
    }

    if (post === undefined) return <span></span>;

    //get relative time string
    let dateString = formatDistanceStrict(new Date(), post.created*1000);

    //set whether to show a thumbnail or not
    let showThumbnail = false;
    if (/(.jpg|.png|.bmp|.jpeg)/.test(post.thumbnail) === true) showThumbnail = true;

    //make sure any links within the body open in a new tab
    post.body = parseLinks(post.body, true);
    post.title = parseBodyText(post.title);

    //decide whether to show image preview in body
    let bodyContent = <PostBody dangerouslySetInnerHTML={{__html: post.body}}></PostBody>;
    let bodyHasImage = false;
    if (post.url.match(/.(jpg|png|bmp|gif|jpeg)$/)){
        bodyContent = (<PostBody><img src={post.url} alt="Preview user linked to" /></PostBody>);
        bodyHasImage = true;
    }

    //decide whether to show embeded media
    if (post.media.length > 0){
        if (post.body.length > 0) post.media += "<br/>"+post.body;
        let media = parseLinks(post.media);
        bodyContent = <PostBody dangerouslySetInnerHTML={{__html: media}}></PostBody>;
        bodyHasImage = true;
    }

    //show embedded reddit video
    if (post.url.includes('v.redd.it')) {        
        let url = `https://www.reddit.com${post.permalink}?ref=share&ref_source=embed`;
        bodyContent = <PostBody>
            <blockquote className="reddit-card">
                <a href={url} target="_blank" rel="noopener noreferrer">{post.title}</a>
            </blockquote>
        </PostBody>;
        bodyHasImage = true;
    }

    //decide whether to show an open button for post body
    let openBtn = true;
    if (post.body.length === 0 && bodyHasImage === false) openBtn = false;
    
    //check if sticked and add another class
    let stickied = post.stickied ? true : false;

    //get flair
    let flair = parseFlair(post.link_flair_text);
    let flairColor = post.link_flair_text_color;
    let flairBgColor = post.link_flair_background_color;
    if (!flairBgColor || flairBgColor?.length === 0) {
        flairBgColor = 'white';
        flairColor = 'black';
    }

    return (
        <StyledPostLink stickied={stickied}>
            { showThumbnail ? <PostThumbnail><img src={post.thumbnail} alt="Thumbnail"/></PostThumbnail> : null }
            <div style={ showThumbnail ? {width: '100%', maxWidth: 'calc(100% - 80px)'} : {width: '100%', maxWidth: '100%'}}>
                { openBtn ? <PostExpand onClick={onToggleExpand} stickied={stickied}>{ expanded ? <FaChevronUp/> : <FaChevronDown/> }</PostExpand> : null }
                <PostTextGroup>
                    <div>
                        <PostTitle>
                            { flair.length > 0 ? <Flair color={flairColor} backgroundColor={flairBgColor} onClick={onClickFlair(post.link_flair_text)}>{flair}</Flair> : null }
                            <span onClick={onClickLink(`/${currentSub}/comments/${post.id}`)}>{post.title}</span>
                        </PostTitle>
                        <PostDetails>
                            <NavLink to={`/${post.subreddit}/${currentSort}`}>{post.subreddit}</NavLink>{ post.url.includes('v.redd.it') ? <span> - video</span> : <span> - <a href={post.url} target="_blank" rel='noreferrer noopener'>{post.domain}</a></span> } - <span>{dateString}</span>
                        </PostDetails>
                        { expanded ? <Spoiler spoiler={post.spoiler}>{bodyContent}</Spoiler> : null }
                        <div>
                            { post.spoiler ? <SpoilerTag>Spoiler</SpoilerTag> : null }
                            <PostComments><span onClick={onClickLink(`/${currentSub}/comments/${post.id}`)}>{post.num_comments} <FaRegComment/></span></PostComments>
                            <span style={{marginLeft: '15px'}}><a href={`https://www.reddit.com${post.permalink}`} target="_blank" rel="noreferrer noopener">Open on Reddit</a></span>
                        </div>
                    </div>
                </PostTextGroup>
            </div>
        </StyledPostLink>
    );
}

const areEqual = (prevProps, nextProps) => {    
    if (prevProps.post.id === nextProps.post.id) return true;
    return false;
}

export default React.memo(PostLink, areEqual);