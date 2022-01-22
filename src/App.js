import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import MintPage from "./pages/Mint"

function App() {
  return (
    // <div className="App">
    //   Ethereum Fullstack Template
    // </div>
    <Router>
      <Routes>
      {/* <Route path="/" exact > <MintPage /> </Route> */}
      <Route path='/' element={<MintPage/>} />
      </Routes>
      
    </Router>
  );
}

export default App;