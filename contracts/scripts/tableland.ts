import { ethers } from "hardhat";
import axios from "axios";
import hre from "hardhat";

async function main() {
  // Check network
  if (hre.network.name !== "localhost") {
    throw new Error("Script works only on localhost");
  }

  // Deploy usdt contract
  const usdtContractFactory = await ethers.getContractFactory("USDToken");
  const usdtContract = await usdtContractFactory.deploy();
  await usdtContract.waitForDeployment();
  console.log("USDT contract address:", await usdtContract.getAddress());

  // Deploy product contract
  const productContractFactory = await ethers.getContractFactory("Product");
  const productContract = await productContractFactory.deploy();
  await productContract.waitForDeployment();
  console.log("Product contract address:", await productContract.getAddress());
  console.log("Table ID:", await productContract.tableId());

  // Create product
  await productContract.create(
    ethers.parseEther("2"),
    await usdtContract.getAddress(),
    60 * 10,
    "ipfs://1"
  );
  const productId = (await productContract.getNextTokenId()) - 1n;

  // Approve transfer USDT
  await usdtContract.approve(productContract.getAddress(), ethers.MaxUint256);

  // Subscribe
  await productContract.subscribe(productId, "test@test.com");

  // Timeout to make sure table is created and updated
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Print tableland data
  const url = "http://127.0.0.1:8080";
  const tableName = "product_payments";
  const chain = "31337";
  const tableId = await productContract.tableId();
  //   const tableId = 4;
  const statement = `select%20%2A%20from%20${tableName}_${chain}_${tableId.toString()}`;
  const { data } = await axios.get(
    `${url}/api/v1/query?statement=${statement}`
  );
  console.log("Tableland data:", data);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
