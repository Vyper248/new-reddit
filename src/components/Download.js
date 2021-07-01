import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

const StyledComp = styled.div`
    background-color: black;
    color: white;
    width: 150px;
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
    display: inline-block;
    border: 1px solid gray;

    &:hover {
        cursor: pointer;
        background-color: gray;
    }
`;

const Download = ({data, filename=`Data - ${format(new Date(),'yyyy-MM-dd')}.json`}) => {
    const downloadJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));

        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", filename);
        link.click();
    }

    return (
        <StyledComp onClick={downloadJson}>Download</StyledComp>
    );
}

export default Download;