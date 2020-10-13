import styled from 'styled-components';

const Flair = styled.span`
    margin-right: 5px;
    padding: 1px 3px;
    color: ${props => props.color === 'light' ? 'white' : 'black'};
    background-color: ${props => props.backgroundColor};
    cursor: pointer;
`;

export default Flair;