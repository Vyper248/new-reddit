import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import Download from './Download';
import Upload from './Upload';

const StyledComp = styled.div`

`

const BackupRestore = () => {
    const dispatch = useDispatch();
    const saved = useSelector(state => state.saved);
    const subs = useSelector(state => state.subs);

    const setSubs = (val) => dispatch({type: 'SET_SUBS', payload: val});
    const setSaved = (val) => dispatch({type: 'SET_SAVED', payload: val});

    const onUploadSubs = (data) => {
        //data checks
        let valid = true;
        if (!Array.isArray(data)) valid = false;
        if (data.length === 0) valid = false;

        if (!valid) {
            alert('File not valid');
            return;
        }

        //set to state and save to localstorage
        setSubs(data);
        localStorage.setItem('subs', JSON.stringify(data));
    }
    
    const onUploadSaved = (data) => {
        //data checks
        let valid = true;
        if (!Array.isArray(data)) valid = false;
        if (data.length === 0) valid = false;
        for (let i = 0; i < data.length; i++) {
            let obj = data[i];
            if (typeof obj !== 'object') { valid = false; break; }
            if (!obj.id || !obj.title || !obj.sub || !obj.url) { valid = false; break; }
        }

        if (!valid) {
            alert('File not valid');
            return;
        }

        //merge with existing data
        let newSaved = [...saved];
        data.forEach(savedItem => {
            if (saved.find((obj) => obj.id === savedItem.id)) return;
            newSaved.push(savedItem);
        });

        //set to state and save to localstorage
        setSaved(newSaved);
        localStorage.setItem('saved', JSON.stringify(newSaved));
    }

    const onUploadBoth = (data) => {
        if (data.subs !== undefined) onUploadSubs(data.subs);
        if (data.saved !== undefined) onUploadSaved(data.saved);
    }

    return (
        <StyledComp>
            <p>Download and Upload the list of subs and saved posts.</p>
            <div id="group">
                <div>Sub List</div>
                <Upload onUpload={onUploadSubs}/>
                <Download data={subs} filename='Reddit Sub List.json'/>
            </div>
            <div id="group">
                <div>Save List</div>
                <Upload onUpload={onUploadSaved}/>
                <Download data={saved} filename='Reddit Saved List.json'/>
            </div>
            <div id="group">
                <div>Both</div>
                <Upload onUpload={onUploadBoth}/>
                <Download data={{subs: subs, saved: saved}} filename='Reddit Backup.json'/>
            </div>
        </StyledComp>
    );
}

export default BackupRestore;