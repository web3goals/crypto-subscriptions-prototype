import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const usdTokenModule = buildModule("USDTokenModule", (m) => {
  const usdToken = m.contract("USDToken", [], {});

  return { lock: usdToken };
});

export default usdTokenModule;
