import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { LaunchMyNftCmClient } from "../client";
import { CandyMachineV5 } from "../client/gen/accounts";
import { resolve } from "path";
import { readFileSync } from "fs";

const RPC_URL = "https://broken-shy-sun.solana-mainnet.quiknode.pro";
const PAYER_KEYPAIR_FILE = resolve(__dirname, "..", "..", "phantom.json");

(async () => {
  const connection = new Connection(RPC_URL);
  const { createMintV5Instruction } = LaunchMyNftCmClient(connection);

  const payer = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(readFileSync(PAYER_KEYPAIR_FILE, "utf8")))
  );

  const candyMachineAddress = new PublicKey(
    "Fqr9tGtG7rXG3Q9hWWZeyDG5o5d6UFqzjYFNaBfSEBF4"
  );

  const accInfo = await connection.getAccountInfo(candyMachineAddress);
  const candyMachine = CandyMachineV5.decode(accInfo!.data);
  const mint = Keypair.generate();
  const ix = createMintV5Instruction({
    mint: mint.publicKey,
    payer: payer.publicKey,
    wallet: candyMachine.wallet,
    wallet2: candyMachine.wallet,
    candyMachine: candyMachineAddress,
  });

  const tx = new Transaction().add(ix);
  const txSig = await sendAndConfirmTransaction(connection, tx, [payer, mint]);
  console.log(txSig);
})().then(() => console.log("done!"));
