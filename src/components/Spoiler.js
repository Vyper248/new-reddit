import React, { useState } from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    border-bottom: 1px solid #545452;
    margin-bottom: 5px;
    padding: 30px;
    background-color: #545452;
    text-align: center;

    & > span {
        border: 1px solid white;
        border-radius: 5px;
        padding: 10px;
    }

    & > span:hover {
        cursor: pointer;
    }
`;

const Spoiler = ({children, spoiler}) => {
    const [showSpoiler, setShowSpoiler] = useState(false);

    const onClickShow = () => {
        setShowSpoiler(true);
    }

    if (spoiler && !showSpoiler) return <StyledComp><span onClick={onClickShow}>Show Spoiler</span></StyledComp>
    else return <div>{children}</div>
}

export default Spoiler;