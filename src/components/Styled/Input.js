import styled from 'styled-components';

const Input = styled.input`
    cursor: text;
    padding: 5px 10px;
    flex-grow: 1;
    width: 100%;
    margin: 0px;
    background-color: black;
    border: none;
    font-size: 1em;
    text-align: center;
    border-top: 1px solid gray;
    border-radius: 0px;

    &[type="checkbox"] {
        -webkit-appearance:none;
        appearance: none;
        width:30px;
        height:30px;
        background:white;
        border-radius:0px;
        border:1px solid gray;
        border-right: none;
        border-left: none;

        :checked {
            background-color: green;
        }

        :hover {
            cursor: pointer;
        }
    }
`;

export default Input;