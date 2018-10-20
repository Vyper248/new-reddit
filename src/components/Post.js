import React from 'react';
import Comments from './Comments';
import './Post.css';

const Post = (props) => {
    let {title, body, comments, url, media, author} = props.postDetails;
    
    //check for image link to url and replace body with image if so
    let bodyTag = <div dangerouslySetInnerHTML={{ __html: body }}></div>;
    if (/.(png|jpg|jpeg|bmp)$/.test(url)){
        bodyTag = <img src={url} alt="Preview of content"/>
    }
    
    //if URL is too long, make shorter
    let shortUrl = url || '';
    if (shortUrl.length > 40) shortUrl = shortUrl.substr(0,40) + '...';
    
    //check for media embed and replace body with this
    if (media && media.length > 0){
        if (body.length > 0) media += '<br/>'+body;
        bodyTag = <div dangerouslySetInnerHTML={{ __html: media }}></div>
    }
    
    return (
        <div>
            {
                title.length === 0 ? <h1 className="loading">Loading...</h1> : (
                    <div className="postDiv">
                        <h1>{title}</h1>
                        <div className="postMiddle">
                            <span>{author}</span>
                            <a className="postGoToURL" href={url} target="_blank" rel="noopener noreferrer"> | Go to URL ({shortUrl})</a>
                        </div>
                        {bodyTag}
                        <hr/>
                        <Comments comments={comments} author={author} />
                    </div>
                )
            }
        </div>
    );
}

export default Post;