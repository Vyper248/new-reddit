import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import SmallButton from './Styled/SmallButton';

const ReloadButton = styled.span`
    color: gray;

    :hover {
        cursor: pointer;
        color: white;
    }
`;

const Header = ({heading, subHeading='', onReload}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const currentSub = useSelector(state => state.currentSub);
    const currentSort = useSelector(state => state.currentSort);
    const currentUser = useSelector(state => state.currentUser);
    const blockedUsers = useSelector(state => state.blockedUsers);

    const showBlockButton = !blockedUsers.includes(currentUser) && currentSub === 'user';
    const showUnblockButton = blockedUsers.includes(currentUser) && currentSub === 'user';

    const clearSearch = () => {
        history.push(`/${currentSub}/${currentSort}`);
    }

    const onBlock = () => {
        const blockedUserArr = [...blockedUsers, currentUser];
        dispatch({type: 'SET_BLOCKED_USERS', payload: blockedUserArr});
    }

    const onUnblock = () => {
        const blockedUserArr = blockedUsers.filter(user => user !== currentUser);
        dispatch({type: 'SET_BLOCKED_USERS', payload: blockedUserArr});
    }

    return (
        <div>
            <h1 style={{textAlign: 'center'}}>
                { heading !== 'My Subreddits' 
                    ? <a href={`https://www.reddit.com/r/${heading}`} target='_blank' rel='noreferrer'>{heading}</a>
                    : heading
                }
                 &nbsp;<ReloadButton onClick={onReload}>&#8635;</ReloadButton>
            </h1>
            { subHeading.length > 0 ? <h3 style={{textAlign: 'center'}}>{decodeURIComponent(subHeading)} <SmallButton onClick={clearSearch}>clear</SmallButton></h3> : null }
            { heading.includes('Searching Subs:') ? <h3 style={{textAlign: 'center'}}><SmallButton onClick={clearSearch}>Cancel</SmallButton></h3> : null }
            { showBlockButton ? <h3 style={{textAlign: 'center'}}><SmallButton onClick={onBlock}>Block</SmallButton></h3> : null }
            { showUnblockButton ? <h3 style={{textAlign: 'center'}}><SmallButton onClick={onUnblock}>Unblock</SmallButton></h3> : null }
        </div>
    );
};

export default Header;