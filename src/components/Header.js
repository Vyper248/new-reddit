import React from 'react';
import styled from 'styled-components';

const ReloadButton = styled.span`
    color: gray;

    :hover {
        cursor: pointer;
        color: white;
    }
`;

const Header = ({heading, onReload}) => {
    return (
        <h1 style={{textAlign: 'center'}}>{heading} &nbsp;<ReloadButton onClick={onReload}>&#8635;</ReloadButton></h1>
    );
};

export default Header;