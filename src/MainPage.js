import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { useSelector, useDispatch } from 'react-redux';

import TopMenu from './components/TopMenu';
import PostList from './components/PostList';
import Post from './components/Post';
import Header from './components/Header';
import SideMenu from './components/SideMenu';

import { getPostList, getComments, parseURL } from './functions/useful';

const Page = ({location, history}) => {
    const dispatch = useDispatch();

    const currentSort = useSelector(state => state.currentSort);
    const setCurrentSort = (sort) => dispatch({type: 'SET_SORT', payload: sort});

    const posts = useSelector(state => state.posts);
    const setPosts = (posts) => dispatch({type: 'SET_POSTS', payload: posts});
    
    const clearSearch = () => dispatch({type: 'CLEAR_SEARCH'});
    const closeMenus = () => dispatch({type: 'CLOSE_MENUS'});

    const scrollPos = useSelector(state => state.scrollPos);
    const setScrollPos = (val) => dispatch({type: 'SET_SCROLL_POS', payload: val});

    const currentSub = useSelector(state => state.currentSub);
    const setCurrentSub = (val) => dispatch({type: 'SET_SUB', payload: val});

    const currentPostId = useSelector(state => state.currentPostId);
    const setCurrentPostId = (val) => dispatch({type: 'SET_POSTID', payload: val});

    const setPostDetails = (val) => dispatch({type: 'SET_POST_DETAILS', payload: val});

    const isMobile = useMediaQuery({ maxWidth: 700 });

    let {sub, newSort, postId} = parseURL(location.pathname);    

    if (sub !== currentSub) setCurrentSub(sub);
    if (postId !== currentPostId) setCurrentPostId(postId);
    if (newSort.length > 0 && newSort !== currentSort) setCurrentSort(newSort);

    useEffect(() => {   
        closeMenus(); 
        clearSearch(); //comment out if want to change subs while still searching         
        getPostList();
    }, [currentSort, currentSub]);

    useEffect(() => {
        if (currentPostId.length > 0 ) {
            let post = undefined;
            if (currentPostId.length > 0) post = posts.find(post => post.id === currentPostId);
            if (post === undefined) setPostDetails({});
            else setPostDetails(post);
            getComments();
            window.scrollTo(0,0);  
        }
    }, [currentPostId, posts, currentSub]);

    useEffect(() => {
        if (currentPostId.length === 0) {
            window.scrollTo(0,scrollPos);
        }
    }, [currentPostId]);
    
    if (sub !== currentSub || postId !== currentPostId || (newSort.length > 0 && newSort !== currentSort)) return <div></div>;

    if (currentSub.length === 0) {
        let redirectSub = '';
        let storedSubs = localStorage.getItem('subs');
        storedSubs = storedSubs ? JSON.parse(storedSubs) : [];
        if (storedSubs.length > 0) redirectSub = storedSubs[0];
        else redirectSub = 'Popular';
        history.push(`/${redirectSub}/${currentSort}`);
        return <div></div>;
    }

    const onClickLink = (url) => (e) => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setScrollPos(scrollTop);
        history.push(url);
    }

    const onReload = () => {
        setPosts([]);
        getPostList();
    }

    const onBackClick = () => {
        history.goBack();
    }

    const MainPage = () => {
        return (
            <React.Fragment>
                <Header heading={currentSub} onReload={onReload}/>
                <Switch>
                    <Route path={'/:sub/comments/:id'} render={props => <Post {...props}/>} />
                    <Route path={'/:sub'} render={props => <PostList {...props} onClickLink={onClickLink}/>} />
                </Switch>
            </React.Fragment>
        );
    }    

    if (isMobile) {
        return (
            <div style={{height: '100%', overflow: 'hidden'}}>
                <TopMenu onBackClick={onBackClick}/>
                <div style={{marginTop: '50px'}}></div>
                { <MainPage/> }
            </div>
        );
    } else {
        return (
            <div style={{display: 'flex', height: '100%'}}>
                <div>
                    <Route path={'/'} render={props => <SideMenu {...props}/>} />
                </div>
                <div style={{width: 'calc(100% - 250px)', height: '100%', overflow: 'scroll', marginLeft: '250px', position: 'relative'}} id='mainPage'>
                    { <MainPage/> }
                </div>
            </div>
        );
    }
}

export default Page;