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
`;

export default ButtonList;