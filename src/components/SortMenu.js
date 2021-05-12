import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ButtonGroup from './Styled/ButtonGroup';
import ButtonList from './Styled/ButtonList';

const SortMenu = () => {
    const currentSub = useSelector(state => state.currentSub);
    const currentSort = useSelector(state => state.currentSort);

    let sortOptions = ['hot', 'new', 'rising', 'controversial', 'top', 'comments'];

    return (
        <ButtonList>
            <h3>Sort Posts</h3>
            {
                sortOptions.map(option => {
                    return (
                        <ButtonGroup key={'sort-'+option}>
                            <NavLink to={`/${currentSub}/${option}`} className={option === currentSort ? 'selected' : ''} style={{textTransform: 'capitalize'}}>{option}</NavLink>
                        </ButtonGroup>
                    );
                })
            }
        </ButtonList>
    );
}

export default SortMenu;