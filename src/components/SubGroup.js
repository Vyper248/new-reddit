import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { TiArrowUnsorted } from 'react-icons/ti';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';

import ButtonGroup from './Styled/ButtonGroup';
import Input from './Styled/Input';
import Button from './Styled/Button';
import SideButton from './Styled/SideButton';

const Icon = styled.div`
    font-size: 1.3em;

    :hover {
        cursor: pointer;
        opacity: 0.7;
    }
`;

const StyledGroup = styled.div`
    position: relative;
    border-bottom: none !important;

    & .heading {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 30px 1fr 30px;

        & > * {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        & > h3 {
            margin: 5px;

            &:hover {
                cursor: pointer;
                background-color: #333;                
            }

            @media screen and (max-width: 700px) {
                &:hover {
                    background-color: transparent;
                }
            }
        }
        
    }

    & .moveBtns {
        display: grid;
        grid-template-columns: 1fr 1fr;

        & > button:first-child {
            border-right: 1px solid gray;
        }
    }

    & > .heading > input {
        margin-right: auto;
        border: 1px solid gray;
    }

    & > *:last-child {
        border-bottom: 1px solid gray;
    }
`;

/*
data = {
    id: number;
    hidden: boolean;
    heading: string;
    subs: string[];
}
*/

const SubGroup = ({data}) => {
    const dispatch = useDispatch();
    const currentSub = useSelector(state => state.currentSub);
    const currentUser = useSelector(state => state.currentUser);
    let currentSort = useSelector(state => state.currentSort);

    const subs = useSelector(state => state.subs);
    const setSubs = (val) => dispatch({type: 'SET_SUBS', payload: val});

    const [editMode, setEditMode] = useState(false);
    const [newSub, setNewSub] = useState('');

    const onToggleEdit = () => {
        setEditMode(!editMode);
    }

    const onDeleteSub = (sub) => () => {
        let newSubArr = data.subs.filter(subName => subName !== sub);
        let currentSubObject = subs.find(obj => obj.id === data.id);
        if (currentSubObject) {
            currentSubObject.subs = newSubArr;
            setSubs([...subs]);
        }
    }

    const addCurrentSub = () => {
        if (currentSub === 'user') addSubToStorage(subs, `user/${currentUser}/overview`);
        else addSubToStorage(subs, currentSub);
    }

    const addSubToStorage = (arr, sub) => {
        let currentSubObject = arr.find(obj => obj.id === data.id);
        if (currentSubObject) {
            let newSubs = [...currentSubObject.subs, sub];
            currentSubObject.subs = newSubs;
            setSubs([...arr]);
            setNewSub('');
        }
    }

    const reorder = (newArray) => {
        if (newArray.length === 0) return;
        let newSubArr = newArray.map(sub => sub.id);
        let currentSubObject = subs.find(obj => obj.id === data.id);
        if (currentSubObject) {
            currentSubObject.subs = newSubArr;
            setSubs([...subs]);
        }
    }

    const onChangeHeading = (e) => {
        const newHeading = e.target.value;
        let currentSubObject = subs.find(obj => obj.id === data.id);
        if (currentSubObject) {
            currentSubObject.heading = newHeading;
            setSubs([...subs]);
        }
    }

    const onChangeNewSub = (e) => {
        setNewSub(e.target.value);
    }

    const onAddNewSub = () => {
        if (newSub.length === 0) return;
        addSubToStorage(subs, newSub);
    }

    const onClickHeading = () => {
        let currentObj = subs.find(obj => obj.id === data.id);
        if (currentObj) {
            currentObj.hidden = !currentObj.hidden;
            setSubs([...subs]);
        }
    }

    const onDeleteGroup = () => {
        const newSubs = subs.filter(sub => sub.id !== data.id);
        setSubs(newSubs);
    }

    const onMoveUp = () => {
        let currentObj = subs.find(obj => obj.id === data.id);
        if (currentObj) {
            let index = subs.indexOf(currentObj);
            if (index === 0) return;
            subs.splice(index, 1);
            subs.splice(index-1, 0, currentObj);
            setSubs([...subs]);
        }
    }

    const onMoveDown = () => {
        let currentObj = subs.find(obj => obj.id === data.id);
        if (currentObj) {
            let index = subs.indexOf(currentObj);
            if (index === subs.length-1) return;
            subs.splice(index, 1);
            subs.splice(index+1, 0, currentObj);
            setSubs([...subs]);
        }
    }

    let displaySubs = data.subs.map(sub => ({id: sub, display: sub}));
    let mappedSubs = data.subs.map(user => ({id: user, display: user.replace('user/', data.heading === 'Users' ? '' : 'User: ').replace('/overview', '')}));

    return (
        <StyledGroup editMode={editMode}>
            <div className='heading'>
                <div>{ editMode ? <Icon><FaTrashAlt onClick={onDeleteGroup}/></Icon> : null }</div>
                { editMode ? <Input value={data.heading} onChange={onChangeHeading}/> : <h3 onClick={onClickHeading}>{data.heading}</h3> }
                <Icon onClick={onToggleEdit}><FaEdit/></Icon>
            </div>
            <div hidden={data.hidden}>
                {
                    editMode && <div className='moveBtns'>
                        <Button onClick={onMoveUp}>Move Up</Button>
                        <Button onClick={onMoveDown}>Move Down</Button>
                    </div>
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
                    editMode 
                        ? ( <ReactSortable list={displaySubs} setList={reorder} handle=".handle">
                                { displaySubs.map(sub => <CustomSub key={'subButton-'+sub.id} sub={sub} currentSub={currentSub} currentUser={currentUser} currentSort={currentSort} onDeleteSub={onDeleteSub} editMode={editMode}/>) }
                            </ReactSortable> ) 
                        : mappedSubs.map(sub => <CustomSub key={'subButton-'+sub.id} sub={sub} currentSub={currentSub} currentUser={currentUser} currentSort={currentSort} onDeleteSub={onDeleteSub} editMode={editMode}/>)
                }
                {
                    !checkIfSubbed(subs, currentSub, currentUser, 'subs') && <Button onClick={addCurrentSub}>Add Current {currentSub === 'user' ? 'User' : 'Sub'}</Button>
                }
                {
                    !checkIfSubbed(subs, currentSub, currentUser, 'users') && <Button onClick={addCurrentSub}>Add Current {currentSub === 'user' ? 'User' : 'Sub'}</Button>
                }

            </div>
        </StyledGroup>
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

const checkSubs = (subs, sub) => {
    for (let i = 0; i < subs.length; i++) {
        for (let j = 0; j < subs[i].subs.length; j++) {
            if (subs[i].subs[j].toLowerCase() === sub.toLowerCase()) return true;
        }
    }

    return false;
}

const checkIfSubbed = (subs, currentSub, currentUser, section) => {
    if (section === 'subs' && currentSub === 'user') return true;
    if (section === 'users' && currentSub !== 'user') return true;
    if (currentSub === 'user') return checkSubs(subs, `user/${currentUser}/overview`);
    if (currentSub.length === 0) return true;
    if (currentSub === 'Popular') return true;
    if (currentSub === 'All') return true;
    if (currentSub === 'My Subreddits') return true;
    if (checkSubs(subs, currentSub)) return true;
    return false;
}

export default SubGroup;