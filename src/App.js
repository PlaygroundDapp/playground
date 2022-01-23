import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MintPage from "./pages/Mint";
import ClaimPage from "./pages/Claim";
import "./input.css";
import { Web3ContextProvider } from "./context/Web3Context";
import DepositPage from "./pages/Deposit";

function App() {
  return (
    // <div className="App">
    //   Ethereum Fullstack Template
    // </div>
    <Web3ContextProvider>
      <Router>
        <Routes>
          {/* <Route path="/" exact > <MintPage /> </Route> */}
          <Route path="/" element={<MintPage />} />
          <Route path="/claim" element={<ClaimPage />} />
          <Route path="/deposit" element={<DepositPage />} />
        </Routes>
      </Router>
    </Web3ContextProvider>
  );
}

export default App;
