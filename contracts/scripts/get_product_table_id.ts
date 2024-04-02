import { ethers } from "hardhat";
import { Product } from "../typechain-types";

async function main() {
  const productContractAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";
  const productContractFactory = await ethers.getContractFactory("Product");
  const productContract = productContractFactory.attach(
    productContractAddress
  ) as Product;
  console.log("Table ID:", await productContract.tableId());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
