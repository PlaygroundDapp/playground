const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Project Factory Contract", async function () {
  let projectFactory;
  const [owner, shareholder1, shareholder2] = await ethers.getSigners();  

  beforeEach(async () => {
    const ProjectFactory = await ethers.getContractFactory("ProjectFactory");
    projectFactory = await ProjectFactory.deploy();
    await projectFactory.deployed();
  });

  describe("createProject", function () {
    it("create project to deploy a new contract", async function() {
        const tx = await projectFactory.connect(owner).createProject(
            'To The Moon',
            'TTM',
            [
                shareholder1.address,
                shareholder2.address,
            ],
            [
                51,
                49
            ]
        );
        const receipt = await tx.wait();
        const events = receipt.events.filter(event => event.event === 'ProjectCreated');

        expect(events.length).to.equal(1);

        const projectAddress = events[0].args[0];
        const Playground = await ethers.getContractFactory("Playground");
        const playground = await Playground.attach(projectAddress);

        expect(await playground.name()).to.equal('To The Moon');
        expect(await playground.symbol()).to.equal('TTM');

        expect(playground).to.have.deep.property('deposit');
        expect(playground).to.have.deep.property('claim');
    })
  });
});