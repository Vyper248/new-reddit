import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { getPostList, parseFlair } from '../functions/useful';

import PostLink from './PostLink';
import SubLink from './SubLink';
import Comment from './Comment';
import LoadingSpinner from './Styled/LoadingSpinner';
import Flair from './Styled/Flair';

const PostList = ({onClickLink}) => {
    const posts = useSelector(state => state.posts);
    const noPosts = useSelector(state => state.noPosts);
    const currentSub = useSelector(state => state.currentSub);
    const currentSort = useSelector(state => state.currentSort);
    const currentPostId = useSelector(state => state.currentPostId);
    const noMorePosts = useSelector(state => state.noMorePosts);
    const loadMorePosts = () => getPostList(true);

    const [flairFilter, setFlairFilter] = React.useState('');
    const [flairFilterColor, setFlairFilterColor] = React.useState('');
    const [flairFilterBg, setFlairFilterBg] = React.useState('');
    const [flairFilterSub, setFlairFilterSub] = React.useState('');

    if (noPosts) return <div style={{textAlign:'center'}}>No Posts Found</div>
    if (posts.length === 0 && currentPostId.length === 0) return <div><LoadingSpinner/></div>;

    let hide = currentPostId.length > 0;
    let position = hide ? 'absolute' : 'relative';
    let top = hide ? '-1000000px' : '0px';
    let right = hide ? '-20000px' : '0px';
    let hasMore = hide || noMorePosts ? false : true;  

    const onClickFlair = (flair, color, bg) => () => {
        setFlairFilter(flair);
        setFlairFilterColor(color);
        setFlairFilterBg(bg);
        setFlairFilterSub(currentSub);
    }  

    const onCancelFlair = () => {
        setFlairFilter('');
        setFlairFilterBg('black');
        setFlairFilterSub(currentSub);
        //refresh post list if there's too many posts, otherwise could take too long to display them all again
        if (posts.length > 100) getPostList(false, true);
    }

    //make sure flair filters are specific to subs, so cancel filter if changing sub
    if (currentSub !== flairFilterSub) onCancelFlair(false);

    const filteredPosts = flairFilter.length > 0 ? posts.filter(post => parseFlair(post.link_flair_text) === flairFilter) : posts;

    return (
        <div style={{margin: 'auto', position: position, top: top, right: right, marginBottom: '20px'}}>
            { flairFilter.length > 0 ? <div style={{width: '95%', maxWidth: '1200px', margin: 'auto', marginBottom: '5px'}}>Filtering Flair: <Flair color={flairFilterColor} backgroundColor={flairFilterBg} onClick={onCancelFlair}>{flairFilter}</Flair></div> : null }
            <InfiniteScroll
                dataLength={posts.length} //This is important field to render the next data
                next={loadMorePosts}
                hasMore={hasMore} //change to false when don't want to load more or nothing left
                loader={<div style={{textAlign: 'center', margin: '10px'}}>Loading More...</div>}
                scrollableTarget={'#mainPage'}
                scrollThreshold={'500px'}
            >
            {
                filteredPosts.map(post => {
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