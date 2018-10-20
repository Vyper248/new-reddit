import React from 'react';
import {NavLink} from 'react-router-dom';
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
                    return <NavLink className="navLink" activeClassName="active" key={i} to={link}>{sub}</NavLink>
                })
            }
        </div>
    );
};

export default SubList;