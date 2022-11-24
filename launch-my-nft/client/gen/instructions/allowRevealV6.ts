import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AllowRevealV6Args {
  newUri: string
}

export interface AllowRevealV6Accounts {
  authority: PublicKey
  candyMachine: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.str("newUri")])

export function allowRevealV6(
  args: AllowRevealV6Args,
  accounts: AllowRevealV6Accounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.candyMachine, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([26, 70, 81, 233, 255, 128, 149, 36])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      newUri: args.newUri,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
