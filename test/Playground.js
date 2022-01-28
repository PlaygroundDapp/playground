const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Playground Contract", function () {
  let playground;
  let signers;
  let owner;
  let shareholders;
  let newShareholders;
  

  beforeEach(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    shareholders = [
    {
      address: signers[1].address,
      share: 50,
      signer: signers[1],
    },
    {
      address: signers[2].address,
      share: 20,
      signer: signers[2],
    },
    {
      address: signers[3].address,
      share: 10,
      signer: signers[3],
    },
    {
      address: signers[4].address,
      share: 10,
      signer: signers[4],
    },
    {
      address: signers[5].address,
      share: 10,
      signer: signers[5],
    },
  ];

    newShareholders = [
      {
        address: signers[10].address,
        signer: signers[10],
      },
      {
        address: signers[11].address,
        signer: signers[11],
      },
      {
        address: signers[12].address,
        signer: signers[12],
      },
    ]
    const Playground = await ethers.getContractFactory("Playground");
    playground = await Playground.deploy(
      "Playground",
      "PG",
      shareholders.map((entry) => entry.address),
      shareholders.map((entry) => entry.share)
    );
    await playground.deployed();
  });

  const niceDeposit = async function (amount) {
    await playground.connect(owner).setApprovalForAll(playground.address, true);
    await playground.connect(owner).deposit({ value: amount });
  };

  const getSnapshot = async function () {
    const tokenIdsByAddress = new Map(); // owner address => [{tokenId, share}]
    for (let i = 0; i < (await playground.totalSupply()); i++) {
      const tokenId = await playground.tokenByIndex(i);
      const address = await playground.ownerOf(tokenId);
      const share = await playground.shares(tokenId);

      if (!tokenIdsByAddress[address]) {
        tokenIdsByAddress[address] = [];
      }
      tokenIdsByAddress[address].push({ tokenId, share });
    }
    return tokenIdsByAddress;
  };

  describe("mint", function () {
    it("can mint NFTs", async function () {
      for (const shareholder of shareholders) {
        await expect(await playground.balanceOf(shareholder.address)).to.equal(
          1
        );
      }

      const totalSupply = await playground.totalSupply();
      expect(totalSupply).to.equal(shareholders.length);

      const snapshot = await getSnapshot();
      let totalShares = 0;

      expect(await playground)
        .to.emit(playground, "Mint")
        .catch(function () {
          console.log("Promise Rejected");
        });

      for (let i = 0; i < shareholders.length; i++) {
        const address = shareholders[i].address;
        const tokens = snapshot[address];

        expect(tokens).to.be.an("array");
        expect(tokens.length).to.equal(1);

        for (const token of tokens) {
          totalShares += parseInt(token.share);
        }
      }

      expect(totalShares).to.equal(100);
    });
  });

  describe("deposit", function () {
    it("can deposit ether", async function () {
      const oneETH = ethers.utils.parseEther("1");
      const ownerETHBefore = await ethers.provider.getBalance(owner.address);
      expect(await ethers.provider.getBalance(playground.address)).to.equal(0);

      await niceDeposit(oneETH);

      expect(await ethers.provider.getBalance(playground.address)).to.equal(
        oneETH
      );
      expect(await ethers.provider.getBalance(owner.address)).to.be.at.most(
        ownerETHBefore.sub(oneETH)
      );
      expect(
        await playground.connect(shareholders[0].signer).totalDepositedAmount()
      ).to.equal(oneETH);
      expect(await playground)
        .to.emit(playground, "Deposit")
        .withArgs(oneETH)
        .catch(function () {
          console.log("Promise Rejected");
        });
    });
  });

  describe("claim", function () {
    it("can claim deposited share", async function () {
      await niceDeposit(ethers.utils.parseEther("100"));

      const snapshot = await getSnapshot();
      const [shareholder1, shareholder2] = shareholders;
      const shareholder1ETHBefore = await ethers.provider.getBalance(
        shareholder1.address
      );
      const shareholder2ETHBefore = await ethers.provider.getBalance(
        shareholder2.address
      );
      const contractETHBefore = await ethers.provider.getBalance(
        playground.address
      );

      expect(snapshot[shareholder1.address].length).to.equal(1);
      expect(snapshot[shareholder2.address].length).to.equal(1);

      const shareholder1Token = snapshot[shareholder1.address][0]; // 50% share
      const shareholder2Token = snapshot[shareholder2.address][0]; // 20% share

      expect(contractETHBefore).to.equal(ethers.utils.parseEther("100"));

      await expect(
        playground.connect(shareholder1.signer).claim(shareholder1Token.tokenId)
      ).to.emit(playground, "Claim");

      expect(
        await ethers.provider.getBalance(shareholder1.address)
      ).to.be.above(shareholder1ETHBefore.add(ethers.utils.parseEther("49")));
      expect(await ethers.provider.getBalance(playground.address)).to.equal(
        ethers.utils.parseEther("50")
      );

      await expect(
        playground.connect(shareholder1.signer).claim(shareholder1Token.tokenId)
      ).to.be.revertedWith("You dont deserve shit.");

      // More deposit
      await niceDeposit(ethers.utils.parseEther("100"));

      // First time claim for share holder 2
      await playground
        .connect(shareholder2.signer)
        .claim(shareholder2Token.tokenId);

      expect(
        await ethers.provider.getBalance(shareholder2.address)
      ).to.be.above(shareholder2ETHBefore.add(ethers.utils.parseEther("39")));
      expect(await ethers.provider.getBalance(playground.address)).to.equal(
        ethers.utils.parseEther("110")
      );

      // Second time claim for share holder 1
      await playground
        .connect(shareholder1.signer)
        .claim(shareholder1Token.tokenId);
      expect(
        await ethers.provider.getBalance(shareholder1.address)
      ).to.be.above(shareholder1ETHBefore.add(ethers.utils.parseEther("99")));
      expect(await ethers.provider.getBalance(playground.address)).to.equal(
        ethers.utils.parseEther("60")
      );
    });
  });

  describe("split nft", function () {
    // token ids start with 0 
    it("only token owner can call this functin, not even contract owner", async function () {
			await expect(
				playground.connect(owner).splitToken(owner.address, 2, shareholders[0].share)
			).to.be.revertedWith("You do not own this token");
		});

    it("owner can not allocate more shares than what the nft has", async function () {
			await expect(
				playground.connect(shareholders[0].signer).splitToken(shareholders[0].address, 0, shareholders[0].share + 10)
			).to.be.revertedWith("New shares must be less than your available share");
		});

    it("cannot create new nft with 0 shares", async function () {
			await expect(
				playground.connect(shareholders[0].signer).splitToken(shareholders[0].address, 0, 0)
			).to.be.revertedWith("Shares must be greater than 0");
		});

    it("Token split to new user", async function () {
      const currentSupply = await playground.totalSupply();
      const newShareAmount = 10;
      const currentTokenId = 0;
      const sharesOfCurrent = await playground.shares(currentTokenId);
      expect(currentSupply).to.equal(5)
      // user transfering 10% share to someone new 
      await playground.connect(shareholders[0].signer).splitToken(newShareholders[1].address, currentTokenId, newShareAmount);
      const newTotalSupply = await playground.totalSupply()
      expect(newTotalSupply).to.equal(Number(currentSupply) + 1)
      expect(await playground.ownerOf(0)).to.equal(shareholders[0].address);
      const newTokenId = Number(currentSupply);
      expect(await playground.ownerOf(newTokenId)).to.equal(newShareholders[1].address);
      expect(await playground.shares(newTokenId)).to.equal(newShareAmount);
      let totalShares = 0;
      for (let index = 0; index <= newTotalSupply; index++) {
        const amount = await playground.shares(index);
        totalShares += Number(amount);
      }
      console.log({ totalShares })
      expect(totalShares).to.equal(100);
      expect(await playground.shares(currentTokenId)).to.equal(Number(sharesOfCurrent - newShareAmount));

		});
  })
});
