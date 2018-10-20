import React from 'react';

const Header = ({heading, onReload}) => {
    return (
        <h1 className="subHeader">{heading} <span className="reloadButton" onClick={onReload}>&#8635;</span></h1>
    );
};

export default Header;