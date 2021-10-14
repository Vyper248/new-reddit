import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa'

import { parseBodyText } from '../functions/useful';

import LoadingSpinner from './Styled/LoadingSpinner';

const StyledComp = styled.div`
    & > div#mainImageOuter {
        position: relative;
    }

    & > div#caption {
        text-align: center;
        font-size: 0.9em;
        margin-bottom: 5px;
    }

    & > div#thumbnails {
        display: flex;
        max-width: 100%;
        justify-content: center;
        align-items: center;
        flex-flow: wrap;
    }

    & > div#thumbnails > img {
        margin: 5px;
        user-select: none;
    }

    & > div#thumbnails > img:hover {
        cursor: pointer;
    }

    & > div#thumbnails > img.selected {
        border: 1px solid red;
    }

    & #galleryInner {
        padding-top: 50%;
    }
    
    & #galleryImgDiv {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
    }

    & #galleryImgDiv a {
        align-self: center;
        width: calc(100% - 100px);
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    & #galleryImgDiv img {
        max-width: 100%;
        max-height: 100%;
        user-select: none;
    }

    & #galleryBack, & #galleryForward {
        position: absolute;
        top: 50%;
        z-index: 3;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        background-color: black;
        opacity: 0.6;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
    }

    & #galleryBack:hover, & #galleryForward:hover {
        cursor: pointer;
        background-color: gray;
    }

    & #galleryBack {
        transform: translate(0,-50%) rotate(90deg);
        left: -15px;
    }

    & #galleryForward {
        transform: translate(0,-50%) rotate(-90deg);
        right: -15px;
    }

    & #galleryBack > svg, & #galleryForward > svg {
        position: relative;
        top: 2px;
    }

    @media screen and (max-width: 700px) {
        & #galleryBack:hover, & #galleryForward:hover {
            background-color: black;
        }
    }
`;

//function to get the url based on an index, but if that index doesn't exist, it gets the next largest image.
const getURL = (arr, index) => {
    let limit = 6;
    while (true && limit > 0) {
        if (arr[index] !== undefined) return parseBodyText(arr[index].u);
        else index--;
        limit--;
    }
}

const Gallery = ({data, extraData}) => {
    let firstId = extraData && extraData.items.length > 0 ? extraData.items[0].media_id : '';
    const [id, setId] = useState(firstId);
    const isMobile = useMediaQuery({ maxWidth: 700 });
    const level4 = useMediaQuery({ maxWidth: 960 });
    const level5 = useMediaQuery({ maxWidth: 2560 });
    let numberOfImages = extraData.items ? extraData.items.length : 0;
    const [showSpinner, setShowSpinner] = useState(true);

    if (!data) return <p>Post has been removed</p>;

    let sortedData = {};
    extraData.items.forEach(item => sortedData[item.media_id] = data[item.media_id]);
    let index = Object.keys(sortedData).indexOf(id);

    let url = '';
    if (level5) url = getURL(data[id].p, 5);
    if (level4) url = getURL(data[id].p, 4);
    if (isMobile) url = getURL(data[id].p, 3);
    let fullUrl = parseBodyText(data[id].s.u);

    let caption = `${index+1}/${numberOfImages}`;
    let extraDataObj = extraData.items.find(obj => obj.media_id === id);
    if (extraDataObj !== undefined) {
        if (extraDataObj.caption !== undefined) caption += ' - Caption: ' + extraDataObj.caption;
    }

    const onClickThumb = (id) => () => {
        setId(id);
        setShowSpinner(true);
    }

    const next = () => {
        let arr = Object.keys(sortedData);
        let index = arr.indexOf(id);
        let next = index+1;
        if (next >= arr.length) next = 0;
        let nextId = arr[next];
        setId(nextId);
        setShowSpinner(true);
    }

    const previous = () => {
        let arr = Object.keys(sortedData);
        let index = arr.indexOf(id);
        let prev = index-1;
        if (prev < 0) prev = arr.length-1;
        let prevId = arr[prev];
        setId(prevId);
        setShowSpinner(true);
    }

    const onImageLoad = () => {
        setShowSpinner(false);
    }

    return (
        <StyledComp>
            { caption.length > 0 ? <div id="caption">{ caption }</div> : null }
            <div id="mainImageOuter">
                <div id="galleryInner">
                    <div onClick={previous} id="galleryBack"><FaChevronDown/></div>
                    <div onClick={next} id="galleryForward"><FaChevronDown/></div>
                    { showSpinner ? <LoadingSpinner style={{position: 'absolute', left: 'calc(50% - 25px)', top: 'calc(50% - 50px)', zIndex: '0'}}/> : null }
                    <div id="galleryImgDiv">
                        <a key={id} href={fullUrl} target="_blank" rel="noopener noreferrer"><img src={url} alt="Gallery Main" onLoad={onImageLoad}/></a>
                    </div>
                </div>
            </div>
            <div id="thumbnails">
            {
                isMobile ? null : extraData.items.map((obj,i) => {
                    let dataObj = data[obj.media_id];
                    return <img key={obj.id} src={parseBodyText(dataObj.p[0].u)} onClick={onClickThumb(obj.media_id)} alt="Thumbnail" className={id === obj.media_id ? 'selected' : ''}/>
                })
            }
            </div>
        </StyledComp>
    );
}

export default Gallery;