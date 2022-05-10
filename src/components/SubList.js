import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { TiArrowUnsorted } from 'react-icons/ti';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';

import ButtonGroup from './Styled/ButtonGroup';
import ButtonList from './Styled/ButtonList';
import Input from './Styled/Input';
import Button from './Styled/Button';
import SideButton from './Styled/SideButton';

const Icon = styled.div`
    padding: 5px;
    font-size: 1.3em;
    position: absolute;
    right: 10px;
    top: -5px;

    :hover {
        cursor: pointer;
    }
`;

const SubList = () => {
    const dispatch = useDispatch();
    const currentSub = useSelector(state => state.currentSub);
    const currentUser = useSelector(state => state.currentUser);
    let currentSort = useSelector(state => state.currentSort);

    const subs = useSelector(state => state.subs);
    const setSubs = (val) => dispatch({type: 'SET_SUBS', payload: val});

    const [editMode, setEditMode] = useState(subs.length === 0 ? true : false);
    const [newSub, setNewSub] = useState('');

    const onToggleEdit = () => {
        setEditMode(!editMode);
    }

    const onChangeNewSub = (e) => {
        setNewSub(e.target.value);
    }

    const onAddNewSub = () => {
        if (newSub.length === 0) return;
        addSubToStorage(subs, newSub);
    }

    const onDeleteSub = (sub) => () => {
        let newSubArr = subs.filter(subName => subName !== sub);
        setSubs(newSubArr);
    }

    const addCurrentSub = () => {
        if (currentSub === 'user') addSubToStorage(subs, `user/${currentUser}/overview`);
        else addSubToStorage(subs, currentSub);
    }

    const addSubToStorage = (arr, sub) => {
        let newSubArr = [...arr, sub];  
        setSubs(newSubArr);
        setNewSub('');
    }

    const reorder = (data) => {
        if (data.length === 0) return;
        let newSubArr = data.map(sub => sub.id);
        setSubs(newSubArr);
    }

    if (currentSub === 'user') currentSort = 'hot';

    let displaySubs = subs.map(sub => ({id: sub, display: sub}));

    let filteredSubs = subs.filter(sub => !sub.includes('user/')).map(sub => ({id: sub, display: sub}));
    let filteredUsers = subs.filter(sub => sub.includes('user/')).map(user => ({id: user, display: user.replace('user/', '').replace('/overview', '')}));

    return (
        <ButtonList>
            <h3>General</h3>
            <NavLink to={`/My Subreddits/${currentSort}`} className={'My Subreddits' === currentSub ? 'selected' : ''}>My Subreddits</NavLink>
            <NavLink to={`/Popular/${currentSort}`} className={'Popular' === currentSub ? 'selected' : ''}>Popular</NavLink>
            <NavLink to={`/All/${currentSort}`} className={'All' === currentSub ? 'selected' : ''}>All</NavLink>
            <h3>Subs</h3>
            <Icon onClick={onToggleEdit}><FaEdit/></Icon>
            {
                editMode 
                    ? ( <ReactSortable list={displaySubs} setList={reorder} handle=".handle">
                            { displaySubs.map(sub => <CustomSub key={'subButton-'+sub.id} sub={sub} currentSub={currentSub} currentUser={currentUser} currentSort={currentSort} onDeleteSub={onDeleteSub} editMode={editMode}/>) }
                        </ReactSortable> ) 
                    : filteredSubs.map(sub => <CustomSub key={'subButton-'+sub.id} sub={sub} currentSub={currentSub} currentUser={currentUser} currentSort={currentSort} onDeleteSub={onDeleteSub} editMode={editMode}/>)
            }
            {
                editMode ? (
                    <ButtonGroup>
                        <Input type="text" placeholder="New Sub" onChange={onChangeNewSub} value={newSub}/>
                        <SideButton onClick={onAddNewSub}>Add</SideButton>
                    </ButtonGroup>
                ) : null
            }
            {
                !checkIfSubbed(subs, currentSub, currentUser, 'subs') ? <Button onClick={addCurrentSub}>Add Current {currentSub === 'user' ? 'User' : 'Sub'}</Button> : null
            }
            { editMode ? null : <h3>Users</h3> }
            {
                editMode 
                    ? null
                    : filteredUsers.map(sub => <CustomSub key={'subButton-'+sub.id} sub={sub} currentSub={currentSub} currentUser={currentUser} currentSort={'hot'} onDeleteSub={onDeleteSub} editMode={editMode}/>)
            }
            {
                !checkIfSubbed(subs, currentSub, currentUser, 'users') ? <Button onClick={addCurrentSub}>Add Current {currentSub === 'user' ? 'User' : 'Sub'}</Button> : null
            }
        </ButtonList>
    );
}

const CustomSub = ({sub, currentSub, currentUser, currentSort, onDeleteSub, editMode}) => {
    return (
        <ButtonGroup key={'sub-'+sub.id}>
            { editMode ? <div className="handle"><TiArrowUnsorted style={{position: 'relative', top: '8px'}}/></div> : null }
            <NavLink to={`/${sub.id}/${currentSort}`} className={sub.display === currentSub || sub.display === currentUser ? 'selected' : ''} style={{textTransform: 'capitalize'}}>{sub.display}</NavLink>
            { editMode ? <SideButton className="subBtn" onClick={onDeleteSub(sub.id)}><FaTrashAlt/></SideButton> : null }
        </ButtonGroup>
    );
}

const checkIfSubbed = (subs, currentSub, currentUser, section) => {
    if (section === 'subs' && currentSub === 'user') return true;
    if (section === 'users' && currentSub !== 'user') return true;
    if (currentSub === 'user') return subs.includes(`user/${currentUser}/overview`);
    if (currentSub.length === 0) return true;
    if (currentSub === 'Popular') return true;
    if (currentSub === 'All') return true;
    if (currentSub === 'My Subreddits') return true;
    if (subs.includes(currentSub)) return true;
    return false;
}

export default SubList;