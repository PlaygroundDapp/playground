import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./input.css";
import { Web3ContextProvider } from "./context/Web3Context";

import Header from "./components/nav/Nav.js";
import Container from "./components/containers/MainContainer";

import Mint from "./pages/Mint";
import Claim from "./pages/Claim";
import Deposit from "./pages/Deposit";

function App() {
  return (
    <Web3ContextProvider>
      <Header />
      <Container>
        <Router>
          <Routes>
            <Route path="/" element={<Mint />} />
            <Route path="/claim" element={<Claim />} />
            <Route path="/deposit" element={<Deposit />} />
          </Routes>
        </Router>
      </Container>
    </Web3ContextProvider>
  );
}

export default App;
