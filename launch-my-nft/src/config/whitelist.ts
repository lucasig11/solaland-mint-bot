import { PublicKey } from "@solana/web3.js";

type WhitelistCollection = {
  type: "collection";
  collection: PublicKey;
};

type WhitelistCreator = {
  type: "creator";
  creator: PublicKey;
};

type Whitelist = WhitelistCollection | WhitelistCreator;

export default [
  // {
  //   type: "collection",
  //   collection: new PublicKey(""),
  // },
  // {
  //   type: "creator",
  //   creator: new PublicKey(""),
  //   index: 0,
  // },
] as Whitelist[];
