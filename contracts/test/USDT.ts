import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("USDToken", function () {
  async function initFixture() {
    // Get signers
    const [deployer, userOne, userTwo, userThree] = await ethers.getSigners();
    // Deploy contracts
    const usdTokenContractFactory = await ethers.getContractFactory("USDToken");
    const usdTokenContract = await usdTokenContractFactory.deploy();
    return {
      deployer,
      userOne,
      userTwo,
      userThree,
      usdTokenContract,
    };
  }

  it("Should support the main flow", async function () {
    const { deployer, usdTokenContract } = await loadFixture(initFixture);
    expect(await usdTokenContract.balanceOf(deployer)).to.be.equal(
      ethers.parseEther("1000")
    );
  });
});
