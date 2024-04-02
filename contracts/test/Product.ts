import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

// TODO: Fix tests to support or ignore Tableland
describe("Product", function () {
  async function initFixture() {
    // Get signers
    const [deployer, userOne, userTwo, userThree] = await ethers.getSigners();
    // Deploy contracts
    const usdTokenContractFactory = await ethers.getContractFactory("USDToken");
    const usdTokenContract = await usdTokenContractFactory.deploy();
    const productContractFactory = await ethers.getContractFactory("Product");
    const productContract = await productContractFactory.deploy();
    // Send usd tokens to users
    await usdTokenContract
      .connect(deployer)
      .transfer(userOne, ethers.parseEther("100"));
    await usdTokenContract
      .connect(deployer)
      .transfer(userTwo, ethers.parseEther("50"));
    await usdTokenContract
      .connect(deployer)
      .transfer(userThree, ethers.parseEther("10"));
    return {
      deployer,
      userOne,
      userTwo,
      userThree,
      usdTokenContract,
      productContract,
    };
  }

  it("Should support the main flow", async function () {
    const { userOne, userTwo, usdTokenContract, productContract } =
      await loadFixture(initFixture);
    // Create product
    await expect(
      productContract
        .connect(userOne)
        .create(
          ethers.parseEther("2"),
          usdTokenContract.getAddress(),
          60 * 10,
          "ipfs://1"
        )
    ).to.be.not.reverted;
    const productId = (await productContract.getNextTokenId()) - 1n;
    // Approve
    await expect(
      usdTokenContract
        .connect(userTwo)
        .approve(productContract.getAddress(), ethers.MaxUint256)
    ).to.be.not.reverted;
    // Subscribe
    await expect(
      productContract.connect(userTwo).subscribe(productId, "test@test.com")
    ).to.changeTokenBalances(
      usdTokenContract,
      [userTwo, productContract],
      [ethers.parseEther("-2"), ethers.parseEther("2")]
    );
    // Process subscribers without changing time
    await expect(productContract.processSubscribers()).to.changeTokenBalances(
      usdTokenContract,
      [userTwo, productContract],
      [ethers.parseEther("0"), ethers.parseEther("0")]
    );
    // Process subscribers with changing time
    await time.increase(15 * 60);
    await expect(productContract.processSubscribers()).to.changeTokenBalances(
      usdTokenContract,
      [userTwo, productContract],
      [ethers.parseEther("-2"), ethers.parseEther("2")]
    );
    // Withraw
    await expect(
      productContract.connect(userOne).withdraw(productId)
    ).to.changeTokenBalances(
      usdTokenContract,
      [userOne, productContract],
      [ethers.parseEther("4"), ethers.parseEther("-4")]
    );
  });
});
