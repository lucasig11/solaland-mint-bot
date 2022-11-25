import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { LaunchMyNftCmClient } from "../client";
import { CandyMachineV5 } from "../client/gen/accounts";
import { resolve } from "path";
import { readFileSync } from "fs";
import {
  decodeCandyMachine,
  getCandyMachines,
  getCandyMachineVersion,
} from "../client/utils";

const RPC_URL = "https://ssc-dao.genesysgo.net";
const PAYER_KEYPAIR_FILE = resolve(__dirname, "..", "..", "keypair.json");
const CANDY_MACHINE_ADDRESS = new PublicKey(
  "Fqr9tGtG7rXG3Q9hWWZeyDG5o5d6UFqzjYFNaBfSEBF4"
);
const LMN_FEE_WALLET = new PublicKey(
  "33nQCgievSd3jJLSWFBefH3BJRN7h6sAoS82VFFdJGF5"
);
const LMN_COLLECTION_URL =
  "https://www.launchmynft.io/collections/EZNvQ7aLyWXCiyHkLb33zcQvA6aefCFqaRzS4W8Ksk7o/0ff2ru6oDKayfazEIZOS";

(async () => {
  const connection = new Connection(RPC_URL);
  const { createMintV5Instruction, createMintV6Instruction } =
    LaunchMyNftCmClient(connection);

  const payer = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(readFileSync(PAYER_KEYPAIR_FILE, "utf8")))
  );

  const collectionCreator = LMN_COLLECTION_URL.split("/").at(-2);
  if (!collectionCreator) throw new Error("Invalid URL");

  const candyMachines = await getCandyMachines(
    connection,
    new PublicKey(collectionCreator)
  );
  console.log("cms", candyMachines.pop());

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
