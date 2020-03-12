import styled from 'styled-components';

const PostTitle = styled.div`
    margin-top: 10px;
    padding-right: 5px;

    & :hover {
        cursor: pointer;
    }

    @media screen and (max-device-width: 600px){
        font-size: 0.9em;
    }
`;

export default PostTitle;