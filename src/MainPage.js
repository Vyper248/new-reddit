import React, { useEffect } from "react";
import styled from 'styled-components';
import { Route, Switch } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { useSelector, useDispatch } from 'react-redux';

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
    top: 35px;
    border-right: 1px solid red;
    border-bottom: 1px solid red;
    max-height: calc(100% - 50px);
    overflow: scroll;
    ${ props => props.right 
            ? 'right: 0px; border-left: 1px solid red; border-right: none;' 
            : '' };
`;

const Page = ({location, history}) => {
    const dispatch = useDispatch();

    const sort = useSelector(state => state.currentSort);
    const setSort = (sort) => dispatch({type: 'SET_SORT', payload: sort});

    const posts = useSelector(state => state.posts);
    const setPosts = (posts) => dispatch({type: 'SET_POSTS', payload: posts});
    
    const clearSearch = () => dispatch({type: 'CLEAR_SEARCH'});
    const closeMenus = () => dispatch({type: 'CLOSE_MENUS'});

    const searchMenuOpen = useSelector(state => state.searchMenuOpen);
    const subMenuOpen = useSelector(state => state.subMenuOpen);
    const sortMenuOpen = useSelector(state => state.sortMenuOpen);

    const scrollPos = useSelector(state => state.scrollPos);
    const setScrollPos = (val) => dispatch({type: 'SET_SCROLL_POS', payload: val});

    const currentSub = useSelector(state => state.currentSub);
    const setCurrentSub = (val) => dispatch({type: 'SET_SUB', payload: val});

    const currentPostId = useSelector(state => state.currentPostId);
    const setCurrentPostId = (val) => dispatch({type: 'SET_POSTID', payload: val});

    // const [scrollPos, setScrollPos] = useState(0);

    const setPostDetails = (val) => dispatch({type: 'SET_POST_DETAILS', payload: val});

    const isMobile = useMediaQuery({ maxWidth: 700 });

    let {sub, newSort, postId} = parseURL(location.pathname);

    if (sub !== currentSub) setCurrentSub(sub);
    if (postId !== currentPostId) setCurrentPostId(postId);

    if (sub.length === 0) {
        let storedSubs = localStorage.getItem('subs');
        storedSubs = storedSubs ? JSON.parse(storedSubs) : [];
        if (storedSubs.length > 0) sub = storedSubs[0];
        else sub = 'Popular';
        history.push(`/${sub}/${sort}`);
    }

    useEffect(() => {   
        closeMenus(); 
        clearSearch(); //comment out if want to change subs while still searching         
        getPostList();
    }, [sort, sub]);

    useEffect(() => {
        if (currentPostId.length > 0 ) {
            let post = undefined;
            if (currentPostId.length > 0) post = posts.find(post => post.id === currentPostId);
            if (post === undefined) setPostDetails({});
            else setPostDetails(post);
            getComments();
            window.scrollTo(0,0);  
        }
    }, [currentPostId, posts, sub]);

    useEffect(() => {
        if (currentPostId.length === 0) {
            console.log('Updating Scroll Pos');
            window.scrollTo(0,scrollPos);
        }
    }, [currentPostId]);

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
        getPostList();
    }

    const onBackClick = () => {
        history.goBack();
    }

    const MainPage = () => {
        return (
            <React.Fragment>
                <Header heading={sub} onReload={onReload}/>
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
                { subMenuOpen ? <Dropdown><SubList/></Dropdown> : null }
                { sortMenuOpen ? <Dropdown right={true}><SortMenu/></Dropdown> : null }
                { searchMenuOpen ? <Dropdown right={true}><SearchMenu/></Dropdown> : null }
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