import React from "react";
import Header from "../components/nav/Nav.js";
import Container from "../components/containers/MainContainer";
import Depositing from "../components/deposit/Depositing";

export default function DepositPage() {
  return (
    <>
      <Header />
      <Container>
        <Depositing />
      </Container>
    </>
  );
}
