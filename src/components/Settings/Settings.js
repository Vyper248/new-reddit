import React, { useState } from 'react';
import styled from 'styled-components';

import BackupRestore from './BackupRestore';
import Sync from './Sync';
import BasicButton from '../Styled/BasicButton';

const StyledComp = styled.div`
    text-align: center;

    & > #group {
        margin-top: 20px;
    }
`;

const Settings = () => {
    const [subPage, setSubPage] = useState('');

    const onClickBackup = () => {
        setSubPage('Backup');
    }

    const onClickSync = () => {
        setSubPage('Sync');
    }

    return (
        <StyledComp>
            <h3>Settings</h3>
            <BasicButton onClick={onClickBackup}>Backup/Restore</BasicButton>
            <BasicButton onClick={onClickSync}>Sync</BasicButton>
            { subPage === 'Backup' ? <BackupRestore/> : null }
            { subPage === 'Sync' ? <Sync/> : null }
        </StyledComp>
    );
}

export default Settings;