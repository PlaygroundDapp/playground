import React from "react";
import Header from "../components/nav/Nav.js";
import Container from "../components/containers/MainContainer";
import Claiming from "../components/claim/Claiming"

export default function ClaimPage() {
    return (
        <>
          <Header />
          <Container>
            <Claiming />
          </Container>
        </>
    )
}