import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { getPostList } from '../functions/useful';

import PostLink from './PostLink';
import LoadingSpinner from './LoadingSpinner';

const PostList = ({onClickLink}) => {
    const posts = useSelector(state => state.posts);
    const noPosts = useSelector(state => state.noPosts);
    const loadMorePosts = () => getPostList(true);

    if (noPosts) return <div style={{textAlign:'center'}}>No Posts Found</div>
    if (posts.length === 0) return <div><LoadingSpinner/></div>;

    return (
        <div style={{margin: 'auto'}}>
            <InfiniteScroll
                dataLength={posts.length} //This is important field to render the next data
                next={loadMorePosts}
                hasMore={true}
                loader={<div style={{textAlign: 'center', margin: '10px'}}>Loading More...</div>}
                scrollableTarget={'#mainPage'}
                scrollThreshold={'500px'}
            >
            {
                posts.map(post => {
                    return <PostLink key={post.id} post={post} onClickLink={onClickLink}/>
                })
            }
            </InfiniteScroll>
        </div>
    );
}

export default PostList;