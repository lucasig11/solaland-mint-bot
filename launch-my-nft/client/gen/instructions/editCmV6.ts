import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface EditCmV6Args {
  data: types.CandyMachineDataV3Fields
}

export interface EditCmV6Accounts {
  authority: PublicKey
  candyMachine: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([types.CandyMachineDataV3.layout("data")])

export function editCmV6(args: EditCmV6Args, accounts: EditCmV6Accounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.candyMachine, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([8, 151, 9, 92, 26, 236, 43, 194])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      data: types.CandyMachineDataV3.toEncodable(args.data),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
