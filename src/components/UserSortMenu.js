import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import ButtonGroup from './Styled/ButtonGroup';
import ButtonList from './Styled/ButtonList';

const UserSortMenu = () => {
    const dispatch = useDispatch();

    const currentSub = useSelector(state => state.currentSub);
    const currentUserSort = useSelector(state => state.currentUserSort);
    const currentUser = useSelector(state => state.currentUser);
    const closeMenus = () => dispatch({type: 'CLOSE_MENUS'});

    const onClick = (val) => () => {
        closeMenus();
    }

    let sortOptions = [
        {display: 'Overview', value: `overview`}, 
        {display: 'Comments', value: `comments`}, 
        {display: 'Posts', value: `submitted`}, 
    ];    

    return (
        <ButtonList>
            <h3>Show</h3>
            {
                sortOptions.map(option => {
                    return (
                        <ButtonGroup key={'commentSort-'+option.value}>
                            <NavLink exact to={`/${currentSub}/${currentUser}/${option.value}`} className={option.value === currentUserSort ? 'selected' : ''} onClick={onClick(option.value)}>{option.display}</NavLink>
                        </ButtonGroup>
                    );
                })
            }
        </ButtonList>
    );
}

export default UserSortMenu;