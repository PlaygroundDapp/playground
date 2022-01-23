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

  const getSnapshot = async function() {
    const tokenIdsByAddress = new Map(); // owner address => [{tokenId, share}]
    for(let i = 0; i < await playground.totalSupply(); i++) {
      const tokenId = await playground.tokenByIndex(i);
      const address = await playground.ownerOf(tokenId);
      const share = await playground.shares(tokenId);

      if(!tokenIdsByAddress[address]) {
        tokenIdsByAddress[address] = [];
      }
      tokenIdsByAddress[address].push({ tokenId, share });
    }
    return tokenIdsByAddress;
  }

  describe("mint", function () {
    it("can mint NFTs", async () => {
      await niceMint();

      for(const shareholder of shareholders) {
        await expect(
          await playground.balanceOf(shareholder.address)
        ).to.equal(1);
      }

      const totalSupply = await playground.totalSupply();
      expect(totalSupply).to.equal(shareholders.length);

      const snapshot = await getSnapshot();
      let totalShares = 0;

      for(let i = 0; i < shareholders.length; i++) { 
        const address = shareholders[i].address;
        const tokens = snapshot[address];

        expect(tokens).to.be.an('array');
        expect(tokens.length).to.equal(1);

        for(const token of tokens) {
          totalShares += parseInt(token.share);
        }
      }

      expect(
        totalShares
      ).to.equal(await playground.totalShares());
    });

    it("cannot mint with 0 share", async () => {
      await expect(
        playground.connect(owner).mint(shareholders[0].address, 0)
      ).to.be.revertedWith(
        "Amount should be bigger than 0"
      );
    });
  });
});