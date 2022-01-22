const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Playground Contract", () => {
  let playground;
  let owner, user;

  beforeEach(async () => {
    const Playground = await ethers.getContractFactory("Playground");
    playground = await Playground.deploy();
    await playground.deployed();

    [owner, user] = await ethers.getSigners();
    
    const projectId = playground.createProject();
  });

  describe("mint", function () {
    it("createProject to return project id", async () => {
      
    });
  });
});