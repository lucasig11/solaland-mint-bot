import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "." // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface SaleFazeFields {
  start: BN
  price: BN
  currency: PublicKey | null
  whitelistMode: types.WhitelistModeKind
  name: string
}

export interface SaleFazeJSON {
  start: string
  price: string
  currency: string | null
  whitelistMode: types.WhitelistModeJSON
  name: string
}

export class SaleFaze {
  readonly start: BN
  readonly price: BN
  readonly currency: PublicKey | null
  readonly whitelistMode: types.WhitelistModeKind
  readonly name: string

  constructor(fields: SaleFazeFields) {
    this.start = fields.start
    this.price = fields.price
    this.currency = fields.currency
    this.whitelistMode = fields.whitelistMode
    this.name = fields.name
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i64("start"),
        borsh.u64("price"),
        borsh.option(borsh.publicKey(), "currency"),
        types.WhitelistMode.layout("whitelistMode"),
        borsh.str("name"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new SaleFaze({
      start: obj.start,
      price: obj.price,
      currency: obj.currency,
      whitelistMode: types.WhitelistMode.fromDecoded(obj.whitelistMode),
      name: obj.name,
    })
  }

  static toEncodable(fields: SaleFazeFields) {
    return {
      start: fields.start,
      price: fields.price,
      currency: fields.currency,
      whitelistMode: fields.whitelistMode.toEncodable(),
      name: fields.name,
    }
  }

  toJSON(): SaleFazeJSON {
    return {
      start: this.start.toString(),
      price: this.price.toString(),
      currency: (this.currency && this.currency.toString()) || null,
      whitelistMode: this.whitelistMode.toJSON(),
      name: this.name,
    }
  }

  static fromJSON(obj: SaleFazeJSON): SaleFaze {
    return new SaleFaze({
      start: new BN(obj.start),
      price: new BN(obj.price),
      currency: (obj.currency && new PublicKey(obj.currency)) || null,
      whitelistMode: types.WhitelistMode.fromJSON(obj.whitelistMode),
      name: obj.name,
    })
  }

  toEncodable() {
    return SaleFaze.toEncodable(this)
  }
}
