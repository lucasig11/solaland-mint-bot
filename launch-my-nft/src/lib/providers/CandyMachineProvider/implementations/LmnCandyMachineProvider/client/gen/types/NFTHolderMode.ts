import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "." // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface NFTHolderModeFields {
  verifiedCreator: PublicKey
  mintsPerNft: number
}

export interface NFTHolderModeJSON {
  verifiedCreator: string
  mintsPerNft: number
}

export class NFTHolderMode {
  readonly verifiedCreator: PublicKey
  readonly mintsPerNft: number

  constructor(fields: NFTHolderModeFields) {
    this.verifiedCreator = fields.verifiedCreator
    this.mintsPerNft = fields.mintsPerNft
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.publicKey("verifiedCreator"), borsh.u32("mintsPerNft")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new NFTHolderMode({
      verifiedCreator: obj.verifiedCreator,
      mintsPerNft: obj.mintsPerNft,
    })
  }

  static toEncodable(fields: NFTHolderModeFields) {
    return {
      verifiedCreator: fields.verifiedCreator,
      mintsPerNft: fields.mintsPerNft,
    }
  }

  toJSON(): NFTHolderModeJSON {
    return {
      verifiedCreator: this.verifiedCreator.toString(),
      mintsPerNft: this.mintsPerNft,
    }
  }

  static fromJSON(obj: NFTHolderModeJSON): NFTHolderMode {
    return new NFTHolderMode({
      verifiedCreator: new PublicKey(obj.verifiedCreator),
      mintsPerNft: obj.mintsPerNft,
    })
  }

  toEncodable() {
    return NFTHolderMode.toEncodable(this)
  }
}
