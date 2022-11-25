import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { readFileSync } from "fs";
import { LaunchMyNftCmClient } from "../client";
import { getVersionedCandyMachine } from "../client/utils";
import { fromTxError } from "../client/gen/errors";
import { readConfigFile } from "./config";

// Launch my NFT fee wallet (should be the same for every mint/candy machine).
const LMN_FEE_WALLET = "33nQCgievSd3jJLSWFBefH3BJRN7h6sAoS82VFFdJGF5";

(async () => {
  const { rpcUrl, collectionHyperspaceUrl, payerKeypairFile } =
    readConfigFile("../config.json");

  const connection = new Connection(rpcUrl);
  const feeWallet = new PublicKey(LMN_FEE_WALLET);
  const mint = Keypair.generate();
  const client = LaunchMyNftCmClient(connection);
  const payer = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(readFileSync(payerKeypairFile, "utf8")))
  );

  const address = collectionHyperspaceUrl.split("/").pop();
  if (!address) throw new Error("Invalid collection URL");

  const candyMachineAddress = new PublicKey(address);
  const candyMachine = await getVersionedCandyMachine(
    connection,
    candyMachineAddress
  );
  if (!candyMachine) throw new Error("Candy machine not found!");

  if (
    candyMachine.version === "V2" ||
    candyMachine.version === "V3" ||
    candyMachine.version === "V4"
  )
    throw new Error("Unsupported candy machine version!");

  const ix = client[`createMint${candyMachine.version}Instruction`]({
    feeWallet,
    mint: mint.publicKey,
    payer: payer.publicKey,
    wallet: candyMachine.wallet,
    candyMachine: candyMachineAddress,
  });

  try {
    const tx = new Transaction().add(ix);
    const txSig = await sendAndConfirmTransaction(connection, tx, [
      payer,
      mint,
    ]);
    console.log("Transaction signature:", txSig);
  } catch (e) {
    const parsed = fromTxError(e);
    if (parsed) throw parsed;
    throw e;
  }
})().then(() => console.log("done!"));
