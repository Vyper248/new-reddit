import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';

import SubList from './components/SubList';
import SortMenu from './components/SortMenu';
import SearchMenu from './components/SearchMenu';
import TopMenu from './components/TopMenu';
import PostList from './components/PostList';
import Post from './components/Post';
import Header from './components/Header';
import SideMenu from './components/SideMenu';

import { getPostList, getComments, parseURL } from './functions/useful';

const Dropdown = styled.div`
    position: fixed;
    width: 250px;
    background-color: black;
    z-index: 5;
    top: 37px;
    border-right: 1px solid red;
    border-bottom: 1px solid red;
    max-height: calc(100% - 50px);
    overflow: scroll;
    ${ props => props.right 
            ? 'right: 0px; border-left: 1px solid red; border-right: none;' 
            : '' };
`;

const Page = ({location, history}) => {
    const [sort, setSort] = useState('hot');
    const [posts, setPosts] = useState([]);
    const [noPosts, setNoPosts] = useState(false);
    const [latestPost, setLatestPost] = useState('');
    const [scrollPos, setScrollPos] = useState(0);

    const [comments, setComments] = useState([]);
    const [noComments, setNoComments] = useState(false);

    const [postDetails, setPostDetails] = useState({});

    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const [searchMenuOpen, setSearchMenuOpen] = useState(false);

    const [currentSearch, setCurrentSearch] = useState('');
    const [currentSearchSort, setCurrentSearchSort] = useState('relevance');
    const [currentSearchSub, setCurrentSearchSub] = useState(true);

    const isMobile = useMediaQuery({ maxWidth: 700 });

    let {sub, newSort, postId} = parseURL(location.pathname);

    if (sub.length === 0) {
        let storedSubs = localStorage.getItem('subs');
        storedSubs = storedSubs ? JSON.parse(storedSubs) : [];
        if (storedSubs.length > 0) sub = storedSubs[0];
        else sub = 'Popular';
        history.push(`/${sub}`);
    }

    useEffect(() => {
        setSubMenuOpen(false);
        setSortMenuOpen(false);     
        onClearSearch(false);           
        getPostList(posts, sub, sort, setPosts, setNoPosts, setLatestPost);
    }, [sort, sub]);

    useEffect(() => {
        if (postId.length > 0 ) {
            let post = undefined;
            if (postId.length > 0) post = posts.find(post => post.id === postId);
            if (post === undefined) setPostDetails({});
            else setPostDetails(post);
            getComments(`${sub}/comments/${postId}/`, setComments, setNoComments, setPostDetails, true);
            window.scrollTo(0,0);  
        }
    }, [postId, posts, sub]);

    useEffect(() => {
        if (postId.length === 0) {
            console.log('Updating Scroll Pos');
            window.scrollTo(0,scrollPos);
        }
    }, [postId]);

    if (newSort !== undefined && newSort.length > 0 && newSort !== sort) {
        setSort(newSort);
        return (<div></div>);
    }

    const onClickLink = (url) => (e) => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setScrollPos(scrollTop);
        history.push(url);
    }

    const onReload = () => {
        setPosts([]);
        getPostList(posts, sub, sort, setPosts, setNoPosts, setLatestPost);
    }

    const onToggleSortMenu = () => {
        if (!sortMenuOpen) setSubMenuOpen(false);
        if (!sortMenuOpen) setSearchMenuOpen(false);
        setSortMenuOpen(!sortMenuOpen);
    }

    const onToggleSubsMenu = () => {
        if (!subMenuOpen) setSortMenuOpen(false);
        if (!subMenuOpen) setSearchMenuOpen(false);
        setSubMenuOpen(!subMenuOpen);        
    }   

    const onToggleSearchMenu = () => {
        if (!searchMenuOpen) setSortMenuOpen(false);
        if (!searchMenuOpen) setSubMenuOpen(false);
        setSearchMenuOpen(!searchMenuOpen);
    } 

    const onBackClick = () => {
        history.goBack();
    }

    const onSearch = (value, sortMethod, thisSub) => {
        setSubMenuOpen(false);
        setSortMenuOpen(false);      
        setSearchMenuOpen(false);  
        setCurrentSearch(value);
        setCurrentSearchSort(sortMethod);
        setCurrentSearchSub(thisSub);
        getPostList(posts, sub, sort, setPosts, setNoPosts, setLatestPost, value, sortMethod, thisSub);
    }

    const onClearSearch = (getNewPosts=true) => {
        if (getNewPosts) getPostList(posts, sub, sort, setPosts, setNoPosts, setLatestPost);
        setCurrentSearch('');
        setCurrentSearchSort('relevance');
        setCurrentSearchSub(true);
        setSearchMenuOpen(false); 
    }

    const loadMorePosts = () => {
        getPostList(posts, sub, sort, setPosts, setNoPosts, setLatestPost, currentSearch, currentSearchSort, currentSearchSub, true, latestPost);
    }

    const MainPage = () => {
        return (
            <React.Fragment>
                <Header heading={sub} onReload={onReload}/>
                {/* <PostList posts={posts} sub={sub} sort={sort} noPosts={noPosts} loadMorePosts={loadMorePosts} onClickLink={onClickLink}/> */}
                {/* <Post post={postDetails} comments={comments} noComments={noComments}/> */}
                {/* <Route exact path={'/:sub/comments/:id'} render={props => <Post {...props} post={postDetails} comments={comments} noComments={noComments}/>} /> */}
                <Switch>
                    <Route path={'/:sub/comments/:id'} render={props => <Post {...props} post={postDetails} comments={comments} noComments={noComments}/>} />
                    <Route path={'/:sub/:sort'} render={props => <PostList {...props} posts={posts} sub={sub} sort={sort} noPosts={noPosts} loadMorePosts={loadMorePosts} onClickLink={onClickLink}/>} />
                </Switch>
            </React.Fragment>
        );
    }

    if (isMobile) {
        return (
            <div style={{height: '100%', overflow: 'hidden'}}>
                <TopMenu onClickSubs={onToggleSubsMenu} onClickSort={onToggleSortMenu} onClickSearch={onToggleSearchMenu} showBackButton={postId.length > 0 ? true : false} onBackClick={onBackClick} sortMenuOpen={sortMenuOpen} subMenuOpen={subMenuOpen} searchMenuOpen={searchMenuOpen}/>
                { subMenuOpen ? <Dropdown><SubList currentSub={sub} currentSort={sort}/></Dropdown> : null }
                { sortMenuOpen ? <Dropdown right={true}><SortMenu currentSub={sub} currentSort={sort}/></Dropdown> : null }
                { searchMenuOpen ? <Dropdown right={true}><SearchMenu onSearch={onSearch} currentSearch={currentSearch} currentSearchSort={currentSearchSort} currentSearchSub={currentSearchSub} onClearSearch={onClearSearch}/></Dropdown> : null }
                <div style={{marginTop: '50px'}}></div>
                { <MainPage/> }
            </div>
        );
    } else {
        return (
            <div style={{display: 'flex', height: '100%'}}>
                <div>
                    <Route path={'/'} render={props => <SideMenu {...props} currentSub={sub} currentSort={sort} onSearch={onSearch} onClearSearch={onClearSearch}/>} />
                </div>
                <div style={{width: 'calc(100% - 250px)', height: '100%', overflow: 'scroll', marginLeft: '250px', position: 'relative'}} id='mainPage'>
                    { <MainPage/> }
                </div>
            </div>
        );
    }
}

const App = () => {
    return (
        <Router>
            <Route path="/" component={Page}/>
        </Router>
    );
}

export default App;