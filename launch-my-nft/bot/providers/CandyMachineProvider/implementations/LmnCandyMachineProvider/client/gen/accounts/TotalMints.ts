import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface TotalMintsFields {
  total: number
}

export interface TotalMintsJSON {
  total: number
}

export class TotalMints {
  readonly total: number

  static readonly discriminator = Buffer.from([
    5, 252, 73, 108, 50, 30, 212, 224,
  ])

  static readonly layout = borsh.struct([borsh.u32("total")])

  constructor(fields: TotalMintsFields) {
    this.total = fields.total
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<TotalMints | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<TotalMints | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): TotalMints {
    if (!data.slice(0, 8).equals(TotalMints.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = TotalMints.layout.decode(data.slice(8))

    return new TotalMints({
      total: dec.total,
    })
  }

  toJSON(): TotalMintsJSON {
    return {
      total: this.total,
    }
  }

  static fromJSON(obj: TotalMintsJSON): TotalMints {
    return new TotalMints({
      total: obj.total,
    })
  }
}
