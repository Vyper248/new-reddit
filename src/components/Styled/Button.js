import styled from 'styled-components';

const Button = styled.button`
    background-color: black;
    border: none;
    text-align: center;
    padding: 5px;
    font-size: 1em;
    width: 100%;
    margin: 0px;
    border-top: 1px solid gray;
    color: white;

    ${props => props.selected ? 'background-color: gray;' : ''};

    &:hover {
        cursor: pointer;
        background-color: gray;
    }

    :focus {
        outline: none;
    }
`;

export default Button;