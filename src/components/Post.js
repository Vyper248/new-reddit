import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formatDistanceStrict } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { FaChevronDown } from 'react-icons/fa'

import CommentList from './CommentList';
import Gallery from './Gallery';
import Spoiler from './Spoiler';
import LoadingSpinner from './Styled/LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';
import Crosspost from './Crosspost';
import UserStats from './UserStats/UserStats';

import { parseBodyText, parseLinks, updatePostDetails, getComments, getLocalUrl } from '../functions/useful';

const StyledPost = styled.div`
    background-color: black;
    padding: 20px;
    width: 100%;
    max-width: 1200px;
    margin: auto;
    margin-bottom: 30px;

    & h1 {
        text-align: left;
        margin-bottom: 10px;
    }

    & > div > h2 {
        word-break: break-word;
    }
`;

const PostDetails = styled.div`
    color: gray;
    text-align: left;
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;

    & a {
        color: gray;
        white-space: nowrap;
    }

    & #statBtn {
        :hover {
            cursor: pointer;
        }
    }
`;

const PostBody = styled.div`
    border-bottom: 1px solid gray;
    margin-bottom: 5px;
    padding-bottom: 10px;

    & pre {
        overflow: auto;
    }

    & > img {
        max-width: 100%;
        margin-top: 10px;
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

    & iframe.youtube {
        width: 712px;
        height: 400px;
        max-width: 100%;
    }
    
    & iframe {
        max-width: 100%;
        margin: auto;
        display: block;
    }

    & a {
     color: rgb(0, 225, 255);
    }

    & h1 {
        font-size: 1.2em;
    }

    & h2 {
        font-size: 1.1em;
    }

    & h3 {
        font-size: 1em;
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

    @media screen and (max-width: 550px) {
        & iframe.youtube {
            width: auto;
            height: auto;
            max-width: auto;
        }
    }
`;

const ScrollButton = styled.div`
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 50px;
    height: 50px;
    border: 1px solid red;
    background-color: black;
    border-radius: 50%;
    text-align: center;

    & > svg {
        position: relative;
        top: 10px;
        font-size: 2em;
    }

    :hover {
        cursor: pointer;
        background-color: gray;
    }

    @media screen and (max-width: 700px) {
        :hover {
            background-color: black;
        }
    }
`;

const SimpleButton = styled.span`
    :hover {
        cursor: pointer;
    }
`

const Post = () => {
    const dispatch = useDispatch();
    const [showStats, setShowStats] = useState(false);

    const comments = useSelector(state => state.comments);
    const noComments = useSelector(state => state.noComments);
    let post = useSelector(state => state.postDetails);
    const currentPostId = useSelector(state => state.currentPostId);
    const commentSort = useSelector(state => state.commentSort);
    const currentSub = useSelector(state => state.currentSub);
    const permalinkUrl = useSelector(state => state.permalinkUrl);
    const showContext = useSelector(state => state.showContext);
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const saved = useSelector(state => state.saved);
    const setSaved = (val) => dispatch({type: 'SET_SAVED', payload: val});

    useEffect(() => {
        //get quick details from posts array
        updatePostDetails();
        window.scrollTo(0,0); 
    }, []);

    useEffect(() => {
        //if comment sort method or post Id is changed, then get comments again using new values        
        getComments();
    }, [commentSort, currentPostId, permalinkUrl, showContext]);

    if (post.body === undefined || post.id !== currentPostId) {
        return <div style={{textAlign: 'center'}}><LoadingSpinner/></div>;
    }

    let {url, title, author, created, body, media, permalink, media_embed, media_metadata, is_gallery, gallery_data, spoiler, crosspost_parent_list} = post;

    document.title = `New Reddit - ${currentSub} - ${title}`;

    let localUrl = getLocalUrl(url, currentSub, currentPostId);
    

    //get parsed body tag
    let bodyTag = parsePostBody(body, url, media, media_embed, permalink, title, currentSub, media_metadata, is_gallery, gallery_data, crosspost_parent_list);  

    //get relative time string
    let dateString = formatDistanceStrict(new Date(), created*1000);

    //check if post is saved
    let isSaved = saved.find(obj => obj.id === currentPostId) !== undefined;

    //find the next comment that's not at the top and scroll to it
    const scrollToNext = () => {
        const commentDiv = document.querySelector('#commentList');
        for (let i = 0; i < commentDiv.children.length; i++) {
            let child = commentDiv.children[i];
            let rect = child.getBoundingClientRect();            
            if (rect.top < 1 || (isMobile && rect.top < 41)) continue;
            else {
                child.scrollIntoView();
                //adjust for the top menu on mobile devices
                if (isMobile) {
                    const el = document.scrollingElement || document.documentElement;
                    el.scrollTop -= 40;
                }
                break;
            }
        }
    }

    const onSavePost = () => {
        let newSaved;
        if (isSaved) {
            newSaved = saved.filter(obj => obj.id !== post.id);
        } else {
            let link = `/${currentSub}/comments/${post.id}`;
            newSaved = [...saved, {id: currentPostId, title: title, url: link, sub: currentSub}];
        }

        setSaved(newSaved);
    }

    const onClickToggleStats = () => {
        setShowStats(val => !val);
    }

    let urlTag = <a href={url} target="_blank" rel="noopener noreferrer"> Go to URL ({url || ''})</a>;
    if (localUrl !== undefined) urlTag = <a href={localUrl}> Go to Post ({url || ''})</a>;
    if (url.includes('v.redd.it')) urlTag = <a href={`https://www.reddit.com${permalink}`} target="_blank" rel="noopener noreferrer"> Go to Video</a>;

    let hasContext = comments[0] !== undefined ? comments[0].hasContext : false;

    return (
        <StyledPost>
            <div>
                <h2 dangerouslySetInnerHTML={{ __html: title}}></h2>
                <PostDetails><a href={`#/user/${author}`}>{author}</a> | <span id='statBtn' onClick={onClickToggleStats}>{ showStats ? 'Hide Stats' : 'Show Stats'}</span> | {dateString}</PostDetails>
                <PostDetails>{ urlTag }</PostDetails>
                <PostDetails><a href={`https://www.reddit.com${permalink}`} target="_blank" rel="noopener noreferrer">Open on Reddit</a> - <SimpleButton onClick={onSavePost}>{ isSaved ? 'Unsave' : 'Save' }</SimpleButton></PostDetails>
                { showStats ? <UserStats username={author}/> : null }
                <Spoiler spoiler={spoiler}>
                    { bodyTag }
                </Spoiler>
            </div>
            { comments.length === 0 && noComments === false ? <LoadingSpinner/> : null }
            { noComments ? <div>No Comments</div> : null }
            { permalinkUrl.length > 0 ? <a href={`#/${currentSub}/comments/${currentPostId}`}>Show All Comments</a> : null }
            { permalinkUrl.length > 0 && hasContext ? <span> - <a href={`#/${currentSub}/comments/${currentPostId}/${permalinkUrl}/?context=10000`}>Show Context</a></span> : null }
            <CommentList comments={comments} author={author}/>
            <ScrollButton onClick={scrollToNext}><FaChevronDown/></ScrollButton>
        </StyledPost>
    );
}

