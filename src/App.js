import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";

import Page from './MainPage';

const App = () => {
    return (
        <Router>
            <Route path="/" component={Page}/>
        </Router>
    );
}

export default App;