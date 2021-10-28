import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { formatDistanceStrict } from 'date-fns';

import { parseBodyText, getLocalUrl } from '../functions/useful';
import { parsePostBody } from './Post';

const StyledComp = styled.div`
    border: 1px solid gray;
    border-radius: 5px;
    margin: 5px;
    margin-top: 10px;
    padding: 10px;

    & > div:first-child {
        border-bottom: 1px solid gray;
        padding: 5px;

        & > a {
            display: block;
            color: white;
            font-weight: bold;
        }

        & > div {
            margin-top: 5px;
            color: gray;
            text-align: left;
            margin-bottom: 5px;

            & a {
                color: gray;
            }
        }
    }

    & > div:last-child {
        border-bottom: none;
        padding-bottom: 0px;
    }

    @media screen and (max-width: 700px) {
        margin: 0px;
    }
`

const Crosspost = ({data}) => {
    const currentSub = useSelector(state => state.currentSub);
    const currentPostId = useSelector(state => state.currentPostId);

    const { title, selftext_html, url, media, media_embed, media_metadata, is_gallery, gallery_data, author, created_utc, permalink, num_comments } = data;
    let body = parseBodyText(selftext_html);
    let bodyTag = parsePostBody(body, url, media, media_embed, permalink, title, currentSub, media_metadata, is_gallery, gallery_data);  

    //a crosspost will always be a local url, so use that as link
    let localUrl = getLocalUrl(permalink, currentSub, currentPostId);

    //get relative time string
    let dateString = formatDistanceStrict(new Date(), created_utc*1000);

    return (
        <StyledComp>
            <div>
                <a href={localUrl}>{title}</a>
                <div><a href={`#/user/${author}`}>{author}</a> - {num_comments} comments - {dateString}</div>
            </div>
            { bodyTag }
        </StyledComp>
    );
}

export default Crosspost;