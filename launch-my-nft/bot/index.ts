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
import { PROGRAM_ID } from "../client/gen/programId";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import BN from "bn.js";

const RPC_URL = "https://broken-shy-sun.solana-mainnet.quiknode.pro";
const PAYER_KEYPAIR_FILE = resolve(__dirname, "..", "..", "keypair.json");

(async () => {
  const connection = new Connection(RPC_URL);
  const { createMintV5Instruction } = LaunchMyNftCmClient(connection);

  const payer = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(require("fs").readFileSync(PAYER_KEYPAIR_FILE)))
  );

  const candyMachineAddress = new PublicKey(
    "Fqr9tGtG7rXG3Q9hWWZeyDG5o5d6UFqzjYFNaBfSEBF4"
  );

  const accInfo = await connection.getAccountInfo(candyMachineAddress);

  if (!accInfo) throw new Error("Candy machine not found");

  const candyMachine = CandyMachineV5.decode(accInfo?.data);
  console.log(candyMachine.toJSON());

  const totalMints = findProgramAddressSync(
    [
      Buffer.from("total_mints"),
      candyMachineAddress.toBuffer(),
      payer.publicKey.toBuffer(),
    ],
    PROGRAM_ID
  )[0];
  console.log("totalMints:", totalMints.toBase58());

  const mint = Keypair.generate();
  const num = new BN([0x00, 0x87, 0x93, 0x03], "le");
  // MintV6 expect
  // const num = new BN([0x00, 0x94, 0x35, 0x77], "le");
  const ix = createMintV5Instruction({
    expect: num,
    proof: [],
    mint: mint.publicKey,

    payer: payer.publicKey,
    wallet: candyMachine.wallet,
    wallet2: candyMachine.wallet,

    candyMachine: candyMachineAddress,
  });
  console.log([...ix.data].map((x) => x.toString(16)).join(" "));

  const tx = new Transaction().add(ix);
  const txSig = await sendAndConfirmTransaction(connection, tx, [payer, mint]);
  console.log(txSig);
})().then(() => console.log("done!"));
