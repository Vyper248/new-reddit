import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

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

const TopMenu = ({showBackButton, onBackClick}) => {
    const dispatch = useDispatch();

    const searchMenuOpen = useSelector(state => state.searchMenuOpen);
    const onClickSearch = () => searchMenuOpen ? dispatch({type: 'CLOSE_SEARCH'}) : dispatch({type: 'OPEN_SEARCH'});

    const subMenuOpen = useSelector(state => state.subMenuOpen);
    const onClickSubs = () => subMenuOpen ? dispatch({type: 'CLOSE_SUBS'}) : dispatch({type: 'OPEN_SUBS'});

    const sortMenuOpen = useSelector(state => state.sortMenuOpen);
    const onClickSort = () => sortMenuOpen ? dispatch({type: 'CLOSE_SORT'}) : dispatch({type: 'OPEN_SORT'});

    return (
        <React.Fragment>
            <StyledTopMenu>
                <MenuButton onClick={onClickSubs} selected={subMenuOpen}>Subs</MenuButton>
                { showBackButton ? <MenuButton onClick={onBackClick}>Back</MenuButton> : null }
                <MenuButton onClick={onClickSort} selected={sortMenuOpen}>Sort</MenuButton>
                <MenuButton onClick={onClickSearch} selected={searchMenuOpen}>Search</MenuButton>
            </StyledTopMenu>
        </React.Fragment>
    );
};

export default TopMenu;