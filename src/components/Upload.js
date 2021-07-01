import React from 'react';
import { useState, useRef } from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    display: inline-flex;
    margin: 5px;
    color: white;

    & > input {
        display: none;
    }

    & > #filename {
        color: white;
        width: 150px;
        height: 28px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        padding: 5px;
        border: 1px solid gray;
        border-radius: 5px 0px 0px 5px;
    }

    & > #uploadButton {
        display: inline-block;
        height: 28px;
        padding: 5px 10px;
        background-color: gray;
        border-radius: 0px 5px 5px 0px;
    }

    & > #uploadButton:hover {
        cursor: pointer;
        filter: brightness(75%);
    }

    & > #filename:hover {
        cursor: pointer;
    }
`;

const Upload = ({onUpload=()=>{}}) => {
    const [importData, setImportData] = useState(null);
    const [fileName, setFileName] = useState('Choose a File');
    const fileInput = useRef(null);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file === undefined) return;

        if (file.type.match('application/json')) {
            const reader = new FileReader();
            setFileName(file.name);

            reader.onload = (e) => {
                let text = reader.result;
                let obj = JSON.parse(text);
                
                setImportData(obj);
            }

            reader.readAsText(file);
        } else {
            setImportData(null);
            setFileName('Incorrect File Type');
        }
    }

    const onImport = () => {
        if (importData) {
            setFileName('File Uploaded')
            onUpload(importData);
            setImportData(null);
            fileInput.current.value = '';
        } else {
            setFileName('Choose a File');
        }
    }

    const uniqueId = 'fileUpload-' + Math.floor(Math.random() * 100);

    return (
        <StyledComp>
            <input type='file' id={uniqueId} onChange={onFileChange} ref={fileInput}/>
            <label id='filename' htmlFor={uniqueId}>{fileName}</label>
            <div id='uploadButton' onClick={onImport}>Upload</div>
        </StyledComp>
    );
}

export default Upload;