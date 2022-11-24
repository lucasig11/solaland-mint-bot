import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RevealV6Accounts {
  candyMachine: PublicKey
  metadata: PublicKey
  tokenMetadataProgram: PublicKey
}

export function revealV6(accounts: RevealV6Accounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.candyMachine, isSigner: false, isWritable: true },
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
    {
      pubkey: accounts.tokenMetadataProgram,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([96, 31, 203, 62, 198, 112, 162, 73])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
