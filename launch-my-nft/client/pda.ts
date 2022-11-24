import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./gen/programId";

export const getTotalMintsAddress = ({
  payer,
  candyMachine,
}: {
  payer: PublicKey;
  candyMachine: PublicKey;
}): PublicKey =>
  findProgramAddressSync(
    [Buffer.from("TotalMints"), payer.toBuffer(), candyMachine.toBuffer()],
    PROGRAM_ID
  )[0];
