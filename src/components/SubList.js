import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

import ButtonGroup from './ButtonGroup';
import ButtonList from './ButtonList';

const Button = styled.button`
    background-color: black;
    border: none;
    text-align: center;
    padding: 5px;
    font-size: 1em;
    width: 100%;
    margin: 0px;

    &:hover {
        cursor: pointer;
        background-color: gray;
    }
`;

const SideButton = styled(Button)`
    border-left: 1px solid gray;
    min-width: 60px;
    width: auto;
`;

const SubInput = styled.input`
    cursor: text;
    padding: 5px 10px;
    flex-grow: 1;
    width: 100%;
    margin: 0px;
    background-color: black;
    border: none;
    font-size: 1em;
    text-align: center;
`;

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

const SubList = ({currentSub, currentSort}) => {
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
                        <SubInput className="newSubInput" type="text" placeholder="New Sub" onChange={onChangeNewSub} value={newSub}/>
                        <SideButton className="subBtn" onClick={onAddNewSub}>Add</SideButton>
                    </ButtonGroup>
                ) : null
            }
            {
                !subs.includes(currentSub) && currentSub.length > 0 ? <ButtonGroup><Button onClick={addCurrentSub}>Add Current Sub</Button></ButtonGroup> : null
            }
        </ButtonList>
    );
}

export default SubList;