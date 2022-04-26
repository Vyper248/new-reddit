import React from 'react';
import { format } from 'date-fns';

import BasicButton from '../Styled/BasicButton';

const Download = ({data, filename=`Data - ${format(new Date(),'yyyy-MM-dd')}.json`}) => {
    const downloadJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));

        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", filename);
        link.click();
    }

    return (
        <BasicButton onClick={downloadJson}>Download</BasicButton>
    );
}

export default Download;