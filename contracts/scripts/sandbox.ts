import { ethers } from "hardhat";
import { Product } from "../typechain-types";

async function main() {
  const productContractAddress = "0x02008a8DBc938bd7930bf370617065B6B0c1221a";
  const productContractFactory = await ethers.getContractFactory("Product");
  const productContract = productContractFactory.attach(
    productContractAddress
  ) as Product;
  console.log(await productContract.getNextTokenId());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
