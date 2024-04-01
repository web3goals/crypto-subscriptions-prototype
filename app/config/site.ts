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
    product: "0x02008a8DBc938bd7930bf370617065B6B0c1221a" as `0x${string}`,
    usdt: "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59" as `0x${string}`,
  },
};
