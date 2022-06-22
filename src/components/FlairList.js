import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { parseFlair } from '../functions/useful';

import Flair from './Styled/Flair';

const StyledComp = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

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

    let savedFlairs = flairs[currentSub];
    if (savedFlairs === undefined) savedFlairs = {};

    let changedFlairs = false;
    posts.forEach(post => {
        if (post.subreddit.toLowerCase() !== currentSub.toLowerCase()) return;

        let flairName = post.link_flair_text;
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

    const onClickFlair = (flair) => () => {
        //if already searching for this flair, don't need to do anything
        if (decodeURI(currentSearch) === `flair_name:"${flair}"`) return;
        
        //base flair sorting on current post sort. I user is looking at new posts, search should use new, otherwise use top (relevant not needed for flair searching)
        let sorting = currentSort === 'new' ? 'new' : 'top';
        history.push(`/${currentSub}/${currentSort}?search=${`flair_name:"${flair}"`}&searchSort=${sorting}&searchSub=${true}&searchForSubs=${false}`);
    }  

    return (
        <StyledComp>
        {
            Object.values(savedFlairs).map(flair => {
                //get flair
                let flairText = parseFlair(flair.link_flair_text);
                let flairColor = flair.link_flair_text_color;
                let flairBgColor = flair.link_flair_background_color;
                if (!flairBgColor || flairBgColor?.length === 0) {
                    flairBgColor = 'white';
                    flairColor = 'black';
                }

                return <Flair key={`flair-${flairText}`} color={flairColor} backgroundColor={flairBgColor} onClick={onClickFlair(flairText)}>{flairText}</Flair>
            })
        }
        </StyledComp>
    );
}

export default FlairList;