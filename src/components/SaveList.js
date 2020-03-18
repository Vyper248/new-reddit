import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ButtonGroup from './Styled/ButtonGroup';
import ButtonList from './Styled/ButtonList';

const SubList = () => {
    const dispatch = useDispatch();

    const saved = useSelector(state => state.saved);
    const setSaved = (val) => dispatch({type: 'SET_SAVED', payload: val});

    const currentPostId = useSelector(state => state.currentPostId);

    useEffect(() => {
        let storedSaves = localStorage.getItem('saved');
        storedSaves = storedSaves ? JSON.parse(storedSaves) : [];
        setSaved(storedSaves);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ButtonList>
            <h3>Saved</h3>
            {
                saved.map(obj => {
                    return (
                        <ButtonGroup key={'save-'+obj.id}>
                            <NavLink to={obj.url} className={obj.id === currentPostId ? 'selected' : ''} style={{textTransform: 'capitalize', fontSize: '0.9em'}}>{obj.sub} - {obj.title}</NavLink>
                        </ButtonGroup>
                    )
                })
            }
        </ButtonList>
    );
}

export default SubList;