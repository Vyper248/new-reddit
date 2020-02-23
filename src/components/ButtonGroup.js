import styled from 'styled-components';

const ButtonGroup = styled.div`
    display: flex;

    & > a {
        flex-grow: 1;
    }

    & > label {
        border-left: 1px solid gray;
    }

    & > button:last-of-type {
        border-left: 1px solid gray;
    }
`;

export default ButtonGroup;