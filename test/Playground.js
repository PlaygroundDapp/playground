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
    shareholders.push({
      address: signers[1].address,
      share: 50
    });
    shareholders.push({
      address: signers[2].address,
      share: 20
    });
    shareholders.push({
      address: signers[3].address,
      share: 10
    });
    shareholders.push({
      address: signers[4].address,
      share: 10
    });
    shareholders.push({
      address: signers[5].address,
      share: 10
    });
  });

  const niceMint = async function() {
    for(const shareholder of shareholders) {
      await playground.connect(owner).mint(shareholder.address, shareholder.share);
    }
  };

  describe("mint", function () {
    it("can mint", async () => {
      await niceMint();

      for(const shareholder of shareholders) {
        await expect(
          await playground.balanceOf(shareholder.address)
        ).to.equal(1);
      }
    });
  });
});