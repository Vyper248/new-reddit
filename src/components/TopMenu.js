import React from 'react';
import {Route} from 'react-router-dom';
import './TopMenu.css';

const TopMenu = ({onSubsClick, onBackClick}) => {
    return (
        <div className="topMenu">
            <span className="topMenuBtn" onClick={onSubsClick}>Subs</span>
            <Route exact path={"/:sub/:post"} render={props => <span className="topMenuBtn" onClick={onBackClick}>Back</span>} />
        </div>
    );
};

export default TopMenu;