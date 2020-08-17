import styled from 'styled-components';

const ButtonGroup = styled.div`
    display: flex;

    & > div {
        flex-grow: 1;
    }

    & > a {
        flex-grow: 1;
    }

    & > a.selected, & > button.selected {
        background-color: gray;
    }

    & > label {
        border-left: 1px solid gray;
    }

    & > *:last-child {
        border-left: 1px solid gray;
    }

    & > *:first-child {
        border-left: none;
    }

    & .handle {
        width: 40px;
        min-width: 40px;
        height: 31px;
        border-top: 1px solid gray;
        border-right: 1px solid gray;
    }

    & .handle:hover {
        cursor: pointer;
    }
`;

export default ButtonGroup;