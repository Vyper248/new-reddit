import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import { useDispatch, useSelector } from 'react-redux';

import QRReader from './QRReader';
import BasicButton from '../Styled/BasicButton';

const StyledComp = styled.div`
    margin-top: 10px;
    padding: 10px;
    #qrcode {
        background-color: white;
        padding: 10px;
    }
`

const sendData = async (uniqueID, subs, saved, url, type='merge', signal) => {
    //app ID to make sure both requests come from the same app
    const appID = 'asui248a9db37gruba92ge';

    let dataToSend = {
        uniqueID: uniqueID,
        appId: appID,
        type: type,
        syncComplete: false,
        objects: [
            {
                key: 'SET_SUBS',
                type: 'strings',
                objects: subs
            },
            {
                key: 'SET_SAVED',
                type: 'objects',
                syncKey: 'id',
                objects: saved
            }
        ]
    };
    try {
        let response = await fetch('https://general-sync-server.herokuapp.com/api/'+url, {
            signal: signal,
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(dataToSend)
        })
        let data = await response.json();
        return data;
    } catch (err) {
        return {err: err.message};
    }
}

const Sync = () => {
    const dispatch = useDispatch();

    const saved = useSelector(state => state.saved);
    const subs = useSelector(state => state.subs);

    const [serverReady, setServerReady] = useState(false);
    const [beginSyncUp, setBeginSyncUp] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const [syncStatus, setSyncStatus] = useState({status: '', message: ''});

    const [fetchController, setFetchController] = useState(new AbortController());

    //create a uniqueID to use for the QR code
    const randomNumber = Math.round(Number(Date.now() + '' + Math.random()*10000))+'';
    const [uniqueID, setUniqueID] = useState(randomNumber);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const checkServer = async () => {
            try {
                let response = await fetch('https://general-sync-server.herokuapp.com/', { signal });
                let data = await response.json();
                if (data.status === 'Ready') {
                    setServerReady(true);
                }
            } catch (err) {
                console.log(err.message);
            }
        }
        checkServer();

        //on unmount, abort any outstanding fetch requests
        return () => {
            controller.abort();
            fetchController.abort();
        }
    }, []);

    const onStartSyncingUp = (type) => async () => {
        setBeginSyncUp(true);
        setSyncStatus({status: '', message: ''});
        let returnObj = await sendData(uniqueID, subs, saved, 'send', type, fetchController.signal);

        //if use leaves the settings section, the fetch is aborted, so don't need to update state.
        if (returnObj.err === 'The user aborted a request.') return;
        console.log(returnObj);
        let message = updateState(returnObj);
        setSyncStatus(message);
        setBeginSyncUp(false);
    }

    const cancelSyncUp = () => {
        setBeginSyncUp(false);

        //abort the current fetch and create a new abortController
        fetchController.abort();
        setFetchController(new AbortController());

        //new ID ready for the next attempt
        const randomNumber = Math.round(Number(Date.now() + '' + Math.random()*10000))+'';
        setUniqueID(randomNumber);
    }

    const onStartSyncDown = () => {
        setSyncStatus({status: '', message: ''});
        setShowScanner(true);
    }

    const onCancelSyncDown = () => {
        setSyncStatus({status: '', message: ''});
        setShowScanner(false);
    }

    const onSetQRCode = async (value) => {
        setShowScanner(false);
        let returnObj = await sendData(value, subs, saved, 'receive', '', fetchController.signal);
        let message = updateState(returnObj);
        setSyncStatus(message);
    }

    const updateState = (returnObj) => {
        if (returnObj.status === 'success' && typeof returnObj.data !== 'string') {
            let data = returnObj.data;
            data.forEach(obj => {
                dispatch({type: obj.key, payload: obj.objects})
            });
            return {status: 'success', message: 'Sync Successful'};
        } else if (returnObj.status === 'error') {
            return {status: 'error', message: returnObj.data};
        } else {
            return {status: returnObj.status, message: returnObj.data};
        }
    }

    if (serverReady === false) {
        return (
            <StyledComp>
                Waiting for Server...
            </StyledComp>
        );
    }

    if (beginSyncUp === false && showScanner === false) {
        return (
            <StyledComp>
                { syncStatus.status === 'success' 
                    ? <div style={{color: '#00FF00', marginBottom: '10px'}}>{syncStatus.message}</div>
                    : <div style={{color: '#FF0000', marginBottom: '10px'}}>{syncStatus.message}</div>
                }
                <div>Please choose the direction to sync. Note: using Up or Down will overwrite data.</div><br/>

                <div>Up syncs from this device to the one scanning. </div>
                <BasicButton onClick={onStartSyncingUp('up')}>Up</BasicButton>

                <div>Merge combines the data from both.</div>
                <BasicButton onClick={onStartSyncingUp('merge')}>Merge</BasicButton>

                <div>Down syncs from the device scanning to this one. </div>
                <BasicButton onClick={onStartSyncingUp('down')}>Down</BasicButton>
                <br/><br/>

                <div>Or scan for the QR Code from another device.</div>
                <BasicButton onClick={onStartSyncDown}>Scan QR Code</BasicButton>
            </StyledComp>
        );
    }

    if (beginSyncUp) {
        return (
            <StyledComp>
                <div id='qrcode' style={{margin: '10px', marginBottom: '20px'}}>
                    <QRCode value={uniqueID} size={180}/>
                </div>
                <div>
                    Scan the QR code on the device you want to sync with.
                </div>
                <br/>
                <div>
                    Waiting for data.
                </div>
                <br/>
                <BasicButton onClick={cancelSyncUp}>Cancel</BasicButton>
            </StyledComp>
        );
    }

    if (showScanner) {
        return (
            <StyledComp>
                <div>
                    Scan the QR code
                </div>
                { showScanner ? <QRReader setQRCode={onSetQRCode}/> : null }
                <BasicButton onClick={onCancelSyncDown}>Cancel</BasicButton>
            </StyledComp>
        );
    }
}

export default Sync;