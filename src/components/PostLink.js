import React from 'react';
import { Link } from 'react-router-dom';
import './PostLink.css';

const PostLink = (props) => {
    const {sub, post} = props;
    
    //decide whether to show a thumbnail    
    let thumbnail = (
        <div className="postThumbnail">
            <img src={post.thumbnail} alt="Thumbnail for post" />
        </div>
    )

    if (/(.jpg|.png|.bmp|.jpeg)/.test(post.thumbnail) === false){
        thumbnail = <span></span>;
    }

    //toggle post body text open and closed
    function toggleBodyOpen(e){
        e.preventDefault();
        const postDiv = e.target.parentNode.parentNode.parentNode;
        const bodyDiv = postDiv.querySelector('.postLinkBody');

        bodyDiv.classList.toggle('open');
        if (bodyDiv.classList.contains('open')) e.target.innerText = '[ - ] ';
        else e.target.innerText = '[ + ] ';
    }
    
    //if there's a link to an image, replace that link with an img tag (maybe remove?)
    // const imageLinksInBodyFull = post.body.match(/<a href=.+?(\.(png|jpg|jpeg|bmp)).+?(<\/a>)/g);
    // if (imageLinksInBodyFull){
    //     imageLinksInBodyFull.forEach(linkTag => {
    //         const imageLinkInBody = linkTag.match(/"http([a-zA-Z0-9\W]+(.png|.jpg|.jpeg))"/)[0].replace(/"/g,'');
    //         post.body = post.body.replace(linkTag, '<img src="'+imageLinkInBody+'"/>');
    //     });
    // }
    
    //decide whether to show image preview in body
    let bodyTag = <div className="postLinkBody" dangerouslySetInnerHTML={{__html: post.body}}></div>;
    let bodyHasImage = false;
    if (post.url.match(/.jpg$/)){
        bodyTag = (<div className="postLinkBody">
            <img src={post.url} alt="Preview user linked to" />
        </div>);
        bodyHasImage = true;
    }
    
    //decide whether to show embeded media
    if (post.media.length > 0){
        if (post.body.length > 0) post.media += "<br/>"+post.body;
        bodyTag = <div className="postLinkBody" dangerouslySetInnerHTML={{__html: post.media}}></div>;
        bodyHasImage = true;
    }
    
    //decide whether to show an open button for post body
    let openBtn = (<span> - <span className="postLinkOpen" onClick={toggleBodyOpen}>[ + ] </span></span>);
    if (post.body.length === 0 && bodyHasImage === false) openBtn = <span></span>;
    
    //check if sticked and add another class
    let className = 'postLink';
    if (post.stickied) className += ' stickied';
    
    return (
        <div className={className}>
            {thumbnail}
            <div>
                <Link to={`${sub}/${post.id}`}>{post.title}</Link>
                <div className="postLinkMiddle">
                    <a className="postLinkDomain" href={post.url} target="_blank" rel="noopener noreferrer">{post.domain} - </a>
                    <span className="postLinkAuthor">{post.author}</span>
                    {openBtn}
                </div>
                {bodyTag}
                <div className="postLinkFooter">
                    <Link to={`${sub}/${post.id}`} className="postLinkComments">{post.num_comments} Comments </Link>
                    - <a className="postLinkReddit" href={'https://www.reddit.com'+post.permalink} target="_blank" rel="noopener noreferrer">Open on Reddit</a>
                </div>
            </div>
        </div>
    );
};

export default PostLink;



/*

score: data.score,
subreddit: data.subreddit,
*/