import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { resolve } from "path";
import { readFileSync } from "fs";

import { LaunchMyNftCmClient } from "../client";
import {
  decodeCandyMachine,
  // getCandyMachines,
  getCandyMachineVersion,
} from "../client/utils";

// Path to the payer's keypair file.
const PAYER_KEYPAIR_FILE = resolve(__dirname, "..", "..", "keypair.json");

// Launch my NFT fee wallet (should be the same for every mint/candy machine).
const LMN_FEE_WALLET = new PublicKey(
  "33nQCgievSd3jJLSWFBefH3BJRN7h6sAoS82VFFdJGF5"
);

// Solana JsonRPC URL.
const RPC_URL = "https://ssc-dao.genesysgo.net";

// TODO: remove this constant once we can find the owner's candy machines.
const CANDY_MACHINE_ADDRESS = new PublicKey(
  "Fqr9tGtG7rXG3Q9hWWZeyDG5o5d6UFqzjYFNaBfSEBF4"
);

// TODO: use this constant instead of CANDY_MACHINE_ADDRESS
// Collection creator (can be found through the collection page URL at LaunchMyNFT website).
// const COLLECTION_CREATOR = "EZNvQ7aLyWXCiyHkLb33zcQvA6aefCFqaRzS4W8Ksk7o";

(async () => {
  const connection = new Connection(RPC_URL);
  const { createMintV5Instruction, createMintV6Instruction } =
    LaunchMyNftCmClient(connection);

  const payer = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(readFileSync(PAYER_KEYPAIR_FILE, "utf8")))
  );

  // TODO: find collection candy machine instead of using a static constant.
  // const candyMachines = await getCandyMachines(
  //   connection,
  //   new PublicKey(COLLECTION_CREATOR)
  // );
  // console.log(
  //   "Owner candy machines:",
  //   candyMachines.map((c) => c.toJSON())
  // );

  const accInfo = await connection.getAccountInfo(CANDY_MACHINE_ADDRESS);
  if (!accInfo) throw new Error("Account not found!");

  const candyMachineVersion = getCandyMachineVersion(accInfo.data);
  const candyMachine = decodeCandyMachine(accInfo.data);
  console.log(candyMachine.toJSON());

  const mint = Keypair.generate();
  let ix: TransactionInstruction;

  switch (candyMachineVersion) {
    case "v5":
      ix = createMintV5Instruction({
        mint: mint.publicKey,
        payer: payer.publicKey,
        wallet: candyMachine.wallet,
        feeWallet: LMN_FEE_WALLET,
        candyMachine: CANDY_MACHINE_ADDRESS,
      });
    case "v6":
      ix = createMintV6Instruction({
        mint: mint.publicKey,
        payer: payer.publicKey,
        wallet: candyMachine.wallet,
        feeWallet: LMN_FEE_WALLET,
        candyMachine: CANDY_MACHINE_ADDRESS,
      });
  }

  const tx = new Transaction().add(ix);
  const txSig = await sendAndConfirmTransaction(connection, tx, [payer, mint]);
  console.log(txSig);
})().then(() => console.log("done!"));
