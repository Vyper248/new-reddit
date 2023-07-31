import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import format from 'date-fns/format';

import ButtonList from './Styled/ButtonList';
import Button from './Styled/Button';
import SubGroup from './SubGroup';

const getDateNumber = () => {
    return Number(format(new Date(),'yyyyMMddHHmmssSSS'));
}

const SubList = () => {
    const dispatch = useDispatch();
    const currentSub = useSelector(state => state.currentSub);
    let currentSort = useSelector(state => state.currentSort);

    const subs = useSelector(state => state.subs);
    const setSubs = (val) => dispatch({type: 'SET_SUBS', payload: val});

    const addNewGroup = () => {
        const newSubs = [...subs, {id: getDateNumber(), heading: 'New Group', subs: [], hidden: false}];
        setSubs(newSubs);
    }

    if (currentSub === 'user') currentSort = 'hot';

    //conversion from old sub list to new sub groups
    if (subs.length > 0 && typeof subs[0] === 'string') {
        let newSubFormat = [{id: 1, heading: 'Subs', subs: subs, hidden: false}];
        setSubs(newSubFormat);
    }

    return (
        <ButtonList>
            <h3>General</h3>
            <NavLink to={`/My Subreddits/${currentSort}`} className={'My Subreddits' === currentSub ? 'selected' : ''}>My Subreddits</NavLink>
            <NavLink to={`/Popular/${currentSort}`} className={'Popular' === currentSub ? 'selected' : ''}>Popular</NavLink>
            <NavLink to={`/All/${currentSort}`} className={'All' === currentSub ? 'selected' : ''}>All</NavLink>
            <Button onClick={addNewGroup}>New Group</Button>
            {
                subs.map(obj => <SubGroup key={obj.id} data={obj}/>)
            }
            <br/>
            <br/>
            <br/>
        </ButtonList>
    );
}

export default SubList;