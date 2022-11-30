import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "." // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface WhitelistV2Fields {
  merkleRoot: Array<number>
  mintsPerUser: number | null
  goLiveDate: BN
  price: BN | null
}

export interface WhitelistV2JSON {
  merkleRoot: Array<number>
  mintsPerUser: number | null
  goLiveDate: string
  price: string | null
}

export class WhitelistV2 {
  readonly merkleRoot: Array<number>
  readonly mintsPerUser: number | null
  readonly goLiveDate: BN
  readonly price: BN | null

  constructor(fields: WhitelistV2Fields) {
    this.merkleRoot = fields.merkleRoot
    this.mintsPerUser = fields.mintsPerUser
    this.goLiveDate = fields.goLiveDate
    this.price = fields.price
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(borsh.u8(), 32, "merkleRoot"),
        borsh.option(borsh.u32(), "mintsPerUser"),
        borsh.i64("goLiveDate"),
        borsh.option(borsh.u64(), "price"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new WhitelistV2({
      merkleRoot: obj.merkleRoot,
      mintsPerUser: obj.mintsPerUser,
      goLiveDate: obj.goLiveDate,
      price: obj.price,
    })
  }

  static toEncodable(fields: WhitelistV2Fields) {
    return {
      merkleRoot: fields.merkleRoot,
      mintsPerUser: fields.mintsPerUser,
      goLiveDate: fields.goLiveDate,
      price: fields.price,
    }
  }

  toJSON(): WhitelistV2JSON {
    return {
      merkleRoot: this.merkleRoot,
      mintsPerUser: this.mintsPerUser,
      goLiveDate: this.goLiveDate.toString(),
      price: (this.price && this.price.toString()) || null,
    }
  }

  static fromJSON(obj: WhitelistV2JSON): WhitelistV2 {
    return new WhitelistV2({
      merkleRoot: obj.merkleRoot,
      mintsPerUser: obj.mintsPerUser,
      goLiveDate: new BN(obj.goLiveDate),
      price: (obj.price && new BN(obj.price)) || null,
    })
  }

  toEncodable() {
    return WhitelistV2.toEncodable(this)
  }
}
