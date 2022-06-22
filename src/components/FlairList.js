import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

import { parseFlair } from '../functions/useful';

import Flair from './Styled/Flair';
import BasicButton from './Styled/BasicButton';
 
const StyledComp = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    & > div#FlairHelp {
        width: 100%;
        text-align: center;
    }

    & > span {
        display: inline-block;
        margin: 2px;
    }

    @media screen and (max-width: 700px) {
        justify-content: start;
        padding: 5px;
    }
`

const FlairList = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const posts = useSelector(state => state.posts);
    const flairs = useSelector(state => state.flairs);
    const currentSub = useSelector(state => state.currentSub);
    const currentSort = useSelector(state => state.currentSort);
    const currentSearch = useSelector(state => state.currentSearch);

    const [subFlairs, setSubFlairs] = useState({});
    const [editFlairs, setEditFlairs] = useState(false);

    //if posts change, check through and update flairs if needed
    useEffect(() => {
        let savedFlairs = flairs[currentSub];
        if (savedFlairs === undefined) savedFlairs = {};

        let changedFlairs = false;
        posts.forEach(post => {
            if (post.subreddit.toLowerCase() !== currentSub.toLowerCase()) return;
    
            let flairName = post.link_flair_text;
            if (!flairName) return;
            if (flairName.trim().length === 0) return;

            if (savedFlairs[flairName] === undefined) {
                changedFlairs = true;
                savedFlairs[flairName] = {
                    link_flair_text: post.link_flair_text,
                    link_flair_background_color: post.link_flair_background_color,
                    link_flair_text_color: post.link_flair_text_color
                }
            }
        });
    
        if (changedFlairs) {
            flairs[currentSub] = savedFlairs;
            dispatch({type: 'SET_FLAIRS', payload: flairs});
        }

        setSubFlairs(savedFlairs);
        setEditFlairs(false);
    }, [dispatch, posts]);

    const onToggleFlairHidden = (flairName) => {
        let subFlairsCopy = {...subFlairs};
        let flair = subFlairsCopy[flairName];
        flair.hidden = !flair.hidden;
        dispatch({type: 'SET_FLAIRS', payload: flairs});
        setSubFlairs(subFlairsCopy);
    }

    const onClickFlair = (flairName) => () => {
        if (editFlairs) {
            onToggleFlairHidden(flairName);
            return;
        }

        //if already searching for this flair, don't need to do anything
        if (decodeURI(currentSearch) === `flair_name:"${flairName}"`) return;
        
        //base flair sorting on current post sort. I user is looking at new posts, search should use new, otherwise use top (relevant not needed for flair searching)
        let sorting = currentSort === 'new' ? 'new' : 'top';
        history.push(`/${currentSub}/${currentSort}?search=${`flair_name:"${flairName}"`}&searchSort=${sorting}&searchSub=${true}&searchForSubs=${false}`);
    }  

    const onToggleEditMode = () => {
        setEditFlairs(!editFlairs);
    }

    if (Object.values(subFlairs).length === 0) return null;

    return (
        <StyledComp>
            {
                editFlairs ? <div id='FlairHelp'>Click a flair to hide or show it.</div> : null
            }
            {
                Object.values(subFlairs).map(flair => {
                    if (!flair.link_flair_text) return;
                    //get flair details
                    let flairText = parseFlair(flair.link_flair_text);
                    let flairColor = flair.link_flair_text_color;
                    let flairBgColor = flair.link_flair_background_color;
                    
                    if (!flairBgColor || flairBgColor?.length === 0) {
                        flairBgColor = 'white';
                        flairColor = 'dark';
                    }

                    if (editFlairs && flair.hidden) {
                        flairBgColor = 'white';
                        flairColor = 'dark';
                    }

                    if (!editFlairs && flair.hidden) return null;

                    return <Flair 
                                key={`flair-${flairText}-${flair.hidden}-${flairBgColor}`} 
                                dim={flair.hidden} color={flairColor} backgroundColor={flairBgColor} 
                                onClick={onClickFlair(flair.link_flair_text)}>
                                    {flairText}
                            </Flair>
                })
            }
            <BasicButton small={true} noBorder={true} onClick={onToggleEditMode}>{editFlairs ? 'Done' : <FaEdit style={{position: 'relative', top: '2px'}}/>}</BasicButton>
        </StyledComp>
    );
}

export default FlairList;