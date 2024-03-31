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
    product: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
};
