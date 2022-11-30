import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "." // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface CreatorFields {
  address: PublicKey
  verified: boolean
  share: number
}

export interface CreatorJSON {
  address: string
  verified: boolean
  share: number
}

export class Creator {
  readonly address: PublicKey
  readonly verified: boolean
  readonly share: number

  constructor(fields: CreatorFields) {
    this.address = fields.address
    this.verified = fields.verified
    this.share = fields.share
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.publicKey("address"), borsh.bool("verified"), borsh.u8("share")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Creator({
      address: obj.address,
      verified: obj.verified,
      share: obj.share,
    })
  }

  static toEncodable(fields: CreatorFields) {
    return {
      address: fields.address,
      verified: fields.verified,
      share: fields.share,
    }
  }

  toJSON(): CreatorJSON {
    return {
      address: this.address.toString(),
      verified: this.verified,
      share: this.share,
    }
  }

  static fromJSON(obj: CreatorJSON): Creator {
    return new Creator({
      address: new PublicKey(obj.address),
      verified: obj.verified,
      share: obj.share,
    })
  }

  toEncodable() {
    return Creator.toEncodable(this)
  }
}
