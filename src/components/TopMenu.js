import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import SubList from './SubList';
import SortMenu from './SortMenu';
import SearchMenu from './SearchMenu';

const StyledTopMenu = styled.div`
    border-bottom: 1px solid red;
    position: fixed;
    width: 100%;
    background-color: black;
    z-index: 6;

    & > div:last-child,  & > div:nth-last-child(2){
        float: right;
        border-right: none;
        border-left: 1px solid gray;
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

const TopMenu = ({onBackClick}) => {
    const dispatch = useDispatch();

    const searchMenuOpen = useSelector(state => state.searchMenuOpen);
    const onClickSearch = () => searchMenuOpen ? dispatch({type: 'CLOSE_SEARCH'}) : dispatch({type: 'OPEN_SEARCH'});

    const subMenuOpen = useSelector(state => state.subMenuOpen);
    const onClickSubs = () => subMenuOpen ? dispatch({type: 'CLOSE_SUBS'}) : dispatch({type: 'OPEN_SUBS'});

    const sortMenuOpen = useSelector(state => state.sortMenuOpen);
    const onClickSort = () => sortMenuOpen ? dispatch({type: 'CLOSE_SORT'}) : dispatch({type: 'OPEN_SORT'});

    const currentPostId = useSelector(state => state.currentPostId);

    return (
        <React.Fragment>
            <StyledTopMenu>
                <MenuButton onClick={onClickSubs} selected={subMenuOpen}>Subs</MenuButton>
                { currentPostId.length > 0 ? <MenuButton onClick={onBackClick}>Back</MenuButton> : null }
                <MenuButton onClick={onClickSort} selected={sortMenuOpen}>Sort</MenuButton>
                <MenuButton onClick={onClickSearch} selected={searchMenuOpen}>Search</MenuButton>
            </StyledTopMenu>
            { subMenuOpen ? <Dropdown><SubList/></Dropdown> : null }
            { sortMenuOpen ? <Dropdown right={true}><SortMenu/></Dropdown> : null }
            { searchMenuOpen ? <Dropdown right={true}><SearchMenu/></Dropdown> : null }
        </React.Fragment>
    );
};

export default TopMenu;