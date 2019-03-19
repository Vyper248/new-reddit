import React from 'react';
import {NavLink} from 'react-router-dom';
import './SubList.css';
let pjson = require('../../package.json');

const SubList = (props) => {
    let startPoint = pjson.startPoint;
    //temp sub list (maybe change to browser storage?)
    const subs = [
        'PSVR','PS4','Apple','iPhone','NoMansSkyTheGame','Minecraft','PS4Deals','PS4Dreams','FirewallZeroHour'
    ];
    
    return (
        <div className="subLinks">
            {
                subs.map((sub,i) => {
                    const link = startPoint+'/'+sub;
                    return <NavLink className="navLink" activeClassName="active" key={i} to={link} onClick={props.onClick}>{sub}</NavLink>
                })
            }
        </div>
    );
};

export default SubList;