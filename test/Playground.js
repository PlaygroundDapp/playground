const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");


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
    it("can mint NFTs", async () => {
      await niceMint();

      for(const shareholder of shareholders) {
        await expect(
          await playground.balanceOf(shareholder.address)
        ).to.equal(1);
      }

      const totalSupply = await playground.totalSupply();

      expect(
        totalSupply
      ).to.equal(shareholders.length);

      let totalShares = 0;

      for(let i = 0; i < totalSupply; i++) { 

        const tokenId = await playground.tokenByIndex(i);

        expect(
          await playground.tokenOfOwnerByIndex(shareholders[i].address, 0)
        ).to.equal(tokenId);

        await expect(
          playground.tokenOfOwnerByIndex(shareholders[i].address, 1)
        ).to.be.revertedWith("ERC721Enumerable: owner index out of bounds");

        expect(
          await playground.ownerOf(tokenId)
        ).to.equal(shareholders[i].address);

        totalShares += (await playground.shares(tokenId)).toNumber();
      }

      expect(
        totalShares
      ).to.equal(await playground.totalShares());
    });
  });
});