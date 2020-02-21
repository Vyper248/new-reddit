import ReactDOM from 'react-dom';

const parseComment = (comment) => {
    let {body_html, id, author, permalink, replies, score} = comment;
    body_html = parseBodyText(body_html);
    
    replies = typeof replies === 'object' ? replies.data.children : [];
    
    replies = replies.map(comment => {
        //console.log(comment);
        return parseComment(comment.data);
    });
    
    return {body_html, id, author, permalink, replies, score};
}

const parseBodyText = (text) => {
    text ? text = text
                    .replace(/&lt;/g,'<')
                    .replace(/&gt;/g,'>')
                    .replace(/&amp;#39;/g,"'")
                    .replace(/&amp;quot;/g,'"')
                    .replace(/&amp;/g,"&")
                    .replace(/&#x200B;/g,' ')
                        : text = '';
    return text;
}

const parseURL = (url) => {
    let parts = url.split('/');
    let sub, newSort, postId;

    if (parts.length > 0) {
        parts[1] !== undefined ? sub = parts[1] : sub = '';
        parts[2] === 'comments' ? postId = parts[3] : postId = '';
        parts[2] !== 'comments' ? newSort = parts[2] : newSort = '';
    }

    return {sub, newSort, postId};
}

const getPostList = async (sub, sort, setPosts) => {
    if (sub.length > 0) sub = 'r/'+sub;
    setPosts([]);

    if (sub === 'r/My Subreddits') {        
        let storedSubs = localStorage.getItem('subs');
        storedSubs = storedSubs ? JSON.parse(storedSubs) : [];
        sub = 'r/'+storedSubs.join('+');
    }
    
    try {
        let url = `https://www.reddit.com/${sub}/${sort}/.json`;
        if (sub.length === 0) url = 'https://www.reddit.com/.json';

        let response = await fetch(url);
        let data = await response.json();

        if (data.error){
            console.log('Getting Post List - Error: ', data.error);
        } else {
            if (data && data.data && data.data.children){
                let posts = data.data.children.map(post => {
                    const data = post.data;

                    let media = data.media;
                    if (media && media.oembed){
                        media = parseBodyText(media.oembed.html);
                    } else {
                        media = '';
                    }
                    
                    return {
                        created: data.created_utc,
                        author: data.author,
                        domain: data.domain,
                        title: parseBodyText(data.title),
                        id: data.id,
                        body: parseBodyText(data.selftext_html),
                        num_comments: data.num_comments,
                        score: data.score,
                        subreddit: data.subreddit,
                        stickied: data.stickied,
                        url: data.url,
                        thumbnail: data.thumbnail, //if no thumbnail - "self"
                        permalink: data.permalink,
                        media: media
                    };
                });
                                
                setPosts(posts);
            }
        }
    } catch (error) {
        console.log('Getting Post List - URL Error: ', error);
        setPosts([]);
    }
};

const getComments = async (url, setComments, setNoComments, setPostDetails, getDetails) => {    
    ReactDOM.unstable_batchedUpdates(() => {
        setComments([]);
        setNoComments(false);
    });
    try {        
        let response = await fetch('https://www.reddit.com/r/'+url+'.json?sort=new');
        let data = await response.json();
        
        if (data.error){
            console.log('Getting Comments - Error: ', data.error);
        } else {
            let {title, selftext_html, id, url, media, author, created_utc, permalink} = data[0].data.children[0].data;

            let comments = data[1].data.children.map(obj => {
                return parseComment(obj.data);
            });

            ReactDOM.unstable_batchedUpdates(() => {
                if (getDetails) setPostDetails({id, url, title, author, created:created_utc, body: parseBodyText(selftext_html), media, permalink});
                setComments(comments);
                if (comments.length === 0) setNoComments(true);
            });
        }
    } catch (error) {
        console.log('Getting Comments - URL Error: ', error);
    }
};

export {
    parseComment, 
    parseBodyText,
    parseURL,
    getPostList,
    getComments
}