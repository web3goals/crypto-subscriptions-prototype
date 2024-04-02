import "@nomicfoundation/hardhat-toolbox";
import "@tableland/hardhat";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  localTableland: {
    silent: false,
    verbose: false,
  },
  networks: {
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL as string,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
