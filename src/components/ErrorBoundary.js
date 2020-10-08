import React from 'react';
import styled from 'styled-components';

const StyledError = styled.div`
    margin: 10px;
    text-align: center;

    h2 {
        margin-top: 20px;
    }

    button {
        border: 1px solid red;
        background-color: black;
        color: white;
        font-size: 1.5em;
        margin-top: 20px;
    }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({error: error.message});
  }

  resetError = () => {
        this.setState({hasError: false});
        this.props.history.push('/');
    }

  render() {
    if (this.state.hasError) {
        return (
            <StyledError>
                { this.props.history !== undefined ? <h2>Sorry, something went wrong.</h2> : <h2>This Component Could Not Be Loaded</h2> }
                <div>Error Message: {this.state.error}</div>
                { this.props.history !== undefined ? <button onClick={this.resetError}>Reset</button> : null }
            </StyledError>
        );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;