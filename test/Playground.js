const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Playground Contract", () => {
  let playground;
  let owner;
  let shareholders = [];

  beforeEach(async () => {
    const Playground = await ethers.getContractFactory("Playground");
    playground = await Playground.deploy();
    await playground.deployed();

    const signers = await ethers.getSigners();
    owner = signers[0];
    shareholders.push([signers[1], 50]);
    shareholders.push([signers[2], 20]);
    shareholders.push([signers[3], 10]);
    shareholders.push([signers[4], 10]);
    shareholders.push([signers[5], 10]);
    
    const projectId = playground.createProject();
  });

  describe("mint", function () {
    it("createProject to return project id", async () => {
      playground
    });
  });
});