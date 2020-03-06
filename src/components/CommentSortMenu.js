import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ButtonGroup from './ButtonGroup';
import ButtonList from './ButtonList';
import Button from './Button';

const CommentSortMenu = () => {
    const dispatch = useDispatch();

    const commentSort = useSelector(state => state.commentSort);
    const changeCommentSort = (val) => dispatch({type: 'SET_COMMENT_SORT', payload: val});
    const closeMenus = () => dispatch({type: 'CLOSE_MENUS'});

    const onClick = (val) => () => {
        closeMenus();
        changeCommentSort(val);
    }

    let sortOptions = [
        {display: 'Best', value: 'confidence'}, 
        {display: 'New', value: 'new'}, 
        {display: 'Top', value: 'top'}, 
        {display: 'Controversial', value: 'controversial'}, 
        {display: 'Q&A', value: 'qa'}
    ];

    return (
        <ButtonList>
            <h3>Sort Comments</h3>
            {
                sortOptions.map(option => {
                    return (
                        <ButtonGroup key={'commentSort-'+option.value}>
                            <Button className={option.value === commentSort ? 'selected' : ''} onClick={onClick(option.value)}>{option.display}</Button>
                        </ButtonGroup>
                    );
                })
            }
        </ButtonList>
    );
}

export default CommentSortMenu;