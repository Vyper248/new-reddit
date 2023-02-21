import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { MdSettings } from 'react-icons/md';

import SortMenu from './SortMenu';
import CommentSortMenu from './CommentSortMenu';
import UserSortMenu from './UserSortMenu';
import SubList from './SubList';
import SearchMenu from './SearchMenu';
import SaveList from './SaveList';
import Settings from './Settings/Settings';
import Button from './Styled/Button';

const StyledSideMenu = styled.div`
    width: 250px;
    border-right: 1px solid red;
    height: 100%;
    position: fixed;
    overflow: auto;
`;

const SavedButton = styled(Button)`
    border-top: none;
    border-bottom: 1px solid gray;
`;

const TopButtons = styled.div`
    display: flex;
    
    & > button:first-child {
        padding: 0px;
        border-right: 1px solid gray;
        width: 60px;
        font-size: 1.4em;
    }

    & > button > svg {
        position: relative;
        top: 3px;
    }
`;

const SideMenu = () => {
    const [showSaved, setShowSaved] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const currentPostId = useSelector(state => state.currentPostId);
    const currentSub = useSelector(state => state.currentSub);

    const onClickHideSaved = () => {
        setShowSaved(false);
        setShowSettings(false);
    }

    const onClickShowSaved = () => {
        setShowSaved(true);
    }

    const onClickShowSettings = () => {
        setShowSettings(true);
    }

    if (showSettings) {
        return (
            <StyledSideMenu>
                <SavedButton onClick={onClickHideSaved}>Back</SavedButton>
                <Settings/>
            </StyledSideMenu>
        );
    } else if (showSaved) {
        return (
            <StyledSideMenu>
                <SavedButton onClick={onClickHideSaved}>Back</SavedButton>
                <SaveList/>
            </StyledSideMenu>
        );
    } else {
        return (
            <StyledSideMenu>
                <TopButtons>
                    <SavedButton onClick={onClickShowSettings}><MdSettings/></SavedButton>
                    <SavedButton onClick={onClickShowSaved}>Saved Posts</SavedButton>
                </TopButtons>
                <SearchMenu/>
                { currentSub === 'user' ? <UserSortMenu/> : currentPostId.length > 0 ? <CommentSortMenu/> : <SortMenu/> }
                <SubList/>
            </StyledSideMenu>
        );
    }
}

export default SideMenu;