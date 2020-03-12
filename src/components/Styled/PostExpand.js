import styled from 'styled-components';

const PostExpand = styled.div`
    display: inline-flex;
    position: relative;
    float: right;
    border-bottom: 1px solid ${props => props.stickied ? '#50ec11' : 'red'};
    border-left: 1px solid ${props => props.stickied ? '#50ec11' : 'red'};
    color: gray;
    width: 32px;
    height: 32px;

    & > svg {
        margin: auto;
    }

    &:hover {
        cursor: pointer;
        color: white;
    }
`;

export default PostExpand;