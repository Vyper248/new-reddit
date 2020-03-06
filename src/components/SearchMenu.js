import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getPostList } from '../functions/useful';

import ButtonGroup from './ButtonGroup';
import ButtonList from './ButtonList';
import Input from './Input';
import Button from './Button';
import SideButton from './SideButton';
import Checkbox from './Checkbox';

const SearchMenu = () => {
    const dispatch = useDispatch();

    const closeMenus = () => dispatch({type: 'CLOSE_MENUS'});
    const clearSearch = () => dispatch({type: 'CLEAR_SEARCH'});

    const currentSearch = useSelector(state => state.currentSearch);    
    const setCurrentSearch = (e) => dispatch({type: 'SET_CURRENT_SEARCH', payload: e.target.value});

    const currentSearchSort = useSelector(state => state.currentSearchSort);
    const onClickRelevant = () => dispatch({type: 'SET_CURRENT_SEARCH_SORT', payload: 'relevance'});
    const onClickNew = () => dispatch({type: 'SET_CURRENT_SEARCH_SORT', payload: 'new'});

    const currentSearchSub = useSelector(state => state.currentSearchSub);
    const toggleThisSub = () => dispatch({type: 'SET_CURRENT_SEARCH_SUB', payload: !currentSearchSub});

    const onSearch = () => {
        closeMenus();
        getPostList();
    }

    const onEnter = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    }

    const onClearSearch = (getNewPosts=true) => {
        if (currentSearch.length === 0) return; //if there's nothing to clear, don't do anything
        clearSearch();
        if (getNewPosts) getPostList();
    }

    return (
        <ButtonList>
            <h3>Search</h3>
            <ButtonGroup>
                <Input type="text" placeholder="Search" onChange={setCurrentSearch} value={currentSearch} onKeyPress={onEnter}/>
                <SideButton onClick={onSearch}>Search</SideButton>
            </ButtonGroup>
            <ButtonGroup>
                <Checkbox checked={currentSearchSub} onClick={toggleThisSub}/>
                <label style={{width: '100%'}}>This Sub Only</label>
            </ButtonGroup>
            <ButtonGroup>
                <Button selected={currentSearchSort === 'new'} onClick={onClickNew}>New</Button>
                <Button selected={currentSearchSort === 'relevance'} onClick={onClickRelevant}>Relevant</Button>
            </ButtonGroup>
            <Button onClick={onClearSearch}>Clear Search</Button>
        </ButtonList>
    );
}

export default SearchMenu;