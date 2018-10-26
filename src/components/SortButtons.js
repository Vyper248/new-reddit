import React from 'react';
import './SortButtons.css';

const SortButtons = ({onClick, currentSort, sortList}) => {
    let sortChoices = {
        1: ['Hot','New','Rising','Controversial','Top'],
        2: ['Best','New','Top','Controversial','Old', 'Q&A'],
    }
    let sortOptions = sortChoices[sortList];
    
    return (
        <div className="sortButtons">
            {
                sortOptions.map((option,i) => {
                    let className = 'sortButton';
                    if (option.toLowerCase() === currentSort){
                        className += ' active';
                    } else if (option.toLowerCase() === 'best' && currentSort === 'confidence'){
                        className += ' active';
                    } else if (option.toLowerCase() === 'q&a' && currentSort === 'qa'){
                        className += ' active';
                    }
                    return <span key={i} className={className} onClick={onClick}>{option.toLowerCase()}</span>
                })
            }
        </div>
    );
};

export default SortButtons;