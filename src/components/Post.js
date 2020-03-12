import React, { useEffect } from 'react';
import styled from 'styled-components';
import { formatDistanceStrict } from 'date-fns';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { FaChevronDown } from 'react-icons/fa'

import CommentList from './CommentList';
import LoadingSpinner from './LoadingSpinner';

import { parseBodyText, updatePostDetails, getComments } from '../functions/useful';

const StyledPost = styled.div`
    background-color: black;
    padding: 20px;
    width: 100%;
    max-width: 1200px;
    margin: auto;

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

const Post = () => {
    const comments = useSelector(state => state.comments);
    const noComments = useSelector(state => state.noComments);
    let post = useSelector(state => state.postDetails);
    const currentPostId = useSelector(state => state.currentPostId);
    const commentSort = useSelector(state => state.commentSort);
    const isMobile = useMediaQuery({ maxWidth: 700 });

    useEffect(() => {
        //get quick details from posts array
        updatePostDetails();
        //query server for more details and comments
        getComments();
        window.scrollTo(0,0); 
    }, []);

    useEffect(() => {
        //if comment sort method is changed, then get comments again using new sorting
        getComments();
    }, [commentSort]);

    if (post.body === undefined || post.id !== currentPostId) {
        return <div style={{textAlign: 'center'}}><LoadingSpinner/></div>;
    }

    let {url, title, author, created, body, media, permalink} = post;  

    //get parsed body tag
    let bodyTag = parsePostBody(body, url, media);  

    //get relative time string
    let dateString = formatDistanceStrict(new Date(), created*1000);

    //if URL is too long, make shorter
    let shortUrl = url || '';
    if (shortUrl.length > 40) shortUrl = shortUrl.substr(0,40) + '...';

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

    return (
        <StyledPost>
            <div>
                <h2 dangerouslySetInnerHTML={{ __html: title}}></h2>
                <PostDetails>{author} | {dateString} | <a href={url} target="_blank" rel="noopener noreferrer">Go to URL ({shortUrl})</a></PostDetails>
                <PostDetails><a href={`https://www.reddit.com/${permalink}`} target="_blank" rel="noopener noreferrer">Open on Reddit</a></PostDetails>
                { bodyTag }
            </div>
            { comments.length === 0 && noComments === false ? <LoadingSpinner/> : null }
            { noComments ? <div>No Comments</div> : null }
            <CommentList comments={comments} author={author}/>
            <ScrollButton onClick={scrollToNext}><FaChevronDown/></ScrollButton>
        </StyledPost>
    );
}

const parsePostBody = (body, url, media) => {
    //make sure any links within the body open in a new tab
    body = body.replace(/<a/g, '<a target="_blank" rel="noopener noreferrer"');
    
    //make sure links to reddit users are adjusted
    body = body.replace(/href="\/u/g, 'href="https://www.reddit.com/$1');
    
    //but links to other reddit subs can be kept on this website
    body = body.replace(/target="_blank" rel="noopener noreferrer" href="\/r/g, 'href="#');    
    
    //check for image link to url and replace body with image if so
    let bodyTag = <PostBody dangerouslySetInnerHTML={{ __html: body }} className="postDivBody"></PostBody>;
    if (/.(png|jpg|jpeg|bmp)$/.test(url)){
        bodyTag = <PostBody><img src={url} alt="Preview of content"/></PostBody>;
    }

    //check for media embed and replace body with this
    if (media && media.oembed){
        media = parseBodyText(media.oembed.html);
        if (body.length > 0) media += '<br/>'+body;
        bodyTag = <PostBody dangerouslySetInnerHTML={{ __html: media }} className="postDivBody"></PostBody>;
    } else {
        media = '';
    }

    return bodyTag;
}

export default Post;