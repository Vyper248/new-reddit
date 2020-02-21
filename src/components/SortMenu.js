import React from 'react';
import { NavLink } from 'react-router-dom';

import ButtonGroup from './ButtonGroup';
import ButtonList from './ButtonList';

const SortMenu = ({currentSub, currentSort}) => {
    let sortOptions = ['hot', 'new', 'rising', 'controversial', 'top'];

    return (
        <ButtonList>
            <h3>Sort</h3>
            {
                sortOptions.map(option => {
                    return (
                        <ButtonGroup key={'sort-'+option}>
                            <NavLink to={`/${currentSub}/${option}`} className={option === currentSort ? 'selected' : ''}>{option}</NavLink>
                        </ButtonGroup>
                    );
                })
            }
        </ButtonList>
    );
}

export default SortMenu;