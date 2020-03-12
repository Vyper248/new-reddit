import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { formatDistanceStrict } from 'date-fns';

const StyledPostLink = styled.div`
    border: 1px solid ${props => props.stickied ? '#50ec11' : 'red'};
    padding: 0px 0px 0px 10px;
    margin: 5px auto;
    width: 95%;
    max-width: 1200px;
    display: flex;
    position: relative;
`;

const PostTextGroup = styled.div`
    display: flex;
    flex-direction: column; 
    height: 100%;
    align-content: center;

    & > div {
        margin-top: auto;
        margin-bottom: auto;
    }
`;

const PostTitle = styled.div`
    margin-top: 10px;
    padding-right: 5px;

    & :hover {
        cursor: pointer;
    }

    @media screen and (max-device-width: 600px){
        font-size: 0.9em;
    }
`;

const PostDetails = styled.div`
    font-size: 0.9em;
    color: gray;
    margin-top: 5px;
    margin-bottom: 5px;

    & a {
        color: gray;
    }
`;

const PostExpand = styled.div`
    display: inline-flex;
    position: relative;
    float: right;
    border-bottom: 1px solid ${props => props.stickied ? '#50ec11' : 'red'};
    border-left: 1px solid ${props => props.stickied ? '#50ec11' : 'red'};
    color: gray;
    width: 32px;
    height: 32px;

    & > svg {
        margin: auto;
    }

    &:hover {
        cursor: pointer;
        color: white;
    }
`;

const SubLink = ({ sub }) => {
    const [expanded, setExpanded] = useState(false);

    const onToggleExpand = () => {
        setExpanded(!expanded);
    }

    if (sub === undefined) return <span></span>;

    //get relative time string
    let dateString = formatDistanceStrict(new Date(), sub.created*1000);

    //make sure any links within the body open in a new tab
    sub.description = sub.description.replace(/<a/g, '<a target="_blank" rel="noopener noreferrer"');

    //decide whether to show an open button for post body
    let openBtn = true;
    if (sub.description.length === 0) openBtn = false;    

    return (
        <StyledPostLink>
            <div style={{width: '100%', maxWidth: '100%'}}>
                { openBtn ? <PostExpand onClick={onToggleExpand}>{ expanded ? <FaMinus/> : <FaPlus/> }</PostExpand> : null }
                <PostTextGroup>
                    <div>
                        <PostTitle><NavLink to={`/${sub.subName}`}>{sub.title}</NavLink></PostTitle>
                        <PostDetails>
                            <span>{sub.subscribers} members</span> - <span>{dateString}</span>
                        </PostDetails>
                        { expanded ? <span dangerouslySetInnerHTML={{__html: sub.description}}></span> : null }
                    </div>
                </PostTextGroup>
            </div>
        </StyledPostLink>
    );
}

export default SubLink;