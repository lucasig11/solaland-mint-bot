import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitCmV5Args {
  data: types.CandyMachineDataV3Fields
  seed: PublicKey
  thawDate: BN | null
}

export interface InitCmV5Accounts {
  candyMachine: PublicKey
  wallet: PublicKey
  authority: PublicKey
  payer: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([
  types.CandyMachineDataV3.layout("data"),
  borsh.publicKey("seed"),
  borsh.option(borsh.i64(), "thawDate"),
])

export function initCmV5(args: InitCmV5Args, accounts: InitCmV5Accounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.candyMachine, isSigner: false, isWritable: true },
    { pubkey: accounts.wallet, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([179, 164, 16, 182, 42, 27, 249, 75])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      data: types.CandyMachineDataV3.toEncodable(args.data),
      seed: args.seed,
      thawDate: args.thawDate,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
