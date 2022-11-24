import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MintV6Args {
  proof: Array<Array<number>>
  expect: BN
}

export interface MintV6Accounts {
  candyMachine: PublicKey
  payer: PublicKey
  wallet: PublicKey
  wallet2: PublicKey
  metadata: PublicKey
  mint: PublicKey
  associated: PublicKey
  masterEdition: PublicKey
  totalMints: PublicKey
  associatedTokenProgram: PublicKey
  tokenMetadataProgram: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.vec(borsh.array(borsh.u8(), 32), "proof"),
  borsh.u64("expect"),
])

export function mintV6(args: MintV6Args, accounts: MintV6Accounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.candyMachine, isSigner: false, isWritable: true },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.wallet, isSigner: false, isWritable: true },
    { pubkey: accounts.wallet2, isSigner: false, isWritable: true },
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: true, isWritable: true },
    { pubkey: accounts.associated, isSigner: false, isWritable: true },
    { pubkey: accounts.masterEdition, isSigner: false, isWritable: true },
    { pubkey: accounts.totalMints, isSigner: false, isWritable: true },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: accounts.tokenMetadataProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([111, 169, 221, 193, 234, 227, 8, 180])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      proof: args.proof,
      expect: args.expect,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
