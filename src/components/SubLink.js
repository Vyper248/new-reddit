import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { formatDistanceStrict } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';

import PostTitle from './Styled/PostTitle';
import PostTextGroup from './Styled/PostTextGroup';
import PostDetails from './Styled/PostDetails';
import PostExpand from './Styled/PostExpand';

const StyledPostLink = styled.div`
    border: 1px solid ${props => props.stickied ? '#50ec11' : 'red'};
    padding: 0px 0px 0px 10px;
    margin: 5px auto;
    width: 95%;
    max-width: 1200px;
    display: flex;
    position: relative;
`;

const AddSubBtn = styled.div`
    width: 45px;
    height: 45px;
    margin: 5px 5px 5px -5px;
    border: 1px solid ${props => props.stickied ? '#50ec11' : 'red'};
    display: flex;
    align-items: center;

    & > svg {
        font-size: 1.5em;
        margin: auto;
    }

    :hover {
        cursor: pointer;
        background-color: gray;
    }
`;

const SubLink = ({ sub, currentSort }) => {
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);
    const subs = useSelector(state => state.subs);
    const setSubs = (val) => dispatch({type: 'SET_SUBS', payload: val});

    const onToggleExpand = () => {
        setExpanded(!expanded);
    }

    if (sub === undefined) return <span></span>;

    //get relative time string
    let dateString = formatDistanceStrict(new Date(), sub.created*1000);

    //make sure any links within the body open in a new tab
    let description = sub.description.replace(/<a/g, '<a target="_blank" rel="noopener noreferrer"');

    //but links to other reddit subs can be kept on this website
    description = description.replace(/target="_blank" rel="noopener noreferrer" href="\/r/g, 'href="#'); 

    //decide whether to show an open button for post body
    let openBtn = true;
    if (description.length === 0) openBtn = false;    

    const addSub = () => {
        let newSubArr = [...subs, sub.subName];  
        setSubs(newSubArr);
        localStorage.setItem('subs', JSON.stringify(newSubArr));
    }

    const alreadySubbed = subs.reduce((a,c) => {
        if (c.toLowerCase() === sub.subName.toLowerCase()) a++;
        return a;
    }, 0);

    return (
        <StyledPostLink stickied={alreadySubbed}>
            { !alreadySubbed ? <AddSubBtn onClick={addSub} stickied={alreadySubbed}><FaPlus/></AddSubBtn> : null }
            <div style={{width: '100%', maxWidth: '100%'}}>
                { openBtn ? <PostExpand onClick={onToggleExpand} stickied={alreadySubbed}>{ expanded ? <FaChevronUp/> : <FaChevronDown/> }</PostExpand> : null }
                <PostTextGroup>
                    <div>
                        <PostTitle><NavLink to={`/${sub.subName}/${currentSort}`}>{sub.title}</NavLink></PostTitle>
                        <PostDetails>
                            <span>{sub.subName}</span> - <span>{sub.subscribers > 0 ? sub.subscribers : 0} {sub.subscribers !== 1 ? 'members' : 'member'}</span> - <span>{dateString}</span>
                        </PostDetails>
                        { expanded ? <span dangerouslySetInnerHTML={{__html: description}}></span> : null }
                    </div>
                </PostTextGroup>
            </div>
        </StyledPostLink>
    );
}

const areEqual = (prevProps, nextProps) => {    
    if (prevProps.sub.id === nextProps.sub.id) return true;
    return false;
}

export default React.memo(SubLink, areEqual);