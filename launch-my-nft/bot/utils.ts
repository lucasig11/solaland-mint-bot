import { Keypair, PublicKey } from "@solana/web3.js";
import { readFileSync } from "fs";

export const getCandyMachineFromUrl = (url: string): PublicKey => {
  const address = url.split("/").pop();
  if (!address) throw new Error("Invalid collection URL");
  return new PublicKey(address);
};

export const readKeypairFile = (file: string): Keypair => {
  return Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(readFileSync(file, "utf8")))
  );
};
