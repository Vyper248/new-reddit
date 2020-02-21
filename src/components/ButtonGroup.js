import styled from 'styled-components';

const ButtonGroup = styled.div`
    display: flex;
    border-top: 1px solid gray;

    &:last-of-type {
        border-bottom: 1px solid gray;
    }

    & > a {
        display: block;
        padding: 5px;
        min-height: 29px;
        flex-grow: 1;
    }

    & > a:hover {
        background-color: gray;
    }

    & > a.active, & > a.selected {
        background-color: gray;
    }

    @media screen and (max-device-width: 600px){
        &:last-of-type {
            border-bottom: none;
        }   
    }
`;

export default ButtonGroup;