## Commands

- Install dependencies - `npm install`
- Clean project - `npx hardhat clean`
- Compile contracts and generate typechain types - `npx hardhat compile`
- Run tests - `npx hardhat test`
- Deploy contracts - `npx hardhat ignition deploy ignition/modules/USDToken.ts --network arbitrumSepolia`
- Run sandbox script - `npx hardhat run scripts/sandbox.ts --network arbitrumSepolia`
- Verify contract - `npx hardhat verify --network arbitrumSepolia 0x0000000000000000000000000000000000000000`
- Clean ignition deployment - `npx hardhat ignition wipe chain-421614 ProductModule#Product`

## How to test integration with Tableland

1. Run local node - `npx hardhat node --network local-tableland`
2. Run script - `npx hardhat run scripts/tableland.ts --network localhost`
