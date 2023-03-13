import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { gatherData, analyseData } from './UserStats.utils';

import UserTable from './UserTable';

const StyledUserStats = styled.div`
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    padding-bottom: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;

    #options {
        margin-bottom: 5px;

        span {
            margin-right: 10px;
            margin-left: 10px;
        }
    }

    #userTables {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        grid-gap: 10px;
        width: 100%;
        max-width: 800px;
        margin: auto;
    }

    @media screen and (max-width: 700px) {
        #userTables {
            grid-template-columns: 1fr;
            min-height: auto;
            max-height: 1200px;
        }

        #options {
            span {
                display: block;
            }
        }
    }
`;

const UserStats = ({username=''}) => {
    const currentSub = useSelector(state => state.currentSub);

    const [submissionData, setSubmissionData] = useState([]);
    const [commentData, setCommentData] = useState([]);
    const [submissionCount, setSubmissionCount] = useState(0);
    const [ignoreProfile, setIgnoreProfile] = useState(false);
    const [focusSub, setFocusSub] = useState('');
    const [ignoreComments, setIgnoreComments] = useState(true);

    const [domainsSubmittedFrom, setDomainsSubmittedFrom] = useState([]);
    const [subsSubmittedTo, setSubsSubmittedTo] = useState([]);
    const [accountsSubmittedFrom, setAccountsSubmittedFrom] = useState([]);
    const [subsCommentedTo, setSubsCommentedTo] = useState([]);

    const setData = ({submissionCount, domainsSubmittedFrom, subsSubmittedTo, accountsSubmittedFrom, subsCommentedTo}) => (submissions, comments) => {
        setSubmissionCount(submissionCount);
        setDomainsSubmittedFrom(domainsSubmittedFrom);
        setSubsSubmittedTo(subsSubmittedTo);
        setAccountsSubmittedFrom(accountsSubmittedFrom);
        setSubsCommentedTo(subsCommentedTo);

        setSubmissionData(submissions);
        setCommentData(comments);
    }

    //get data on first render or if username changes
    useEffect(() => {
        let controller = new AbortController();

        const getData = async () => {
            setData({ submissionCount: 0, domainsSubmittedFrom: [], subsSubmittedTo: [], accountsSubmittedFrom: [], subsCommentedTo: []})([], []);
            await gatherData(username, setData, controller, ignoreComments);
        }
        getData();

        return () => {
            if (controller) controller.abort();
        }
    }, [username, ignoreComments]);

    //if ignore profile or focus sub are changed, analyse data again, but don't fetch
    useEffect(() => {
        if (submissionData.length > 0 || commentData.length > 0) {
            let data = analyseData(submissionData, commentData, ignoreProfile, username, focusSub);
            setData(data)(submissionData, commentData);
        }
    }, [ignoreProfile, focusSub, submissionData, commentData, username]);

    const onClickFocus = (e) => {
        if (e.target.checked) setFocusSub(currentSub);
        else setFocusSub('');
    }

    const onClickIgnoreProfile = (e) => {
        setIgnoreProfile(e.target.checked);
    }

    const onClickIgnoreComments = (e) => {
        setIgnoreComments(e.target.checked);
    }

    if (username.length === 0){
        return (
            <div></div>
        );
    }

    //use this instead of submission count for tables as it'll be accurate when focussing on sub too
    let domainCount = domainsSubmittedFrom.reduce((a, obj) => a + obj.count, 0);
    
    return (
        <StyledUserStats className="userStats roundedBorder">
            <div id="userSummary">
                <h3>Available History for {username}</h3>
                <p>{submissionCount} submissions.</p>
                <p>{commentData.length} comments.</p>
            </div>
            <div id='options'>
                <span>
                    <label>Focus on this Sub: </label>
                    <input type='checkbox' value={focusSub === currentSub} onClick={onClickFocus}/>
                </span>
                <span>
                    <label>Ignore user profile: </label>
                    <input type='checkbox' value={ignoreProfile} onClick={onClickIgnoreProfile}/>
                </span>
                <span>
                    <label>Ignore comments: </label>
                    <input type='checkbox' value={ignoreComments} checked={ignoreComments} onClick={onClickIgnoreComments}/>
                </span>
            </div>
            <div id="userTables">
                <UserTable username={username} headings={['Domains Submitted From', 'Count', '%']} data={domainsSubmittedFrom} type="domains" total={domainCount} totalComments={commentData.length}/>
                <UserTable username={username} headings={['Subreddit Submitted To', 'Count', '%']} data={subsSubmittedTo} type="subsSubmitted" total={submissionCount} totalComments={commentData.length}/>
                <UserTable username={username} headings={['Subreddit Commented In', 'Count', '%']} data={subsCommentedTo} type="subsCommented" total={submissionCount} totalComments={commentData.length}/>
                <UserTable username={username} headings={['Account Submitted From', 'Count', '%']} data={accountsSubmittedFrom} type="accounts" total={domainCount} totalComments={commentData.length}/>
            </div>
        </StyledUserStats>
    )
}

export default UserStats;