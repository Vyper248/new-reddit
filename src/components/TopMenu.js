import React from 'react';
import styled from 'styled-components';

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

const TopMenu = ({onClickSubs, onClickSort, onClickSearch, showBackButton, onBackClick, sortMenuOpen, subMenuOpen, searchMenuOpen}) => {
    return (
        <StyledTopMenu>
            <MenuButton onClick={onClickSubs} selected={subMenuOpen}>Subs</MenuButton>
            { showBackButton ? <MenuButton onClick={onBackClick}>Back</MenuButton> : null }
            <MenuButton onClick={onClickSort} selected={sortMenuOpen}>Sort</MenuButton>
            <MenuButton onClick={onClickSearch} selected={searchMenuOpen}>Search</MenuButton>
        </StyledTopMenu>
    );
};

export default TopMenu;