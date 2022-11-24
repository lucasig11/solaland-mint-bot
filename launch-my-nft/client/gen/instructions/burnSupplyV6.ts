import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface BurnSupplyV6Args {
  percentToBurn: number
}

export interface BurnSupplyV6Accounts {
  authority: PublicKey
  candyMachine: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.u8("percentToBurn")])

export function burnSupplyV6(
  args: BurnSupplyV6Args,
  accounts: BurnSupplyV6Accounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.candyMachine, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([155, 195, 120, 109, 95, 193, 192, 151])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      percentToBurn: args.percentToBurn,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
