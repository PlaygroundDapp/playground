const { artifacts } = require("hardhat");
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const ProjectFactory = await hre.ethers.getContractFactory("ProjectFactory");
    const factoryContract = await ProjectFactory.deploy();

    await factoryContract.deployed();
    console.log("Factory Contract address:", factoryContract.address);

    saveFrontendFiles(factoryContract);

}

function saveFrontendFiles(contract) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/abis";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify({ FactoryContract: contract.address }, undefined, 2)
    );

    const factoryContractArtifact = artifacts.readArtifactSync("ProjectFactory");
    const playgroundArtifact = artifacts.readArtifactSync("Playground")

    fs.writeFileSync(
        contractsDir + "/ProjectFactory.json",
        JSON.stringify(factoryContractArtifact, null, 2)
    );
    fs.writeFileSync(
        contractsDir + "/Playground.json",
        JSON.stringify(playgroundArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });