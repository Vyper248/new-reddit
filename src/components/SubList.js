import React from 'react';
import {Link} from 'react-router-dom';
import './SubList.css';

const SubList = () => {
    
    //temp sub list (maybe change to browser storage?)
    const subs = [
        'PSVR','PS4','Apple','iPhone','NoMansSkyTheGame','Minecraft','PS4Deals'
    ];
    
    return (
        <div className="subLinks">
            {
                subs.map((sub,i) => {
                    const link = '/'+sub;
                    return <Link className="subLink" key={i} to={link}>{sub}</Link>
                })
            }
        </div>
    );
};

export default SubList;