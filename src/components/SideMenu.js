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

const SideMenu = ({currentSub, currentSort, onSearch, onClearSearch, currentSearch}) => {
    return (
        <StyledSideMenu>
            <SearchMenu onSearch={onSearch} currentSearch={currentSearch} onClearSearch={onClearSearch}/>
            <SortMenu currentSub={currentSub} currentSort={currentSort}/>
            <SubList currentSub={currentSub} currentSort={currentSort}/>
        </StyledSideMenu>
    );
}

export default SideMenu;