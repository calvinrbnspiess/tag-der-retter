import React from "react";
import { Router } from "react-static";
import { injectGlobal } from "styled-components";
import { hot } from "react-hot-loader";
import Routes from "react-static-routes";

injectGlobal`
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    font-family: adobe-gothic-std, sans-serif;
    font-style: normal;
    font-weight: 700;
    background-color: #fbfcfb;
  }
`;

const App = () => (
  <Router>
    <Routes />
  </Router>
);

export default hot(module)(App);
