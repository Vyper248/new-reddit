import styled from 'styled-components';

const ButtonList = styled.div`
    text-align: center;
    position: relative;

    & *:focus {
        outline: none;
    }

    & * {
        color: white;
    }

    & a, & label {
        width: 100%;
        display: block;
        padding: 5px;
        min-height: 29px;
        border-top: 1px solid gray;
        overflow: hidden;
    }

    & a:hover {
        background-color: gray;
    }

    & a.active, & > a.selected {
        background-color: gray;
    }

    & > button:last-of-type {
        border-bottom: 1px solid gray;
    }

    & > div:last-child {
        border-bottom: 1px solid gray;
    }

    & > div + h3 {
        margin-top: 0px;
        padding-top: 1em;
        border-top: 1px solid gray;
    }

    @media screen and (max-device-width: 600px){
        & div:last-child > * {
            border-bottom: none;
        }   

        & a:hover {
            background-color: black;
        }
    }
`;

export default ButtonList;