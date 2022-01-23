const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const PlaygroundContract = await hre.ethers.getContractFactory("Playground");
    const playgroundContract = await PlaygroundContract.deploy();

    await playgroundContract.deployed();
    console.log("Playground Contract address:", playgroundContract.address);

    saveFrontendFiles(playgroundContract);

}

function saveFrontendFiles(contract) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/abis";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify({ PlaygroundContract: contract.address }, undefined, 2)
    );

    const PlaygroundContractArtifact = artifacts.readArtifactSync("Playground");

    fs.writeFileSync(
        contractsDir + "/Playground.json",
        JSON.stringify(PlaygroundContractArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });