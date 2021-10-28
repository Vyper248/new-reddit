import store from '../redux/store';
import { batch } from 'react-redux';

const parseComment = (obj, parent=null) => {        
    //adding support for more comment loading within replies
    if (obj.kind === 'more') {        
        let permalink = parent !== null ? parent.data.permalink.match(/\/r\/[a-zA-Z0-9]+\/comments\/[a-zA-Z0-9]+\/([a-zA-Z0-9_]+)\//)[1] : '';
        return {
            kind: 'more',
            id: obj.data.parent_id.replace('t1_',''),
            body_html: '',
            name: '',
            author: '',
            replies: [],
            score: 0,
            permalink: permalink
        };
    }
    
    let comment = obj.data;
    let {body_html, id, name, author, permalink, replies, score, created_utc, parent_id, stickied} = comment;
    body_html = parseBodyText(body_html);
    
    replies = typeof replies === 'object' ? replies.data.children : [];
    
    replies = replies.map(comment => {
        return parseComment(comment, obj);
    });

    const hasContext = !parent_id.includes('t3_');
    
    return {body_html, id, name, author, permalink, replies, score, created_utc, hasContext, stickied};
}

const parseLinks = (text, body=false) => {
    //make sure any links within the body open in a new tab
    text = text.replace(/<a/g, '<a target="_blank" rel="noopener noreferrer"');
    
    //but links to other reddit subs or users can be kept on this website
    text = text.replace(/target="_blank" rel="noopener noreferrer" href="\/r/g, 'href="#');  
    text = text.replace(/target="_blank" rel="noopener noreferrer" href="\/u/g, 'href="#/user');  

    //replace full links to reddit with local links to stay on this website
    let redditMatches = text.match(/href="https:\/\/www.reddit.com\/r\/[a-zA-Z0-9]+\/comments\/[a-zA-Z0-9]+/g);
    if (redditMatches !== null) redditMatches.forEach(match => {
        let sub = match.match(/r\/([a-zA-Z0-9]+)/)[1];
        let id = match.match(/comments\/([a-zA-Z0-9]+)/)[1];
        text = text.replace(`target="_blank" rel="noopener noreferrer" ${match}`, `href="#/${sub}/comments/${id}`);
    });

    if (body) {
        //Check for image links and replace with image (only check paragraphs to ignore inline image links)
        let aTagMatches = text.match(/<p><a\b[^>]*>(.*?)<\/a>( ?)<\/p>/g);
        if (aTagMatches) {
            aTagMatches.forEach(a => {
                //get full href
                let hrefMatch = a.match(/href="(.[^"]+)"/);
                if (hrefMatch === undefined || hrefMatch.length < 2) return;
                let href = parseBodyText(hrefMatch[1]);
    
                //check <a> tag description if not the same as url
                let aText = a.match(/<p><a\b[^>]*>(.*?)<\/a><\/p>/);
                let imageText = '';
                if (aText && aText.length > 1) {
                    imageText = parseBodyText(aText[1]);
                    if (imageText === href) imageText = '';
                }
        
                //basic check if link is an image link
                let imgMatch = href.match(/\.jpg|\.bmp|\.jpeg|\.png|\.gif/);
        
                //if it is, replace with img tag
                if (imgMatch && imgMatch.length > 0) {
                    text = text.replace(a, `<p class="bodyImage"><a target="_blank" rel="noopener noreferrer" href="${href}"><img src="${href}"/><span>${imageText}</span></a></p>`);
                }
            });
        }
    }

    return text;
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

const parseFlair = (flair) => {
    if (flair === undefined || flair === null) return '';

    //filter out flair logos
    flair = flair.length > 0 ? flair.replace(/:[a-zA-Z0-9_-]+:/g, '') : '';
    flair = flair.trim();
    flair = parseBodyText(flair);
    return flair;
}

const parseURL = (url) => {
    let parts = url.split('/');
    let sub = '';
    let newSort = '';
    let postId = '';
    let userSort = '';
    let permalinkUrl = '';
    let user = '';

    if (parts.length > 0) {
        parts[1] !== undefined ? sub = parts[1] : sub = '';
        parts[2] === 'comments' && parts[3] !== undefined ? postId = parts[3] : postId = '';
        parts[2] !== 'comments' && parts[2] !== undefined ? newSort = parts[2] : newSort = '';
        if (parts[2] === 'comments' && parts[3] === undefined) newSort = 'comments';
        if (parts[2] !== 'comments' && parts[2] === undefined) newSort = 'hot';
        if (parts[1] === 'user' && parts[3] !== undefined) userSort = parts[3];
        if (parts[1] === 'user' && parts[3] === undefined) userSort = 'overview';
        if (parts[1] === 'user' && parts[2] !== undefined) { user = parts[2]; newSort = ''; }
        if ([parts[2] === 'comments'] && parts[4] !== undefined && parts[5] !== undefined) permalinkUrl = parts[4] + '/' + parts[5];
    }    

    return {sub, newSort, postId, userSort, permalinkUrl, user};
}

const parseBool = (str) => {
    return str === 'true' ? true : false;
}

const parseSearch = (searchStr) => {
    searchStr = searchStr.replace('&amp;', '%26'); //if search string contains &, replace with %26 so the regex still catches it
    let search = searchStr.match(/search=([^&]+)/);
    let searchSort = searchStr.match(/searchSort=(relevance|new)/);
    let searchSub = searchStr.match(/searchSub=(true|false)/);
    let searchForSubs = searchStr.match(/searchForSubs=(true|false)/);
    
    search = search === null ? '' : search[1];
    searchSort = searchSort === null ? 'relevance' : searchSort[1];
    searchSub = searchSub === null ? true : parseBool(searchSub[1]);
    searchForSubs = searchForSubs === null ? false : parseBool(searchForSubs[1]);

    search = search.replace(/%20/g, ' ').replace(/%22/g, '"');

    return {search, searchSort, searchSub, searchForSubs};
}

const getMySubs = (prepend) => {
    let currentSub = '';
    let storedSubs = localStorage.getItem('subs');
    storedSubs = storedSubs ? JSON.parse(storedSubs) : [];
    storedSubs = storedSubs.filter(sub => (!sub.includes('/'))); //filter items with / in, such as user links
    currentSub = prepend+storedSubs.join('+');
    if (storedSubs.length === 0) currentSub = prepend+'All';
    return currentSub;
}

const getPostList = async (loadMore=false, force=false) => {
    const state = store.getState();
    let { posts, currentSub, currentSort, currentUser, currentUserSort, currentSearch, currentSearchSort, currentSearchSub, latestPost, searchForSubs, previousUrl } = state;
    const setLatestPost = (val) => store.dispatch({type: 'SET_LATEST_POST', payload: val});
    const setPosts = (val) => store.dispatch({type: 'SET_POSTS', payload: val});
    const setNoPosts = (val) => store.dispatch({type: 'SET_NO_POSTS', payload: val});
    const setNoMorePosts = (val) => store.dispatch({type: 'SET_NO_MORE_POSTS', payload: val});
    const setPreviousUrl = (val) => store.dispatch({type: 'SET_PREVIOUS_URL', payload: val});

    //if no sub, then don't get anything
    if (currentSub.length === 0) return;

    if (currentSub.length > 0) currentSub = 'r/'+currentSub;    

    if (currentSub === 'r/My Subreddits') currentSub = getMySubs('r/');
    
    try {
        let url = `https://www.reddit.com/${currentSub}/${currentSort}/.json`;
        if (loadMore) url += `?after=${latestPost}`;

        if (currentSearch.length > 0) {
            let parsedStr = currentSearch.split(' ').join('+');
            if (searchForSubs) url = `https://www.reddit.com/${currentSub}/search.json?q=${parsedStr}&include_over_18=on&sort=relevance&type=sr`;
            else url = `https://www.reddit.com/${currentSub}/search.json?q=${parsedStr}${currentSearchSub ? '&restrict_sr=on' : ''}&include_over_18=on&sort=${currentSearchSort}`;

            if (loadMore) {
                url += `&after=${latestPost}`;
            }
        }

        if (currentSub.length === 0) url = 'https://www.reddit.com/.json';        

        if (currentSub === 'r/user') {
            url = `https://www.reddit.com/user/${currentUser}/${currentUserSort}.json`;  
            if (loadMore) url += `?after=${latestPost}`;
        }

        if (decodeURI(url) === decodeURI(previousUrl) && force === false) return;
        else {
            let baseUrl = url.replace(/\?after=[a-zA-Z0-9_]+/, '');
            setPreviousUrl(baseUrl);
        }

        if (!loadMore) {
            setPosts([]);
            setNoPosts(false);
            setNoMorePosts(false);
        }        

        // console.log('Fetching data with url: '+url);
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

                    if (post.kind === 't5') return {
                        id: data.id,
                        name: data.name,
                        type: 'sub',
                        title: parseBodyText(data.title),
                        subName: data.display_name,
                        description: parseBodyText(data.description_html),
                        created: data.created_utc,
                        subscribers: data.subscribers,
                    }

                    if (post.kind === 't1') {
                        let comment = parseComment(post);                        
                        comment.type = 'comment';
                        comment.link_title = data.link_title;
                        comment.link_id = data.link_id;
                        comment.subreddit = data.subreddit;
                        return comment;
                    }
                    
                    return {
                        type: 'post',
                        created: data.created_utc,
                        author: data.author,
                        domain: data.domain,
                        title: parseBodyText(data.title),
                        id: data.id,
                        name: data.name,
                        body: parseBodyText(data.selftext_html),
                        num_comments: data.num_comments,
                        score: data.score,
                        subreddit: data.subreddit,
                        stickied: data.stickied,
                        url: data.url,
                        thumbnail: data.thumbnail, //if no thumbnail - "self"
                        permalink: data.permalink,
                        media: media,
                        media_embed: data.media_embed,
                        spoiler: data.spoiler,
                        link_flair_text: data.link_flair_text,
                        link_flair_text_color: data.link_flair_text_color,
                        link_flair_background_color: data.link_flair_background_color,
                        crosspost_parent_list: data.crosspost_parent_list
                    };
                });

                let noMore = newPosts.length === 0 ? true : false;
                if (loadMore) newPosts = [...posts, ...newPosts];

                batch(() => {
                    if (!noMore) setLatestPost(newPosts[newPosts.length-1].name);                                
                    setPosts(newPosts);
                    if (noMore) setNoMorePosts(true);
                    if (noMore && !loadMore) setNoPosts(true);
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

const getMoreComments = async (id, fullUrl) => {
    const state = store.getState();
    const { extraComments, currentSub, currentPostId } = state;
    const setExtraComments = (val) => store.dispatch({type: 'SET_EXTRA_COMMENTS', payload: val});

    try {
        let response = await fetch(`https://www.reddit.com/r/${currentSub}/comments/${currentPostId}/${fullUrl}/${id}.json`);
        let data = await response.json();

        if (data.error) {
            console.log('Getting More Comments - Error: ', data.error);
        } else {
            let newComments = data[1].data.children.map(obj => {
                return parseComment(obj);
            });
            
            //make sure it doesn't already exist in case it tried to load more twice
            let parentComment = newComments[0];
            let check = extraComments.find(obj => obj.id === parentComment.id);
            if (check === undefined) {
                let newExtras = [...extraComments, parentComment];
                setExtraComments(newExtras);
            }
        }
    } catch (error) {
        console.log('Getting More Comments - URL Error: ', error);
    }
}

const getComments = async () => {
    const state = store.getState();
    let { currentSub, currentPostId, commentSort, permalinkUrl, showContext } = state;
    const setComments = (val) => store.dispatch({type: 'SET_COMMENTS', payload: val});
    const setNoComments = (val) => store.dispatch({type: 'SET_NO_COMMENTS', payload: val});
    const setPostDetails = (val) => store.dispatch({type: 'SET_POST_DETAILS', payload: val});

    if (currentPostId.length === 0) return;

    setComments([]);
    setNoComments(false);
    
    if (currentSub === 'My Subreddits') currentSub = getMySubs();

    let url = `${currentSub}/comments/${currentPostId}/${permalinkUrl}`;    
    let context = showContext && permalinkUrl.length > 0 ? 10000 : 3;

    try {        
        let response = await fetch(`https://www.reddit.com/r/${url}.json?sort=${commentSort}&context=${context}`);
        let data = await response.json();
        
        if (data.error){
            console.log('Getting Comments - Error: ', data.error);
        } else {
            let {title, selftext_html, id, url, media, media_embed, media_metadata, is_gallery, gallery_data, author, created_utc, permalink, spoiler, crosspost_parent_list} = data[0].data.children[0].data;

            let comments = data[1].data.children.map(obj => {
                return parseComment(obj);
            });

            batch(() => {
                setPostDetails({id, url, title, author, created:created_utc, body: parseBodyText(selftext_html), media, media_embed, permalink, media_metadata, is_gallery, gallery_data, spoiler, crosspost_parent_list});
                setComments(comments);
                if (comments.length === 0) setNoComments(true);
            });
        }
    } catch (error) {
        console.log('Getting Comments - URL Error: ', error);
    }
};

const updatePostDetails = () => {
    const posts = store.getState().posts;
    const currentPostId = store.getState().currentPostId;
    const setPostDetails = (val) => store.dispatch({type: 'SET_POST_DETAILS', payload: val});

    let post = undefined;
    if (currentPostId.length > 0) post = posts.find(post => post.id === currentPostId);
    if (post === undefined) setPostDetails({});
    else setPostDetails(post);  
}

const getLocalUrl = (url, currentSub, currentPostId) => {
    let urlMatches = url.match(/\/r\/[a-zA-Z0-9]+\/comments\/[a-zA-Z0-9]+/g);
    let localUrl = undefined;
    if (urlMatches && urlMatches.length > 0) {
        let match = urlMatches[0];
        let sub = match.match(/r\/([a-zA-Z0-9]+)/)[1];
        let id = match.match(/comments\/([a-zA-Z0-9]+)/)[1];
        let alreadyHere = sub === currentSub && id === currentPostId;
        if (sub !== undefined && id !== undefined && !alreadyHere) localUrl = `#/${sub}/comments/${id}`;
    }

    return localUrl;
}

export {
    parseComment, 
    parseBodyText,
    parseFlair,
    parseLinks,
    parseURL,
    parseSearch,
    getPostList,
    getComments,
    getMoreComments,
    updatePostDetails,
    getLocalUrl
}