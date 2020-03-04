import React from 'react';
import styled from 'styled-components';

import SortMenu from './SortMenu';
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
    return (
        <StyledSideMenu>
            <SearchMenu/>
            <SortMenu/>
            <SubList/>
        </StyledSideMenu>
    );
}

export default SideMenu;