import React from "react";
import { BrowserRouter as Router, Route, Routes, HashRouter } from "react-router-dom";
import "./input.css";
import { Web3ContextProvider } from "./context/Web3Context";
import { ModalContextProvider } from "./components/modal/Modal";

import Header from "./components/nav/Nav.js";
import Container from "./components/containers/MainContainer";

import Mint from "./pages/Mint";
import Claim from "./pages/Claim";
import Deposit from "./pages/Deposit";

function App() {
  return (
    <Web3ContextProvider>
      <ModalContextProvider>
      <HashRouter>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Mint />} />
            <Route path="/claim" element={<Claim />} />
            <Route path="/deposit" element={<Deposit />} />
          </Routes>
        </Container>
      </HashRouter>
      </ModalContextProvider>
    </Web3ContextProvider>
  );
}

export default App;
