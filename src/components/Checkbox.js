import React from 'react';
import styled from 'styled-components';
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';

const StyledCheckbox = styled.div`
    display: inline-block;
    font-size: 1.5em;
    border-top: 1px solid gray;

    & > svg {
        position: relative;
        top: 2px;
    }

    :hover {
        cursor: pointer;
    }
`; 

const Checkbox = ({checked, onClick}) => {
    return (
        <StyledCheckbox onClick={onClick}>
            { checked ? <MdCheckBox/> : <MdCheckBoxOutlineBlank/> }
        </StyledCheckbox>
    );
}

export default Checkbox;