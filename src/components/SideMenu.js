import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import SortMenu from './SortMenu';
import CommentSortMenu from './CommentSortMenu';
import SubList from './SubList';
import SearchMenu from './SearchMenu';

const StyledSideMenu = styled.div`
    width: 250px;
    border-right: 1px solid red;
    height: 100%;
    position: fixed;
    overflow: scroll;
`;

const SideMenu = () => {
    const currentPostId = useSelector(state => state.currentPostId);

    return (
        <StyledSideMenu>
            <SearchMenu/>
            { currentPostId.length > 0 ? <CommentSortMenu/> : <SortMenu/> }
            <SubList/>
        </StyledSideMenu>
    );
}

export default SideMenu;