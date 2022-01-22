import React from "react";
import Header from "../components/nav/Nav.js";
import Container from "../components/containers/MainContainer";
import Minting from "../components/mint/Minting"

export default function MintPage() {
    return (
        <>
        <Header />
        <Container>
        <Minting />
        </Container>
        
        </>
    )
    
}