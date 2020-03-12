import styled from 'styled-components';

const LoadingSpinner = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid red;
    border-top: 0px;
    border-bottom: 0px;
    margin: auto;
    margin-top:40px;
    position: relative;
    animation-name: rotate;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    &:after {
        content:'';
        display: block;
        position: absolute;
        top: 2px;
        left: 2px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid red;
        border-left: 0px;
        border-right: 0px;
        margin: auto;
        animation-name: rotate;
        animation-duration: 0.5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        animation-direction: reverse;
    }

    &:before {
        content:'';
        display: block;
        position: absolute;
        top: 10px;
        left: 4px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid red;
        border-top: 0px;
        border-bottom: 0px;
        margin: auto;
        animation-name: rotate;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        
        to {
            transform: rotate(360deg);
        }
    }
`;

export default LoadingSpinner;