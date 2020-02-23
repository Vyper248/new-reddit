import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { HashRouter as Router, Route } from "react-router-dom";
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

    const [comments, setComments] = useState([]);
    const [noComments, setNoComments] = useState(false);

    const [postDetails, setPostDetails] = useState({});

    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const [searchMenuOpen, setSearchMenuOpen] = useState(false);
    const [currentSearch, setCurrentSearch] = useState('');

    // const [searchStr, setSearchStr] = useState('');
    // const [searchSort, setSearchSort] = useState('new');
    // const [thisSub, setThisSub] = useState(true);

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
        getPostList(sub, sort, setPosts, setNoPosts);
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

    if (newSort !== undefined && newSort.length > 0 && newSort !== sort) {
        setSort(newSort);
        return (<div></div>);
    }

    const onReload = () => {
        setPosts([]);
        getPostList(sub, sort, setPosts);
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
        getPostList(sub, sort, setPosts, setNoPosts, value, sortMethod, thisSub);
    }

    const onClearSearch = () => {
        getPostList(sub, sort, setPosts, setNoPosts);
        setCurrentSearch('');
        setSearchMenuOpen(false); 
    }

    const MainPage = () => {
        return (
            <React.Fragment>
                <Route path={'/'} render={props => <Header {...props} heading={sub} onReload={onReload}/>} />
                <Route exact path={'/:sub'} render={props => <PostList {...props} posts={posts} sub={sub} sort={sort} noPosts={noPosts}/>} />
                <Route exact path={'/:sub/:sort'} render={props => <PostList {...props} posts={posts} sub={sub} sort={sort} noPosts={noPosts}/>} />
                <Route exact path={'/:sub/comments/:id'} render={props => <Post {...props} post={postDetails} comments={comments} noComments={noComments}/>} />
            </React.Fragment>
        );
    }

    if (isMobile) {
        return (
            <div style={{height: '100%', overflow: 'hidden'}}>
                <TopMenu onClickSubs={onToggleSubsMenu} onClickSort={onToggleSortMenu} onClickSearch={onToggleSearchMenu} showBackButton={postId.length > 0 ? true : false} onBackClick={onBackClick} sortMenuOpen={sortMenuOpen} subMenuOpen={subMenuOpen} searchMenuOpen={searchMenuOpen}/>
                { subMenuOpen ? <Dropdown><SubList currentSub={sub} currentSort={sort}/></Dropdown> : null }
                { sortMenuOpen ? <Dropdown right={true}><SortMenu currentSub={sub} currentSort={sort}/></Dropdown> : null }
                { searchMenuOpen ? <Dropdown right={true}><SearchMenu onSearch={onSearch} currentSearch={currentSearch} onClearSearch={onClearSearch}/></Dropdown> : null }
                <div style={{marginTop: '50px'}}></div>
                { <MainPage/> }
            </div>
        );
    } else {
        return (
            <div style={{display: 'flex', height: '100%'}}>
                <div>
                    <Route path={'/'} render={props => <SideMenu {...props} currentSub={sub} currentSort={sort} onSearch={onSearch} currentSearch={currentSearch} onClearSearch={onClearSearch}/>} />
                </div>
                <div style={{width: 'calc(100% - 250px)', height: '100%', overflow: 'scroll', marginLeft: '250px'}}>
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