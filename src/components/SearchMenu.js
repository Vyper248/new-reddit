import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import ButtonGroup from './ButtonGroup';
import ButtonList from './ButtonList';
import Input from './Input';
import Button from './Button';
import SideButton from './SideButton';
import Checkbox from './Checkbox';

const SearchMenu = () => {    
    const dispatch = useDispatch();
    const history = useHistory();

    const closeMenus = () => dispatch({type: 'CLOSE_MENUS'});

    const currentSub = useSelector(state => state.currentSub);
    const currentSort = useSelector(state => state.currentSort);

    const currentSearch = useSelector(state => state.currentSearch);    
    const [search, setSearch] = useState(currentSearch);
    const onChangeSearch = (e) => setSearch(e.target.value);

    const currentSearchSort = useSelector(state => state.currentSearchSort);
    const [searchSort, setSearchSort] = useState(currentSearchSort);
    const onClickRelevant = () => setSearchSort('relevance');
    const onClickNew = () => setSearchSort('new');

    const currentSearchSub = useSelector(state => state.currentSearchSub);
    const [searchSub, setSearchSub] = useState(currentSearchSub);
    const toggleThisSub = () => setSearchSub(!searchSub);

    const onSearch = () => {
        closeMenus();
        history.push(`/${currentSub}/${currentSort}?search=${search}&searchSort=${searchSort}&searchSub=${searchSub}&searchForSubs=${false}`);
    }

    const onSearchSubs = () => {
        closeMenus();
        history.push(`/${currentSub}/${currentSort}?search=${search}&searchSort=${searchSort}&searchSub=${searchSub}&searchForSubs=${true}`);
    }

    const onEnter = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    }

    const onClearSearch = (getNewPosts=true) => {
        if (search.length === 0) return; //if there's nothing to clear, don't do anything
        setSearch('');
        setSearchSub(true);
        setSearchSort('relevance');
        history.push(`/${currentSub}/${currentSort}`);
    }

    return (
        <ButtonList>
            <h3>Search</h3>
            <ButtonGroup>
                <Input type="text" placeholder="Search" onChange={onChangeSearch} value={search} onKeyPress={onEnter}/>
                <SideButton onClick={onSearch}>Search</SideButton>
            </ButtonGroup>
            <ButtonGroup>
                <Checkbox checked={searchSub} onClick={toggleThisSub}/>
                <label style={{width: '100%'}}>This Sub Only</label>
            </ButtonGroup>
            <ButtonGroup>
                <Button selected={searchSort === 'new'} onClick={onClickNew}>New</Button>
                <Button selected={searchSort === 'relevance'} onClick={onClickRelevant}>Relevant</Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button onClick={onSearchSubs}>Search Subs</Button>
                <Button onClick={onClearSearch}>Clear Search</Button>
            </ButtonGroup>
        </ButtonList>
    );
}

export default SearchMenu;