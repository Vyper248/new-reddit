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
        ${'' /* height: 100%; */}
    }
    
    & #galleryImgDiv img {
        max-width: 100%;
        max-height: 100%;
        min-height: 100%;
    }

    & #galleryButtons {
        position: absolute;
        top: 50%;
        width: 100%;
        display: flex;
        z-index: 3;
        justify-content: space-between;
    }
    
    & #galleryButtons > div {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        background-color: black;
        opacity: 0.6;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
        position: relative;
    }

    & #galleryButtons > div:hover {
        cursor: pointer;
        background-color: gray;
    }

    & #galleryButtons > div:first-child {
        transform: translate(0,-50%) rotate(90deg);
        left: -15px;
    }

    & #galleryButtons > div:last-child {
        transform: translate(0,-50%) rotate(-90deg);
        right: -15px;
    }

    & #galleryButtons > div > svg {
        position: relative;
        top: 2px;
    }

    @media screen and (max-width: 700px) {
        & #galleryButtons > div:hover {
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
    let firstId = data ? Object.keys(data)[0] : '';
    const [id, setId] = useState(firstId);
    const isMobile = useMediaQuery({ maxWidth: 700 });
    const level4 = useMediaQuery({ maxWidth: 960 });
    const level5 = useMediaQuery({ maxWidth: 2560 });
    let index = data ? Object.keys(data).indexOf(id) : 0;
    let numberOfImages = data ? Object.keys(data).length : 0;
    const [showSpinner, setShowSpinner] = useState(true);

    if (!data) return <p>Post has been removed</p>;

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
        let arr = Object.keys(data);
        let index = arr.indexOf(id);
        let next = index+1;
        if (next >= arr.length) next = 0;
        let nextId = arr[next];
        setId(nextId);
        setShowSpinner(true);
    }

    const previous = () => {
        let arr = Object.keys(data);
        let index = arr.indexOf(id);
        let next = index-1;
        if (next < 0) next = arr.length-1;
        let nextId = arr[next];
        setId(nextId);
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
                    <div id="galleryButtons">
                        <div onClick={previous}><FaChevronDown/></div>
                        <div onClick={next}><FaChevronDown/></div>
                    </div>
                    { showSpinner ? <LoadingSpinner style={{position: 'absolute', left: 'calc(50% - 25px)', top: 'calc(50% - 50px)', zIndex: '0'}}/> : null }
                    <div id="galleryImgDiv">
                        <a key={id} href={fullUrl} target="_blank" rel="noopener noreferrer"><img src={url} alt="Gallery Main" onLoad={onImageLoad}/></a>
                    </div>
                </div>
            </div>
            <div id="thumbnails">
            {
                isMobile ? null : Object.values(data).map((obj, i) => {
                    return <img key={obj.id+i} src={parseBodyText(obj.p[0].u)} onClick={onClickThumb(obj.id)} alt="Thumbnail" className={id === obj.id ? 'selected' : ''}/>
                })
            }
            </div>
        </StyledComp>
    );
}

export default Gallery;