import React from 'react';
import './SideBar.css';
import SubList from './SubList';
import SortButtons from './SortButtons';

const SideBar = ({onSortClick, currentSort}) => {
    return (
        <div className="sidebar">
            <h3>Sort By</h3>
            <SortButtons onClick={onSortClick} currentSort={currentSort} sortList={1}/>
            <h3>Subs</h3>
            <SubList />
        </div>
    );
};

export default SideBar;