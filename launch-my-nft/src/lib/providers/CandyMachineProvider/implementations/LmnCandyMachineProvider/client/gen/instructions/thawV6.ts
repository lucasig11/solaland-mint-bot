import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ThawV6Accounts {
  candyMachine: PublicKey
  mint: PublicKey
  associated: PublicKey
  metadata: PublicKey
  masterEdition: PublicKey
  tokenMetadataProgram: PublicKey
  tokenProgram: PublicKey
}

export function thawV6(accounts: ThawV6Accounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.candyMachine, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.associated, isSigner: false, isWritable: true },
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
    { pubkey: accounts.masterEdition, isSigner: false, isWritable: true },
    {
      pubkey: accounts.tokenMetadataProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([235, 243, 216, 226, 135, 47, 129, 80])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
