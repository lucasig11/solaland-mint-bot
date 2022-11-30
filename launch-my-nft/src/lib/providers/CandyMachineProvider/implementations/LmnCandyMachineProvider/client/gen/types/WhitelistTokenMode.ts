import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "." // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface WhitelistTokenModeFields {
  tokenMint: PublicKey
  burn: boolean
}

export interface WhitelistTokenModeJSON {
  tokenMint: string
  burn: boolean
}

export class WhitelistTokenMode {
  readonly tokenMint: PublicKey
  readonly burn: boolean

  constructor(fields: WhitelistTokenModeFields) {
    this.tokenMint = fields.tokenMint
    this.burn = fields.burn
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.publicKey("tokenMint"), borsh.bool("burn")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new WhitelistTokenMode({
      tokenMint: obj.tokenMint,
      burn: obj.burn,
    })
  }

  static toEncodable(fields: WhitelistTokenModeFields) {
    return {
      tokenMint: fields.tokenMint,
      burn: fields.burn,
    }
  }

  toJSON(): WhitelistTokenModeJSON {
    return {
      tokenMint: this.tokenMint.toString(),
      burn: this.burn,
    }
  }

  static fromJSON(obj: WhitelistTokenModeJSON): WhitelistTokenMode {
    return new WhitelistTokenMode({
      tokenMint: new PublicKey(obj.tokenMint),
      burn: obj.burn,
    })
  }

  toEncodable() {
    return WhitelistTokenMode.toEncodable(this)
  }
}
