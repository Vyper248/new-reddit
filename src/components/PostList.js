import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getPostList } from '../functions/useful';

import PostLink from './PostLink';
import SubLink from './SubLink';
import Comment from './Comment';
import LoadingSpinner from './Styled/LoadingSpinner';

const PostList = ({onClickLink}) => {
    const history = useHistory();

    const posts = useSelector(state => state.posts);
    const noPosts = useSelector(state => state.noPosts);
    const currentSub = useSelector(state => state.currentSub);
    const currentSort = useSelector(state => state.currentSort);
    const currentPostId = useSelector(state => state.currentPostId);
    const currentSearch = useSelector(state => state.currentSearch);
    const noMorePosts = useSelector(state => state.noMorePosts);
    const loadMorePosts = () => getPostList(true);

    if (noPosts) return <div style={{textAlign:'center'}}>No Posts Found</div>
    if (posts.length === 0 && currentPostId.length === 0) return <div><LoadingSpinner/></div>;

    let hide = currentPostId.length > 0;
    let position = hide ? 'absolute' : 'relative';
    let top = hide ? '-1000000px' : '0px';
    let right = hide ? '-20000px' : '0px';
    let hasMore = hide || noMorePosts ? false : true;  

    const onClickFlair = (flair) => () => {
        //if already searching for this flair, don't need to do anything
        if (decodeURI(currentSearch) === `flair:"${flair}"`) return;
        
        //base flair sorting on current post sort. I user is looking at new posts, search should use new, otherwise use top (relevant not needed for flair searching)
        let sorting = currentSort === 'new' ? 'new' : 'top';
        history.push(`/${currentSub}/${currentSort}?search=${`flair:"${flair}"`}&searchSort=${sorting}&searchSub=${true}&searchForSubs=${false}`);
    }  

    return (
        <div style={{margin: 'auto', position: position, top: top, right: right, marginBottom: '20px'}}>
            <InfiniteScroll
                dataLength={posts.length} //This is important field to render the next data
                next={loadMorePosts}
                hasMore={hasMore} //change to false when don't want to load more or nothing left
                loader={<div style={{textAlign: 'center', margin: '10px'}}>Loading More...</div>}
                scrollableTarget={'#mainPage'}
                scrollThreshold={'500px'}
            >
            {
                posts.map(post => {
                    if (post.type === 'comment') return <Comment key={post.id} comment={post} author='' single={true} onClickLink={onClickLink}/>;
                    if (post.type === 'sub') return <SubLink key={post.id} sub={post} currentSort={currentSort}/>;
                    if (currentSub === 'user') return <PostLink key={post.id} post={post} currentSub={post.subreddit} currentSort={'hot'} onClickLink={onClickLink} onClickFlair={onClickFlair}/>;
                    return <PostLink key={post.id} post={post} currentSub={currentSub} currentSort={currentSort} onClickLink={onClickLink} onClickFlair={onClickFlair}/>;
                })
            }
            {
                noMorePosts ? <div style={{textAlign: 'center', margin: '10px'}}>No More Posts</div> : null
            }
            </InfiniteScroll>
        </div>
    );
}

export default PostList;