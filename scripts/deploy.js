const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const PlaygroundContract = await hre.ethers.getContractFactory("Playground");
    const playgroundContract = await SampleContract.deploy();

    await playgroundContract.deployed();
    console.log("Sample Contract address:", playgroundContract.address);

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
        JSON.stringify({ SampleContract: contract.address }, undefined, 2)
    );

    const SampleContractArtifact = artifacts.readArtifactSync("Playground");

    fs.writeFileSync(
        contractsDir + "/Playground.json",
        JSON.stringify(SampleContractArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });