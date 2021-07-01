import React, { useEffect, useState, useCallback } from "react";
import { useMediaQuery } from 'react-responsive';
import { useSelector, useDispatch, batch } from 'react-redux';

import TopMenu from './components/TopMenu';
import PostList from './components/PostList';
import Post from './components/Post';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import ErrorBoundary from './components/ErrorBoundary';

import { getPostList, getComments, parseURL, parseSearch, parseFlair } from './functions/useful';

const Page = ({location, history}) => {
    const dispatch = useDispatch();
    const [scrollPos, setScrollPos] = useState(0);
    const posts = useSelector(state => state.posts);

    const currentSort = useSelector(state => state.currentSort);
    const setCurrentSort = (sort) => dispatch({type: 'SET_SORT', payload: sort});
    
    const closeMenus = () => dispatch({type: 'CLOSE_MENUS'});

    const currentSub = useSelector(state => state.currentSub);
    const setCurrentSub = (val) => dispatch({type: 'SET_SUB', payload: val});

    const currentPostId = useSelector(state => state.currentPostId);
    const setCurrentPostId = (val) => dispatch({type: 'SET_POSTID', payload: val});

    const currentUserSort = useSelector(state => state.currentUserSort);
    const setCurrentUserSort = (val) => dispatch({type: 'SET_USER_SORT', payload: val});

    const currentSearch = useSelector(state => state.currentSearch);    
    const setCurrentSearch = (val) => dispatch({type: 'SET_CURRENT_SEARCH', payload: val});

    const currentSearchSort = useSelector(state => state.currentSearchSort);
    const setCurrentSearchSort = (val) => dispatch({type: 'SET_CURRENT_SEARCH_SORT', payload: val});

    const currentSearchSub = useSelector(state => state.currentSearchSub);
    const setCurrentSearchSub = (val) => dispatch({type: 'SET_CURRENT_SEARCH_SUB', payload: val});

    const currentSearchForSubs = useSelector(state => state.searchForSubs);
    const setSearchForSubs = (val) => dispatch({type: 'SET_SEARCH_FOR_SUBS', payload: val});

    const currentPermalinkUrl = useSelector(state => state.permalinkUrl);
    const setPermalinkUrl = (val) => dispatch({type: 'SET_PERMALINK_URL', payload: val});

    const currentContext = useSelector(state => state.showContext);
    const setContext = (val) => dispatch({type: 'SET_SHOW_CONTEXT', payload: val});

    const currentUser = useSelector(state => state.currentUser);
    const setCurrentUser = (val) => dispatch({type: 'SET_USER', payload: val});

    const isMobile = useMediaQuery({ maxWidth: 700 });

    let {sub, newSort, postId, userSort, permalinkUrl, user} = parseURL(location.pathname);     
    let {search, searchSort, searchSub, searchForSubs} = parseSearch(location.search);    

    let showContext = location.search === '?context=10000';

    batch(() => {
        if (sub !== currentSub) setCurrentSub(sub);
        if (postId !== currentPostId) setCurrentPostId(postId);
        if (userSort !== currentUserSort) setCurrentUserSort(userSort);
        if (newSort.length > 0 && newSort !== currentSort) setCurrentSort(newSort);
        if (permalinkUrl !== currentPermalinkUrl) setPermalinkUrl(permalinkUrl);
        if (showContext !== currentContext) setContext(showContext);
        if (user.length > 0 && user !== currentUser) setCurrentUser(user);
        
        //if moving from user list to post to post list, then need to make sure user is reset otherwise still displays user list
        if (user.length === 0 && newSort.length > 0 && postId.length === 0) setCurrentUser('');

        if (postId.length > 0 || currentPostId.length > 0) return;
        if (search !== currentSearch) setCurrentSearch(search);
        if (searchSort !== currentSearchSort) setCurrentSearchSort(searchSort);
        if (searchSub !== currentSearchSub) setCurrentSearchSub(searchSub);
        if (searchForSubs !== currentSearchForSubs) setSearchForSubs(searchForSubs);
    });

    //when changing sub or sort method, get post list and clear search
    useEffect(() => {   
        if (isMobile) closeMenus(); 
        if (currentSub.length === 0) return;        
        if (currentPostId.length > 0 && posts.length > 0) return;  
        // if (currentSub === 'user' && posts.length > 0) return;        
        getPostList();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSort, currentSub, currentUser, currentUserSort, currentSearch, currentSearchSort, currentSearchSub, currentSearchForSubs]);

    //return to scroll positiong before going to a post
    useEffect(() => {
        if (currentPostId.length === 0) {
            window.scrollTo(0,scrollPos);
        }
        closeMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPostId]);

    const onClickLink = useCallback((url) => (e) => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setScrollPos(oldVal => scrollTop);
        history.push(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (sub !== currentSub || postId !== currentPostId || userSort !== currentUserSort || (newSort.length > 0 && newSort !== currentSort)) return <div></div>;

    if (currentSub.length === 0) {
        let redirectSub = '';
        let storedSubs = localStorage.getItem('subs');
        storedSubs = storedSubs ? JSON.parse(storedSubs) : [];
        if (storedSubs.length > 0) redirectSub = storedSubs[0];
        else redirectSub = 'Popular';
        history.push(`/${redirectSub}/${currentSort}`);
        return <div></div>;
    }

    const onReload = () => {
        if (currentPostId.length > 0) getComments();
        else getPostList(false, true);
    }

    const onBackClick = () => {
        history.goBack();
    }

    const getMainPage = () => {
        let heading = currentSub;
        let subHeading = '';
        if (currentSearchForSubs) heading = `Searching Subs: ${currentSearch}`;
        if (currentSearch.length > 0 && !currentSearchForSubs) subHeading = `Searching: ${decodeURI(currentSearch)}`;
        if (currentSearch.length > 0 && !currentSearchForSubs && currentSearch.includes('flair_name')) subHeading = `Searching Flair: ${parseFlair(decodeURI(currentSearch.replace('flair_name:', '')))}`;
        if (currentSub === 'user') heading = `${currentUser}`;
        
        return (
            <React.Fragment>
                <Header heading={heading} subHeading={subHeading} onReload={onReload}/>
                { currentPostId.length > 0 ? <Post/> : null }
                <PostList onClickLink={onClickLink}/>
            </React.Fragment>
        );
    }

    if (isMobile) {
        return (
            <ErrorBoundary history={history}>
                <div style={{height: '100%', overflow: 'hidden'}}>
                    <TopMenu onBackClick={onBackClick}/>
                    <div style={{marginTop: '50px'}}></div>
                    { getMainPage() }
                </div>
            </ErrorBoundary>
        );
    } else {
        return (
            <ErrorBoundary history={history}>
                <div style={{display: 'flex', height: '100%'}}>
                    <div>
                        <SideMenu/>
                    </div>
                    <div style={{width: 'calc(100% - 250px)', height: '100%', overflow: 'scroll', marginLeft: '250px', position: 'relative'}} id='mainPage'>
                        { getMainPage() }
                    </div>
                </div>
            </ErrorBoundary>
        );
    }
}

export default Page;