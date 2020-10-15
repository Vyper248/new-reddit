import React from 'react';
import styled from 'styled-components';

const ReloadButton = styled.span`
    color: gray;

    :hover {
        cursor: pointer;
        color: white;
    }
`;

const Header = ({heading, subHeading='', onReload}) => {
    return (
        <div>
            <h1 style={{textAlign: 'center'}}>{heading} &nbsp;<ReloadButton onClick={onReload}>&#8635;</ReloadButton></h1>
            { subHeading.length > 0 ? <h3 style={{textAlign: 'center'}}>{decodeURIComponent(subHeading)}</h3> : null }
        </div>
    );
};

export default Header;