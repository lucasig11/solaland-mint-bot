import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "." // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface PublicModeFields {
  mintsPerUser: number | null
}

export interface PublicModeJSON {
  mintsPerUser: number | null
}

export class PublicMode {
  readonly mintsPerUser: number | null

  constructor(fields: PublicModeFields) {
    this.mintsPerUser = fields.mintsPerUser
  }

  static layout(property?: string) {
    return borsh.struct([borsh.option(borsh.u32(), "mintsPerUser")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new PublicMode({
      mintsPerUser: obj.mintsPerUser,
    })
  }

  static toEncodable(fields: PublicModeFields) {
    return {
      mintsPerUser: fields.mintsPerUser,
    }
  }

  toJSON(): PublicModeJSON {
    return {
      mintsPerUser: this.mintsPerUser,
    }
  }

  static fromJSON(obj: PublicModeJSON): PublicMode {
    return new PublicMode({
      mintsPerUser: obj.mintsPerUser,
    })
  }

  toEncodable() {
    return PublicMode.toEncodable(this)
  }
}