export const parsePostBody = (body, url, media, media_embed, permalink, title, currentSub, media_metadata, is_gallery, gallery_data, crosspost_parent_list) => {
    body = parseLinks(body, true);

    //check for crosspost
    if (crosspost_parent_list !== undefined) {
        let data = crosspost_parent_list[0];
        return <PostBody className="postDivBody">
            <Crosspost data={data}/>
        </PostBody>
    }
    
    //check for image link to url and replace body with image if so
    let bodyTag = <PostBody dangerouslySetInnerHTML={{ __html: body }} className="postDivBody"></PostBody>;
    if (/.(png|jpg|jpeg|bmp|gif)$/.test(url)){
        //keep body here in case user added extra text
        bodyTag = <PostBody>
                    <img src={url} alt="Preview of content"/>
                    <div dangerouslySetInnerHTML={{ __html: body }}></div>
                  </PostBody>;
    }

    //check for a live update thread
    if (media && media.type === 'liveupdate') {        
        let content = parseBodyText(media_embed.content);
        content = content.replace('iframe src', 'iframe width="100%" src');
        bodyTag = <PostBody dangerouslySetInnerHTML={{ __html: content }} className="postDivBody"></PostBody>;
        return bodyTag;
    }

    //check for media embed and replace body with this
    if (media && media.oembed){
        let mediaHTML = parseBodyText(media.oembed.html);
        mediaHTML = parseLinks(mediaHTML);
        if (body.length > 0) mediaHTML += '<br/>'+body;
        if (media.type === 'youtube.com') mediaHTML = mediaHTML.replace('<iframe', '<iframe class="youtube"');
        bodyTag = <PostBody dangerouslySetInnerHTML={{ __html: mediaHTML }} className="postDivBody"></PostBody>;
    } else {
        media = '';
    }

    if (is_gallery) {
        return (
            <PostBody className="postDivBody">
                <ErrorBoundary>
                    <Gallery data={media_metadata} extraData={gallery_data}/>
                </ErrorBoundary>
                <div dangerouslySetInnerHTML={{ __html: body }}></div>
            </PostBody>
        )
    }

    if (url.includes('v.redd.it')) {
        let url = `https://www.reddit.com${permalink}?ref=share&ref_source=embed`;
        bodyTag = <PostBody className="postDivBody">
                    <blockquote className="reddit-card">
                        <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
                    </blockquote>
                  </PostBody>
    }
    
    return bodyTag;
}

export default Post;