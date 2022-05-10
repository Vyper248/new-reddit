import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
    const currentSub = useSelector(state => state.currentSub);
    const currentSort = useSelector(state => state.currentSort);

    const clearSearch = () => {
        history.push(`/${currentSub}/${currentSort}`);
    }

    return (
        <div>
            <h1 style={{textAlign: 'center'}}>{heading} &nbsp;<ReloadButton onClick={onReload}>&#8635;</ReloadButton></h1>
            { subHeading.length > 0 ? <h3 style={{textAlign: 'center'}}>{decodeURIComponent(subHeading)} <SmallButton onClick={clearSearch}>clear</SmallButton></h3> : null }
            { heading.includes('Searching Subs:') ? <h3 style={{textAlign: 'center'}}><SmallButton onClick={clearSearch}>Cancel</SmallButton></h3> : null }
        </div>
    );
};

export default Header;