import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import { useDispatch, useSelector } from 'react-redux';
import { FaCopy } from 'react-icons/fa'; 

import QRReader from './QRReader';
import BasicButton from '../Styled/BasicButton';
import Input from '../Styled/Input';
import ButtonGroup from '../Styled/ButtonGroup';
import SideButton from '../Styled/SideButton';

const StyledComp = styled.div`
    margin-top: 10px;
    padding: 10px;

    #qrcode {
        background-color: white;
        padding: 10px;
        margin: 10px;
        margin-bottom: 10px;
    }

    #qrCodeValue {
        margin-bottom: 10px;

        & > svg {
            cursor: pointer;

            &:hover {
                filter: brightness(75%);
            }
        }
    }
`

//check data every second to see if it's been received by other device
const checkData = async (uniqueID, intervalObj) => {
    return new Promise ((resolve, reject) => {
        intervalObj.resolve = resolve;
        intervalObj.reject = reject;

        let numberOfChecks = 0;
    
        intervalObj.interval = setInterval(async () => {
            let dataToSend = {
                uniqueID: uniqueID,
                type: 'check',
                finalCheck: numberOfChecks >= 29 ? true : false
            }
    
            try {
                let response = await fetch('https://sync-serverless.netlify.app/.netlify/functions/sync', {
                    method: 'POST',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(dataToSend)
                });
    
                let data = await response.json();

                numberOfChecks++;
                //if status is no change, then receiving device hasn't done anything yet, so return
                if (data.status === 'noChange') return;
    
                //otherwise, data has change or timed out, so clear and resolve
                clearInterval(intervalObj.interval);
                resolve(data)
            } catch (err) {
                console.log('Error Checking: ', err.message);
                clearInterval(intervalObj.interval);
                reject(err);
            }
        }, 1000);
    });
}

const sendData = async (uniqueID, subs, saved, blockedUsers, type='merge') => {
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
                type: 'subStrings',
                subKey: 'subs',
                objects: subs
            },
            {
                key: 'SET_SAVED',
                type: 'objects',
                syncKey: 'id',
                objects: saved
            },
            {
                key: 'SET_BLOCKED_USERS',
                type: 'strings',
                objects: blockedUsers
            }
        ]
    };
    try {
        let response = await fetch('https://sync-serverless.netlify.app/.netlify/functions/sync', {
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
    const blockedUsers = useSelector(state => state.blockedUsers);

    const [beginSync, setBeginSync] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const [syncStatus, setSyncStatus] = useState({status: '', message: ''});
    const [intervalObj, setIntervalObj] = useState({interval: null});

    const [loading, setLoading] = useState('');

    //create a uniqueID to use for the QR code
    const randomNumber = Math.round(Number(Date.now() + '' + Math.random()*10000))+'';
    const [uniqueID, setUniqueID] = useState(randomNumber);

    const [manualQRCode, setManualQRCode] = useState('');

    //make sure the interval is cleared if there is one
    useEffect(() => {
        return () => {
            if (intervalObj.interval) clearInterval(intervalObj.interval);
        }
    }, []);

    const onStartSyncing = (type) => async () => {
        setLoading(type);
        //save the data to the server
        let dataSent = await sendData(uniqueID, subs, saved, blockedUsers, type);
        if (dataSent.status === 'success') {
            setLoading('');
            setBeginSync(true);
            setSyncStatus({status: '', message: ''});

            //start checking if data has been received by other device and then update state
            let dataReceived = await checkData(uniqueID, intervalObj);
            let message = updateState(dataReceived);
            setSyncStatus(message);
            setBeginSync(false);
            setIntervalObj({interval: null});
        } else {
            setLoading('');
            setSyncStatus({status: 'error', message: 'Error sending data to server, please try again.'});
            setBeginSync(false);
        }
    }

    const cancelSyncUp = () => {
        //clear interval
        clearInterval(intervalObj.interval);

        //resolve promise and reset obj
        intervalObj.resolve({status: 'error', data: ''});

        //new ID ready for the next attempt
        const randomNumber = Math.round(Number(Date.now() + '' + Math.random()*10000))+'';
        setUniqueID(randomNumber);
    }

    const onStartSyncDown = () => {
        setSyncStatus({status: '', message: ''});
        setShowScanner(true);
        setManualQRCode('');
    }

    const onCancelSyncDown = () => {
        setSyncStatus({status: '', message: ''});
        setShowScanner(false);
    }

    const onSetQRCode = async (value) => {
        setShowScanner(false);
        let returnObj = await sendData(value, subs, saved, blockedUsers, 'receive');
        let message = updateState(returnObj);
        setSyncStatus(message);
    }

    const onClickManualCodeGo = () => {
        onSetQRCode(manualQRCode);
    }

    const onChangeManualCode = (e) => {
        setManualQRCode(e.target.value);
    }

    const onClickManualCodeCopy = () => {
        try {
            navigator.clipboard.writeText(uniqueID);
        } catch (err) {
            alert("Can only copy over https.");
            console.log('Can\'t copy on an unsecure server.');
        }
    }

    const updateState = (returnObj) => {
        if (returnObj.status === 'success' && typeof returnObj.data !== 'string') {
            let data = returnObj.data;
            data.forEach(obj => {
                dispatch({type: obj.key, payload: obj.objects})
            });
            return {status: 'success', message: 'Sync Complete'};
        } else if (returnObj.status === 'error') {
            return {status: 'error', message: returnObj.data};
        } else {
            return {status: returnObj.status, message: returnObj.data};
        }
    }

    if (beginSync === false && showScanner === false) {
        return (
            <StyledComp>
                { syncStatus.status === 'success' 
                    ? <div style={{color: '#00FF00', marginBottom: '10px'}}>{syncStatus.message}</div>
                    : <div style={{color: '#FF0000', marginBottom: '10px'}}>{syncStatus.message}</div>
                }
                <div>Please choose the direction to sync. Note: using Up or Down will overwrite data.</div><br/>

                <div>Up syncs from this device to the one scanning. </div>
                <BasicButton onClick={onStartSyncing('up')}>{ loading === 'up' ? 'Loading...' : 'Up' }</BasicButton>

                <div>Merge combines the data from both.</div>
                <BasicButton onClick={onStartSyncing('merge')}>{ loading === 'merge' ? 'Loading...' : 'Merge' }</BasicButton>

                <div>Down syncs from the device scanning to this one. </div>
                <BasicButton onClick={onStartSyncing('down')}>{ loading === 'down' ? 'Loading...' : 'Down' }</BasicButton>
                <br/><br/>

                <div>Or scan for the QR Code from another device.</div>
                <BasicButton onClick={onStartSyncDown}>Scan QR Code</BasicButton>
            </StyledComp>
        );
    }

    if (beginSync) {
        return (
            <StyledComp>
                <div id='qrcode'>
                    <QRCode value={uniqueID} size={180}/>
                </div>
                <div id='qrCodeValue'>{uniqueID} <FaCopy onClick={onClickManualCodeCopy}/></div>
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
                    Scan the QR code or enter manually
                </div>
                { showScanner ? <QRReader setQRCode={onSetQRCode}/> : null }
                <ButtonGroup>
                    <Input value={manualQRCode} onChange={onChangeManualCode} style={{border: '1px solid white', color: 'white'}}/>
                    <SideButton onClick={onClickManualCodeGo} style={{border: '1px solid white', borderLeft: 'none'}}>Go</SideButton>
                </ButtonGroup>
                <BasicButton onClick={onCancelSyncDown}>Cancel</BasicButton>
            </StyledComp>
        );
    }
}

export default Sync;