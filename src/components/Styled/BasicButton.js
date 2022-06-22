import styled from 'styled-components';

const BasicButton = styled.div`
    background-color: black;
    color: white;
    width: 150px;
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
    display: inline-block;
    border: 1px solid gray;
    font-size: 1em;

    ${props => props.small ? `
        width: auto;
        margin: 2px;
        padding: 1px 3px;
    ` : ''}

    ${props => props.noBorder ? 'border: none;' : ''}

    &:hover {
        cursor: pointer;
        background-color: gray;
    }
`

export default BasicButton;