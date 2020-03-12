import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { getPostList } from '../functions/useful';

import PostLink from './PostLink';
import SubLink from './SubLink';
import LoadingSpinner from './Styled/LoadingSpinner';

const PostList = ({onClickLink}) => {
    const posts = useSelector(state => state.posts);
    const noPosts = useSelector(state => state.noPosts);
    const currentSub = useSelector(state => state.currentSub);
    const currentSort = useSelector(state => state.currentSort);
    const currentPostId = useSelector(state => state.currentPostId);
    const noMorePosts = useSelector(state => state.noMorePosts);
    const loadMorePosts = () => getPostList(true);

    if (noPosts) return <div style={{textAlign:'center'}}>No Posts Found</div>
    if (posts.length === 0 && currentPostId.length === 0) return <div><LoadingSpinner/></div>;

    let hide = currentPostId.length > 0;
    let position = hide ? 'absolute' : 'relative';
    let top = hide ? '-1000000px' : '0px';
    let right = hide ? '-20000px' : '0px';
    let hasMore = hide || noMorePosts ? false : true;    

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
                    if (post.type === 'sub') return <SubLink key={post.id} sub={post} currentSort={currentSort}/>
                    return <PostLink key={post.id} post={post} currentSub={currentSub} currentSort={currentSort} onClickLink={onClickLink}/>
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