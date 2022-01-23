import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import MintPage from "./pages/Mint"
import ClaimPage from "./pages/Claim"
import "./input.css"

function App() {
  return (
    // <div className="App">
    //   Ethereum Fullstack Template
    // </div>
    <Router>
      <Routes>
      {/* <Route path="/" exact > <MintPage /> </Route> */}
      <Route path='/' element={<MintPage/>} />
      <Route path='/claim' element={<ClaimPage/>} />
      </Routes>
      
    </Router>
  );
}

export default App;