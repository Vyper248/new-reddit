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
`;

export default ButtonGroup;