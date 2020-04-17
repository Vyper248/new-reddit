import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ButtonGroup from './Styled/ButtonGroup';
import ButtonList from './Styled/ButtonList';

const SubList = () => {
    const saved = useSelector(state => state.saved);
    const currentPostId = useSelector(state => state.currentPostId);

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