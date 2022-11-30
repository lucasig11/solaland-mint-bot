import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface CandyMachineDataV3Fields {
  itemsAvailable: BN
  goLiveDate: BN
  symbol: string
  sellerFeeBasisPoints: number
  creators: Array<types.CreatorFields>
  isMutable: boolean
  retainAuthority: boolean
  baseUrl: string
  saleFazes: Array<types.SaleFazeFields>
}

export interface CandyMachineDataV3JSON {
  itemsAvailable: string
  goLiveDate: string
  symbol: string
  sellerFeeBasisPoints: number
  creators: Array<types.CreatorJSON>
  isMutable: boolean
  retainAuthority: boolean
  baseUrl: string
  saleFazes: Array<types.SaleFazeJSON>
}

export class CandyMachineDataV3 {
  readonly itemsAvailable: BN
  readonly goLiveDate: BN
  readonly symbol: string
  readonly sellerFeeBasisPoints: number
  readonly creators: Array<types.Creator>
  readonly isMutable: boolean
  readonly retainAuthority: boolean
  readonly baseUrl: string
  readonly saleFazes: Array<types.SaleFaze>

  constructor(fields: CandyMachineDataV3Fields) {
    this.itemsAvailable = fields.itemsAvailable
    this.goLiveDate = fields.goLiveDate
    this.symbol = fields.symbol
    this.sellerFeeBasisPoints = fields.sellerFeeBasisPoints
    this.creators = fields.creators.map(
      (item) => new types.Creator({ ...item })
    )
    this.isMutable = fields.isMutable
    this.retainAuthority = fields.retainAuthority
    this.baseUrl = fields.baseUrl
    this.saleFazes = fields.saleFazes.map(
      (item) => new types.SaleFaze({ ...item })
    )
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("itemsAvailable"),
        borsh.i64("goLiveDate"),
        borsh.str("symbol"),
        borsh.u16("sellerFeeBasisPoints"),
        borsh.vec(types.Creator.layout(), "creators"),
        borsh.bool("isMutable"),
        borsh.bool("retainAuthority"),
        borsh.str("baseUrl"),
        borsh.vec(types.SaleFaze.layout(), "saleFazes"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CandyMachineDataV3({
      itemsAvailable: obj.itemsAvailable,
      goLiveDate: obj.goLiveDate,
      symbol: obj.symbol,
      sellerFeeBasisPoints: obj.sellerFeeBasisPoints,
      creators: obj.creators.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.Creator.fromDecoded(item)
      ),
      isMutable: obj.isMutable,
      retainAuthority: obj.retainAuthority,
      baseUrl: obj.baseUrl,
      saleFazes: obj.saleFazes.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.SaleFaze.fromDecoded(item)
      ),
    })
  }

  static toEncodable(fields: CandyMachineDataV3Fields) {
    return {
      itemsAvailable: fields.itemsAvailable,
      goLiveDate: fields.goLiveDate,
      symbol: fields.symbol,
      sellerFeeBasisPoints: fields.sellerFeeBasisPoints,
      creators: fields.creators.map((item) => types.Creator.toEncodable(item)),
      isMutable: fields.isMutable,
      retainAuthority: fields.retainAuthority,
      baseUrl: fields.baseUrl,
      saleFazes: fields.saleFazes.map((item) =>
        types.SaleFaze.toEncodable(item)
      ),
    }
  }

  toJSON(): CandyMachineDataV3JSON {
    return {
      itemsAvailable: this.itemsAvailable.toString(),
      goLiveDate: this.goLiveDate.toString(),
      symbol: this.symbol,
      sellerFeeBasisPoints: this.sellerFeeBasisPoints,
      creators: this.creators.map((item) => item.toJSON()),
      isMutable: this.isMutable,
      retainAuthority: this.retainAuthority,
      baseUrl: this.baseUrl,
      saleFazes: this.saleFazes.map((item) => item.toJSON()),
    }
  }

  static fromJSON(obj: CandyMachineDataV3JSON): CandyMachineDataV3 {
    return new CandyMachineDataV3({
      itemsAvailable: new BN(obj.itemsAvailable),
      goLiveDate: new BN(obj.goLiveDate),
      symbol: obj.symbol,
      sellerFeeBasisPoints: obj.sellerFeeBasisPoints,
      creators: obj.creators.map((item) => types.Creator.fromJSON(item)),
      isMutable: obj.isMutable,
      retainAuthority: obj.retainAuthority,
      baseUrl: obj.baseUrl,
      saleFazes: obj.saleFazes.map((item) => types.SaleFaze.fromJSON(item)),
    })
  }

  toEncodable() {
    return CandyMachineDataV3.toEncodable(this)
  }
}
