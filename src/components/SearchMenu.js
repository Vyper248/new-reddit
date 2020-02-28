import React, { useState } from 'react';

import ButtonGroup from './ButtonGroup';
import ButtonList from './ButtonList';
import Input from './Input';
import Button from './Button';
import SideButton from './SideButton';
import Checkbox from './Checkbox';

const SearchMenu = ({onSearch, onClearSearch, currentSearch, currentSearchSort, currentSearchSub}) => {
    let startSearchValue = currentSearch !== undefined && currentSearch.length > 0 ? currentSearch : '';
    let startSortValue = currentSearchSort !== undefined && currentSearchSort.length > 0 ? currentSearchSort : 'relevance';
    let startSubValue = currentSearchSub !== undefined ? currentSearchSub : true;

    const [value, setValue] = useState(startSearchValue);
    const [sortMethod, setSortMethod] = useState(startSortValue);
    const [thisSub, setThisSub] = useState(startSubValue);

    const onClickSearch = () => {
        onSearch(value, sortMethod, thisSub);
    }

    const onSearchChange = (e) => {
        setValue(e.target.value);
    }

    const toggleThisSub = () => {
        setThisSub(!thisSub);
    }

    const onClickNew = () => {
        setSortMethod('new');
    }

    const onClickRelevant = () => {
        setSortMethod('relevance');
    }

    const onClickClear = () => {
        onClearSearch();
        setValue('');
    }

    return (
        <ButtonList>
            <h3>Search</h3>
            <ButtonGroup>
                <Input type="text" placeholder="Search" onChange={onSearchChange} value={value}/>
                <SideButton onClick={onClickSearch}>Search</SideButton>
            </ButtonGroup>
            <ButtonGroup>
                <Checkbox checked={thisSub} onClick={toggleThisSub}/>
                <label style={{width: '100%'}}>This Sub Only</label>
            </ButtonGroup>
            <ButtonGroup>
                <Button selected={sortMethod === 'new'} onClick={onClickNew}>New</Button>
                <Button selected={sortMethod === 'relevance'} onClick={onClickRelevant}>Relevant</Button>
            </ButtonGroup>
            <Button onClick={onClickClear}>Clear Search</Button>
        </ButtonList>
    );
}

export default SearchMenu;