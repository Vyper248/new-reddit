import React from 'react';
import {Link} from 'react-router-dom';

const SubList = () => {
    return (
        <div>
            <Link to="/PSVR">PSVR</Link>&nbsp;
            <Link to="/PS4">PS4</Link>&nbsp;
            <Link to="/Apple">Apple</Link>&nbsp;
        </div>
    );
};

export default SubList;