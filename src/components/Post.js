import React, { useEffect } from 'react';
import styled from 'styled-components';
import { formatDistanceStrict } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { FaChevronDown } from 'react-icons/fa'

import CommentList from './CommentList';
import LoadingSpinner from './Styled/LoadingSpinner';

import { parseBodyText, parseLinks, updatePostDetails, getComments } from '../functions/useful';

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
`;

const PostDetails = styled.div`
    color: gray;
    text-align: left;
    margin-bottom: 5px;

    & a {
        color: gray;
    }
`;

const PostBody = styled.div`
    border-bottom: 1px solid gray;
    margin-bottom: 5px;
    padding-bottom: 10px;

    & pre {
        overflow: scroll;
    }

    & > img {
        max-width: 100%;
        margin-top: 10px;
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
`;

const SimpleButton = styled.span`
    :hover {
        cursor: pointer;
    }
`

const Post = () => {
    const dispatch = useDispatch();

    const comments = useSelector(state => state.comments);
    const noComments = useSelector(state => state.noComments);
    let post = useSelector(state => state.postDetails);
    const currentPostId = useSelector(state => state.currentPostId);
    const commentSort = useSelector(state => state.commentSort);
    const currentSub = useSelector(state => state.currentSub);
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
    }, [commentSort, currentPostId]);

    if (post.body === undefined || post.id !== currentPostId) {
        return <div style={{textAlign: 'center'}}><LoadingSpinner/></div>;
    }

    let {url, title, author, created, body, media, permalink, media_embed} = post;

    //check if post is a link to another post and make sure it goes there locally and not on a new page
    let urlMatches = url.match(/\/r\/[a-zA-Z0-9]+\/comments\/[a-zA-Z0-9]+/g);
    let localUrl = undefined;
    if (urlMatches && urlMatches.length > 0) {
        let match = urlMatches[0];
        let sub = match.match(/r\/([a-zA-Z0-9]+)/)[1];
        let id = match.match(/comments\/([a-zA-Z0-9]+)/)[1];
        let alreadyHere = sub === currentSub && id === currentPostId;
        if (sub !== undefined && id !== undefined && !alreadyHere) localUrl = `/#/${sub}/comments/${id}`;
    }
    

    //get parsed body tag
    let bodyTag = parsePostBody(body, url, media, media_embed);  

    //get relative time string
    let dateString = formatDistanceStrict(new Date(), created*1000);

    //if URL is too long, make shorter
    let shortUrl = url || '';
    if (shortUrl.length > 40) shortUrl = shortUrl.substr(0,40) + '...';

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
        localStorage.setItem('saved', JSON.stringify(newSaved));
    }

    let urlTag = <a href={url} target="_blank" rel="noopener noreferrer"> | Go to URL ({shortUrl})</a>;
    if (localUrl !== undefined) urlTag = <a href={localUrl}> | Go to Post ({shortUrl})</a>;
    if (url.includes('v.redd.it')) urlTag = <a href={`https://www.reddit.com${permalink}`} target="_blank" rel="noopener noreferrer"> | Video</a>;

    return (
        <StyledPost>
            <div>
                <h2 dangerouslySetInnerHTML={{ __html: title}}></h2>
                <PostDetails>{author} | {dateString} { urlTag }</PostDetails>
                <PostDetails><a href={`https://www.reddit.com${permalink}`} target="_blank" rel="noopener noreferrer">Open on Reddit</a> - <SimpleButton onClick={onSavePost}>{ isSaved ? 'Unsave' : 'Save' }</SimpleButton></PostDetails>
                { bodyTag }
            </div>
            { comments.length === 0 && noComments === false ? <LoadingSpinner/> : null }
            { noComments ? <div>No Comments</div> : null }
            <CommentList comments={comments} author={author}/>
            <ScrollButton onClick={scrollToNext}><FaChevronDown/></ScrollButton>
        </StyledPost>
    );
}

const parsePostBody = (body, url, media, media_embed) => {
    body = parseLinks(body);
    
    //check for image link to url and replace body with image if so
    let bodyTag = <PostBody dangerouslySetInnerHTML={{ __html: body }} className="postDivBody"></PostBody>;
    if (/.(png|jpg|jpeg|bmp)$/.test(url)){
        bodyTag = <PostBody><img src={url} alt="Preview of content"/></PostBody>;
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
        media = parseBodyText(media.oembed.html);
        media = parseLinks(media);
        if (body.length > 0) media += '<br/>'+body;
        bodyTag = <PostBody dangerouslySetInnerHTML={{ __html: media }} className="postDivBody"></PostBody>;
    } else {
        media = '';
    }
    
    return bodyTag;
}

export default Post;