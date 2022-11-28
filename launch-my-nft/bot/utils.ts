import { Keypair, PublicKey } from "@solana/web3.js";
import { readFileSync } from "fs";
import { Task } from "./config";

export const getCollectionFromUrl = (url: string): PublicKey => {
  const address = url.split("/").pop();
  if (!address) throw new Error("Invalid collection URL");
  return new PublicKey(address);
};

export const readKeypairFile = (file: string): Keypair => {
  return Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(readFileSync(file, "utf8")))
  );
};

export const formatTask = ({
  hyperspaceUrl,
  maxMintAmount,
  payerKeypairFile,
  startDate,
}: Task) => {
  const collection = getCollectionFromUrl(hyperspaceUrl);
  const payerPubkey = readKeypairFile(payerKeypairFile).publicKey;
  return `  Collection: ${collection}
    Max mint amount: ${maxMintAmount}
    Payer: ${payerPubkey}
    Start date: ${startDate}`;
};
