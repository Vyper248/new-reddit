import React from 'react';

const SortButtons = ({onClick}) => {
    return (
        <div className="sortButtons">
            <span className="sortButton" onClick={onClick}>Hot</span>
            <span className="sortButton" onClick={onClick}>New</span>
            <span className="sortButton" onClick={onClick}>Rising</span>
            <span className="sortButton" onClick={onClick}>Controversial</span>
            <span className="sortButton" onClick={onClick}>Top</span>
        </div>
    );
};

export default SortButtons;