const hre = require("hardhat");

const main = async () => {
    // This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory
    // hre - hardhat run time environment 

    // const [owner, randomPerson] = await hre.ethers.getSigners();
    const signers = await hre.ethers.getSigners();
    const owner = signers[0];
    const shareholders = [
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
    const playgroundFactory = await hre.ethers.getContractFactory("Playground");
    const playgroundContract = await playgroundFactory.deploy("Project", "PG", [owner.address], [100]);
    await playgroundContract.deployed();
    console.log("Contract deployed to:", playgroundContract.address);
    console.log("Contract deployed by:", owner.address);

    let totalSupply = playgroundContract.totalSupply();
    


    // let waveCount;
    // waveCount = await playgroundContract.getTotalWaves();
  
    // let waveTxn = await playgroundContract.wave();
    // await waveTxn.wait();
    
    // waveTxn = await playgroundContract.connect(randomPerson).wave();
    // await waveTxn.wait();
  
    // waveCount = await playgroundContract.getTotalWaves();
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();

//   to run npx hardhat run scripts/run.js