import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import SortMenu from './SortMenu';
import CommentSortMenu from './CommentSortMenu';
import UserSortMenu from './UserSortMenu';
import SubList from './SubList';
import SearchMenu from './SearchMenu';
import SaveList from './SaveList';
import Button from './Styled/Button';

const StyledSideMenu = styled.div`
    width: 250px;
    border-right: 1px solid red;
    height: 100%;
    position: fixed;
    overflow: scroll;
`;

const SavedButton = styled(Button)`
    border-top: none;
    border-bottom: 1px solid gray;
`;

const SideMenu = () => {
    const [showSaved, setShowSaved] = useState(false);
    const currentPostId = useSelector(state => state.currentPostId);
    const currentSub = useSelector(state => state.currentSub);

    const onClickHideSaved = () => {
        setShowSaved(false);
    }

    const onClickShowSaved = () => {
        setShowSaved(true);
    }

    if (showSaved) {
        return (
            <StyledSideMenu>
                <SavedButton onClick={onClickHideSaved}>Back</SavedButton>
                <SaveList/>
            </StyledSideMenu>
        );
    } else {
        return (
            <StyledSideMenu>
                <SavedButton onClick={onClickShowSaved}>Saved Posts</SavedButton>
                <SearchMenu/>
                { currentSub === 'user' ? <UserSortMenu/> : currentPostId.length > 0 ? <CommentSortMenu/> : <SortMenu/> }
                <SubList/>
            </StyledSideMenu>
        );
    }
}

export default SideMenu;