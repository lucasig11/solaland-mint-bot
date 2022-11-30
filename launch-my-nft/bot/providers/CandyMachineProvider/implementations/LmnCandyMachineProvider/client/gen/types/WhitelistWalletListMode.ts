import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface WhitelistWalletListModeFields {
  mintsPerUser: number
  merkleRoot: Array<number>
}

export interface WhitelistWalletListModeJSON {
  mintsPerUser: number
  merkleRoot: Array<number>
}

export class WhitelistWalletListMode {
  readonly mintsPerUser: number
  readonly merkleRoot: Array<number>

  constructor(fields: WhitelistWalletListModeFields) {
    this.mintsPerUser = fields.mintsPerUser
    this.merkleRoot = fields.merkleRoot
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u32("mintsPerUser"), borsh.array(borsh.u8(), 32, "merkleRoot")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new WhitelistWalletListMode({
      mintsPerUser: obj.mintsPerUser,
      merkleRoot: obj.merkleRoot,
    })
  }

  static toEncodable(fields: WhitelistWalletListModeFields) {
    return {
      mintsPerUser: fields.mintsPerUser,
      merkleRoot: fields.merkleRoot,
    }
  }

  toJSON(): WhitelistWalletListModeJSON {
    return {
      mintsPerUser: this.mintsPerUser,
      merkleRoot: this.merkleRoot,
    }
  }

  static fromJSON(obj: WhitelistWalletListModeJSON): WhitelistWalletListMode {
    return new WhitelistWalletListMode({
      mintsPerUser: obj.mintsPerUser,
      merkleRoot: obj.merkleRoot,
    })
  }

  toEncodable() {
    return WhitelistWalletListMode.toEncodable(this)
  }
}
