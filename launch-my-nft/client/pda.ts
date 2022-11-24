import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./gen/programId";

export const getTotalMintsAddress = ({
  mint,
}: {
  mint: PublicKey;
}): PublicKey =>
  findProgramAddressSync(
    [Buffer.from("total_mints"), mint.toBuffer()],
    PROGRAM_ID
  )[0];
