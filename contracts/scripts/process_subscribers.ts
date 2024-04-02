import { ethers } from "hardhat";
import { Product } from "../typechain-types";

async function main() {
  const productContractAddress = "0x1e4712A93beEc0aa26151CF44061eE91DD56f921";
  const productContractFactory = await ethers.getContractFactory("Product");
  const productContract = productContractFactory.attach(
    productContractAddress
  ) as Product;
  await productContract.processSubscribers();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
