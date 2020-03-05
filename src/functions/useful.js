import store from '../redux/store';
import { batch } from 'react-redux';

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
    let sub = '';
    let newSort = '';
    let postId = '';

    if (parts.length > 0) {
        parts[1] !== undefined ? sub = parts[1] : sub = '';
        parts[2] === 'comments' && parts[3] !== undefined ? postId = parts[3] : postId = '';
        parts[2] !== 'comments' && parts[2] !== undefined ? newSort = parts[2] : newSort = '';
    }    

    return {sub, newSort, postId};
}

const getPostList = async (loadMore=false) => {
    const state = store.getState();
    let { posts, currentSub, currentSort, currentSearch, currentSearchSort, currentSearchSub, latestPost } = state;
    const setLatestPost = (val) => store.dispatch({type: 'SET_LATEST_POST', payload: val});
    const setPosts = (val) => store.dispatch({type: 'SET_POSTS', payload: val});
    const setNoPosts = (val) => store.dispatch({type: 'SET_NO_POSTS', payload: val});

    //if no sub, then don't get anything
    if (currentSub.length === 0) return;

    if (currentSub.length > 0) currentSub = 'r/'+currentSub;    
    if (!loadMore) setPosts([]);

    if (currentSub === 'r/My Subreddits') {        
        let storedSubs = localStorage.getItem('subs');
        storedSubs = storedSubs ? JSON.parse(storedSubs) : [];
        currentSub = 'r/'+storedSubs.join('+');
        if (storedSubs.length === 0) currentSub = '/r/All';
    }
    
    try {
        let url = `https://www.reddit.com/${currentSub}/${currentSort}/.json`;
        if (loadMore) url += `?after=t3_${latestPost}`;

        if (currentSearch.length > 0) {
            let parsedStr = currentSearch.split(' ').join('+');
            url = `https://www.reddit.com/${currentSub}/search.json?q=${parsedStr}${currentSearchSub ? '&restrict_sr=on' : ''}&include_over_18=on&sort=${currentSearchSort}`;
            if (loadMore) url += `&after=t3_${latestPost}`;
        }

        if (currentSub.length === 0) url = 'https://www.reddit.com/.json';        

        let response = await fetch(url);
        let data = await response.json();

        if (data.error){
            console.log('Getting Post List - Error: ', data.error);
            if (!loadMore) {
                batch(() => {
                    setNoPosts(true);
                    setPosts([]);
                });
            }
        } else {
            if (data && data.data && data.data.children){
                let newPosts = data.data.children.map(post => {
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

                if (loadMore) newPosts = [...posts, ...newPosts];

                batch(() => {
                    setLatestPost(newPosts[newPosts.length-1].id);                                
                    setPosts(newPosts);
                });
            }
        }
    } catch (error) {
        console.log('Getting Post List - URL Error: ', error);
        if (!loadMore) {
            batch(() => {
                setNoPosts(true);
                setPosts([]);
            });
        }
    }
};

const getComments = async () => {
    const state = store.getState();
    const { currentSub, currentPostId } = state;
    const setComments = (val) => store.dispatch({type: 'SET_COMMENTS', payload: val});
    const setNoComments = (val) => store.dispatch({type: 'SET_NO_COMMENTS', payload: val});
    const setPostDetails = (val) => store.dispatch({type: 'SET_POST_DETAILS', payload: val});

    if (currentPostId.length === 0) return;

    let url = `${currentSub}/comments/${currentPostId}/`;
    
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

            batch(() => {
                setPostDetails({id, url, title, author, created:created_utc, body: parseBodyText(selftext_html), media, permalink});
                setComments(comments);
                if (comments.length === 0) setNoComments(true);
            });
        }
    } catch (error) {
        console.log('Getting Comments - URL Error: ', error);
    }
};

const updatePostDetails = (posts, id) => {
    const setPostDetails = (val) => store.dispatch({type: 'SET_POST_DETAILS', payload: val});
    const setComments = (val) => store.dispatch({type: 'SET_COMMENTS', payload: val});
    const setNoComments = (val) => store.dispatch({type: 'SET_NO_COMMENTS', payload: val});

    let post = undefined;
    if (id.length > 0) post = posts.find(post => post.id === id);
    if (post === undefined) setPostDetails({});
    else setPostDetails(post);

    setComments([]);
    setNoComments(false);
}

export {
    parseComment, 
    parseBodyText,
    parseURL,
    getPostList,
    getComments,
    updatePostDetails
}