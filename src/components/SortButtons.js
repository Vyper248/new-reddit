import React from 'react';

const SortButtons = ({onClick, currentSort}) => {
    let sortOptions = [
        'Hot','New','Rising','Controversial','Top'
    ];
    
    return (
        <div className="sortButtons">
            {
                sortOptions.map((option,i) => {
                    let className = 'sortButton';
                    if (option.toLowerCase() === currentSort){
                        className += ' active';
                    }
                    return <span key={i} className={className} onClick={onClick}>{option.toLowerCase()}</span>
                })
            }
        </div>
    );
};

export default SortButtons;