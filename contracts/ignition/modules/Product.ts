import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const productModule = buildModule("ProductModule", (m) => {
  const product = m.contract("Product", [], {});

  return { product };
});

export default productModule;
