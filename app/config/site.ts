import { arbitrumSepolia } from "viem/chains";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  emoji: "🔁",
  name: "Crypto Subscriptions",
  description: "A platform to manage crypto subscriptions in a few clicks",
  links: {
    github: "https://github.com/web3goals/crypto-subscriptions-prototype",
  },
  contracts: {
    chain: arbitrumSepolia,
    product: "0x1e4712A93beEc0aa26151CF44061eE91DD56f921" as `0x${string}`,
    productTableId: "478",
    productTableName: "product_payments",
    usdt: "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59" as `0x${string}`,
  },
};
