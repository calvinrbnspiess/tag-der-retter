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
    font-family: "AdobeGothicStd-Bold-Alphabetic";
    background-color: #fbfcfb;
  }

  @font-face {
    font-family: "AdobeGothicStd-Bold-Alphabetic";
    src: url("AdobeGothicStd-Bold.otf") format("otf"),
      url("AdobeGothicStd-Bold-Alphabetic.woff") format("woff");
  }
`;

const App = () => (
  <Router>
    <Routes />
  </Router>
);

export default hot(module)(App);
