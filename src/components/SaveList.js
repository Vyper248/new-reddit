import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
// import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';

import ButtonGroup from './Styled/ButtonGroup';
import ButtonList from './Styled/ButtonList';
// import SideButton from './Styled/SideButton';

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
    // const [editMode, setEditMode] = useState(false);

    const saved = useSelector(state => state.saved);
    const setSaved = (val) => dispatch({type: 'SET_SAVED', payload: val});

    const currentPostId = useSelector(state => state.currentPostId);

    useEffect(() => {
        let storedSaves = localStorage.getItem('saved');
        storedSaves = storedSaves ? JSON.parse(storedSaves) : [];
        setSaved(storedSaves);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const onDeleteSaved = (id) => () => {
    //     let newArr = saved.filter(obj => obj.id !== id);
    //     setSaved(newArr);
    //     localStorage.setItem('saved', JSON.stringify(newArr));
    // }

    // const onToggleEdit = () => {
    //     setEditMode(!editMode);
    // }

    return (
        <ButtonList>
            <h3>Saved</h3>
            {/* { saved.length > 0 ? <Icon onClick={onToggleEdit}><FaEdit/></Icon> : null } */}
            {
                saved.map(obj => {
                    return (
                        <ButtonGroup key={'save-'+obj.id}>
                            <NavLink to={obj.url} className={obj.id === currentPostId ? 'selected' : ''} style={{textTransform: 'capitalize', fontSize: '0.9em'}}>{obj.sub} - {obj.title}</NavLink>
                            {/* { editMode ? <SideButton className="subBtn" onClick={onDeleteSaved(obj.id)}><FaTrashAlt/></SideButton> : null } */}
                        </ButtonGroup>
                    )
                })
            }
        </ButtonList>
    );
}

export default SubList;