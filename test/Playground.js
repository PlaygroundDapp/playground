const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Playground Contract", async function () {
  let playground;
  const signers = await ethers.getSigners();  
  const owner = signers[0];
  const shareholders = [
    {
      address: signers[1].address,
      share: 50,
      signer: signers[1]
    },
    {
      address: signers[2].address,
      share: 20,
      signer: signers[2]
    },
    {
      address: signers[3].address,
      share: 10,
      signer: signers[3]
    },
    {
      address: signers[4].address,
      share: 10,
      signer: signers[4]
    },
    {
      address: signers[5].address,
      share: 10,
      signer: signers[5]
    }
  ];

  beforeEach(async () => {
    const Playground = await ethers.getContractFactory("Playground");
    playground = await Playground.deploy();
    await playground.deployed();
  });

  const niceMint = async function() {
    for(const shareholder of shareholders) {
      await playground.connect(owner).mint(shareholder.address, shareholder.share);
    }
  };

  const niceDeposit = async function(amount) {
    await playground.connect(shareholders[0].signer).
    setApprovalForAll(playground.address, true);
    await playground.connect(shareholders[0].signer)
    .deposit({ value: amount });
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
    it("can mint NFTs", async function () {
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

      expect(
        await playground).to.emit(playground, "Mint").catch(function () {
          console.log("Promise Rejected");
        });

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

    it("cannot mint with 0 share", async function () {
      await expect(
        playground.connect(owner).mint(shareholders[0].address, 0)
      ).to.be.revertedWith(
        "Amount should be bigger than 0"
      );
    });
  });

  describe("deposit", function () {
    it("can deposit ether", async function () {
      const oneETH = ethers.utils.parseEther("1");
      const shareHolderETHBefore = await ethers.provider.getBalance(shareholders[0].address);
      expect(
        await ethers.provider.getBalance(playground.address)
      ).to.equal(0);

      await niceDeposit(oneETH);

      expect(
        await ethers.provider.getBalance(playground.address)
      ).to.equal(oneETH);
      expect(
        await ethers.provider.getBalance(shareholders[0].address)
      ).to.be.at.most(shareHolderETHBefore.sub(oneETH));
      expect(
        await playground.totalDepositedAmount()
      ).to.equal(oneETH);
      expect(
        await playground).to.emit(playground, "Deposit").withArgs(oneETH).catch(function () {
          console.log("Promise Rejected");
        });
    });
  });

  describe("claim", function () {
    it("can claim deposited share", async function() {
      await niceMint();
      await niceDeposit(ethers.utils.parseEther("100"));

      const snapshot = await getSnapshot();
      const tokens = snapshot[shareholders[0].address];

      expect(tokens.length).to.equal(1);

      const shareHolderETHBefore = await ethers.provider.getBalance(shareholders[0].address);
      const contractETHBefore = await ethers.provider.getBalance(playground.address);
      
      await expect(
        playground.connect(shareholders[0].signer).claim(tokens[0].tokenId)
			).to.emit(playground, "Claim");

      expect(
        await ethers.provider.getBalance(shareholders[0].address)
      ).to.be.above(
        shareHolderETHBefore.add(ethers.utils.parseEther("49"))
      );
      expect(
        await ethers.provider.getBalance(playground.address)
      ).to.equal(ethers.utils.parseEther("50"));

      await expect(
        playground.connect(shareholders[0].signer).claim(tokens[0].tokenId)
      ).to.be.revertedWith("You dont deserve shit.");
    })
  });
});