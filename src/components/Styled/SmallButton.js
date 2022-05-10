import styled from 'styled-components';

const SmallButton = styled.span`
    color: gray;
    font-size: 0.8em;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 2px 5px;
    margin-left: 5px;

    &:hover {
        color: #999;
        background-color: #222;
        cursor: pointer;
    }
`

export default SmallButton;