import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import ButtonGroup from './ButtonGroup';
import ButtonList from './ButtonList';
import Input from './Input';
import Button from './Button';
import SideButton from './SideButton';

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
    const currentSub = useSelector(state => state.currentSub);
    const currentSort = useSelector(state => state.currentSort);

    const [subs, setSubs] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [newSub, setNewSub] = useState('');

    useEffect(() => {
        let storedSubs = localStorage.getItem('subs');
        storedSubs = storedSubs ? JSON.parse(storedSubs) : [];
        if (storedSubs.length === 0) setEditMode(true);
        setSubs(storedSubs);
    }, []);

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
        localStorage.setItem('subs', JSON.stringify(newSubArr));
    }

    const addCurrentSub = () => {
        addSubToStorage(subs, currentSub);
    }

    const addSubToStorage = (arr, sub) => {
        let newSubArr = [...arr, sub];  
        setSubs(newSubArr);
        setNewSub('');
        localStorage.setItem('subs', JSON.stringify(newSubArr));
    }

    return (
        <ButtonList>
            <h3>General</h3>
            <NavLink to={`/My Subreddits/${currentSort}`} className={'My Subreddits' === currentSub ? 'selected' : ''}>My Subreddits</NavLink>
            <NavLink to={`/Popular/${currentSort}`} className={'Popular' === currentSub ? 'selected' : ''}>Popular</NavLink>
            <NavLink to={`/All/${currentSort}`} className={'All' === currentSub ? 'selected' : ''}>All</NavLink>
            <h3>Subs</h3>
            <Icon onClick={onToggleEdit}><FaEdit/></Icon>
            {
                subs.map(sub => {
                    return (
                        <ButtonGroup key={'sub-'+sub}>
                            <NavLink to={`/${sub}/${currentSort}`} className={sub === currentSub ? 'selected' : ''}>{sub}</NavLink>
                            { editMode ? <SideButton className="subBtn" onClick={onDeleteSub(sub)}><FaTrashAlt/></SideButton> : null }
                        </ButtonGroup>
                    )
                })
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
                !checkIfSubbed(subs, currentSub) ? <Button onClick={addCurrentSub}>Add Current Sub</Button> : null
            }
        </ButtonList>
    );
}

const checkIfSubbed = (subs, currentSub) => {
    if (currentSub.length === 0) return true;
    if (currentSub === 'Popular') return true;
    if (currentSub === 'All') return true;
    if (currentSub === 'My Subreddits') return true;
    if (subs.includes(currentSub)) return true;
    return false;
}

export default SubList;