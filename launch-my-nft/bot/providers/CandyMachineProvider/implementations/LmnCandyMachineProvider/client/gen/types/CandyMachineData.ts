import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface CandyMachineDataFields {
  uuid: string
  price: BN
  itemsAvailable: BN
  goLiveDate: BN | null
}

export interface CandyMachineDataJSON {
  uuid: string
  price: string
  itemsAvailable: string
  goLiveDate: string | null
}

export class CandyMachineData {
  readonly uuid: string
  readonly price: BN
  readonly itemsAvailable: BN
  readonly goLiveDate: BN | null

  constructor(fields: CandyMachineDataFields) {
    this.uuid = fields.uuid
    this.price = fields.price
    this.itemsAvailable = fields.itemsAvailable
    this.goLiveDate = fields.goLiveDate
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.str("uuid"),
        borsh.u64("price"),
        borsh.u64("itemsAvailable"),
        borsh.option(borsh.i64(), "goLiveDate"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CandyMachineData({
      uuid: obj.uuid,
      price: obj.price,
      itemsAvailable: obj.itemsAvailable,
      goLiveDate: obj.goLiveDate,
    })
  }

  static toEncodable(fields: CandyMachineDataFields) {
    return {
      uuid: fields.uuid,
      price: fields.price,
      itemsAvailable: fields.itemsAvailable,
      goLiveDate: fields.goLiveDate,
    }
  }

  toJSON(): CandyMachineDataJSON {
    return {
      uuid: this.uuid,
      price: this.price.toString(),
      itemsAvailable: this.itemsAvailable.toString(),
      goLiveDate: (this.goLiveDate && this.goLiveDate.toString()) || null,
    }
  }

  static fromJSON(obj: CandyMachineDataJSON): CandyMachineData {
    return new CandyMachineData({
      uuid: obj.uuid,
      price: new BN(obj.price),
      itemsAvailable: new BN(obj.itemsAvailable),
      goLiveDate: (obj.goLiveDate && new BN(obj.goLiveDate)) || null,
    })
  }

  toEncodable() {
    return CandyMachineData.toEncodable(this)
  }
}
