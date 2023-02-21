import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { MdSettings } from 'react-icons/md';
import { FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa';

import SubList from './SubList';
import SortMenu from './SortMenu';
import UserSortMenu from './UserSortMenu';
import CommentSortMenu from './CommentSortMenu';
import SearchMenu from './SearchMenu';
import SaveList from './SaveList';
import Settings from './Settings/Settings';
import FlairList from './FlairList';

const StyledTopMenu = styled.div`
    border-bottom: 1px solid red;
    position: fixed;
    width: 100%;
    background-color: black;
    z-index: 6;

    & > div#settingsBtn, & > div#filterBtn, & > div#searchBtn, & > div#sortBtn {
        float: right;
        border-right: none;
        border-left: 1px solid gray;
        font-size: 1.2em;
        height: 35px;

        & > svg {
            position: relative;
            top: 0px;
        }
    }

    & > div#settingsBtn {
        font-size: 1.4em;

        & > svg {
            top: -2px;
        }
    }
`;

const MenuButton = styled.div`
    display: inline-block;
    padding: 8px;
    border-right: 1px solid gray;
    min-width: 50px;
    text-align: center;
    background-color: ${props => props.selected ? 'gray' : 'none'};
`;

const Dropdown = styled.div`
    position: fixed;
    width: ${props => props.width ? props.width : '250px'};
    background-color: black;
    z-index: 5;
    top: 35px;
    border-right: 1px solid red;
    border-bottom: 1px solid red;
    max-height: calc(100% - 50px);
    overflow: auto;
    ${ props => props.right 
            ? 'right: 0px; border-left: 1px solid red; border-right: none;' 
            : '' };
`;

const TopMenu = ({onBackClick}) => {
    const dispatch = useDispatch();

    const searchMenuOpen = useSelector(state => state.searchMenuOpen);
    const onClickSearch = () => searchMenuOpen ? dispatch({type: 'CLOSE_SEARCH'}) : dispatch({type: 'OPEN_SEARCH'});

    const subMenuOpen = useSelector(state => state.subMenuOpen);
    const onClickSubs = () => subMenuOpen ? dispatch({type: 'CLOSE_SUBS'}) : dispatch({type: 'OPEN_SUBS'});

    const sortMenuOpen = useSelector(state => state.sortMenuOpen);
    const onClickSort = () => sortMenuOpen ? dispatch({type: 'CLOSE_SORT'}) : dispatch({type: 'OPEN_SORT'});

    const saveMenuOpen = useSelector(state => state.saveMenuOpen);
    const saved = useSelector(state => state.saved);
    const onClickSave = () => saveMenuOpen ? dispatch({type: 'CLOSE_SAVED'}) : dispatch({type: 'OPEN_SAVED'});

    const settingsMenuOpen = useSelector(state => state.settingsMenuOpen);
    const onClickSettings = () => settingsMenuOpen ? dispatch({type: 'CLOSE_SETTINGS'}) : dispatch({type: 'OPEN_SETTINGS'});

    const filterMenuOpen = useSelector(state => state.filterMenuOpen);
    const onClickFilter = () => filterMenuOpen ? dispatch({type: 'CLOSE_FILTER'}) : dispatch({type: 'OPEN_FILTER'});

    const currentPostId = useSelector(state => state.currentPostId);
    const currentSub = useSelector(state => state.currentSub);

    return (
        <React.Fragment>
            <StyledTopMenu>
                <MenuButton onClick={onClickSubs} selected={subMenuOpen}>Subs</MenuButton>
                { saved.length > 0 ? <MenuButton onClick={onClickSave} selected={saveMenuOpen}>Saved</MenuButton> : null }
                { currentPostId.length > 0 ? <MenuButton onClick={onBackClick}>Back</MenuButton> : null }
                <MenuButton id='sortBtn' onClick={onClickSort} selected={sortMenuOpen}><FaSortAmountDown/></MenuButton>
                <MenuButton id='searchBtn' onClick={onClickSearch} selected={searchMenuOpen}><FaSearch/></MenuButton>
                <MenuButton id='filterBtn' onClick={onClickFilter} selected={filterMenuOpen}><FaFilter/></MenuButton>
                <MenuButton id='settingsBtn' onClick={onClickSettings} selected={settingsMenuOpen}><MdSettings/></MenuButton>
            </StyledTopMenu>
            { saveMenuOpen ? <Dropdown width="300px"><SaveList/></Dropdown> : null }
            { subMenuOpen ? <Dropdown><SubList/></Dropdown> : null }
            { sortMenuOpen && currentSub === 'user' ? <Dropdown right={true}><UserSortMenu/></Dropdown> : null }
            { sortMenuOpen && currentSub !== 'user' && currentPostId.length === 0 ? <Dropdown right={true}><SortMenu/></Dropdown> : null }
            { sortMenuOpen && currentSub !== 'user' && currentPostId.length > 0 ? <Dropdown right={true}><CommentSortMenu/></Dropdown> : null }
            { searchMenuOpen ? <Dropdown right={true}><SearchMenu/></Dropdown> : null }
            { settingsMenuOpen ? <Dropdown right={true}><Settings/></Dropdown> : null }
            { filterMenuOpen ? <Dropdown right={true}><h3 style={{textAlign: 'center'}}>Flair Filters</h3><FlairList/></Dropdown> : null }
        </React.Fragment>
    );
};

export default TopMenu;