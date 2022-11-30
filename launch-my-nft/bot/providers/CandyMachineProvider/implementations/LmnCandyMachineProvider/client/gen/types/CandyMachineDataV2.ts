import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface CandyMachineDataV2Fields {
  price: BN
  itemsAvailable: BN
  goLiveDate: BN
  symbol: string
  sellerFeeBasisPoints: number
  creators: Array<types.CreatorFields>
  isMutable: boolean
  retainAuthority: boolean
  baseUrl: string
  mintsPerUser: number | null
  whitelist: types.WhitelistV2Fields | null
}

export interface CandyMachineDataV2JSON {
  price: string
  itemsAvailable: string
  goLiveDate: string
  symbol: string
  sellerFeeBasisPoints: number
  creators: Array<types.CreatorJSON>
  isMutable: boolean
  retainAuthority: boolean
  baseUrl: string
  mintsPerUser: number | null
  whitelist: types.WhitelistV2JSON | null
}

export class CandyMachineDataV2 {
  readonly price: BN
  readonly itemsAvailable: BN
  readonly goLiveDate: BN
  readonly symbol: string
  readonly sellerFeeBasisPoints: number
  readonly creators: Array<types.Creator>
  readonly isMutable: boolean
  readonly retainAuthority: boolean
  readonly baseUrl: string
  readonly mintsPerUser: number | null
  readonly whitelist: types.WhitelistV2 | null

  constructor(fields: CandyMachineDataV2Fields) {
    this.price = fields.price
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
    this.mintsPerUser = fields.mintsPerUser
    this.whitelist =
      (fields.whitelist && new types.WhitelistV2({ ...fields.whitelist })) ||
      null
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("price"),
        borsh.u64("itemsAvailable"),
        borsh.i64("goLiveDate"),
        borsh.str("symbol"),
        borsh.u16("sellerFeeBasisPoints"),
        borsh.vec(types.Creator.layout(), "creators"),
        borsh.bool("isMutable"),
        borsh.bool("retainAuthority"),
        borsh.str("baseUrl"),
        borsh.option(borsh.u32(), "mintsPerUser"),
        borsh.option(types.WhitelistV2.layout(), "whitelist"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CandyMachineDataV2({
      price: obj.price,
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
      mintsPerUser: obj.mintsPerUser,
      whitelist:
        (obj.whitelist && types.WhitelistV2.fromDecoded(obj.whitelist)) || null,
    })
  }

  static toEncodable(fields: CandyMachineDataV2Fields) {
    return {
      price: fields.price,
      itemsAvailable: fields.itemsAvailable,
      goLiveDate: fields.goLiveDate,
      symbol: fields.symbol,
      sellerFeeBasisPoints: fields.sellerFeeBasisPoints,
      creators: fields.creators.map((item) => types.Creator.toEncodable(item)),
      isMutable: fields.isMutable,
      retainAuthority: fields.retainAuthority,
      baseUrl: fields.baseUrl,
      mintsPerUser: fields.mintsPerUser,
      whitelist:
        (fields.whitelist && types.WhitelistV2.toEncodable(fields.whitelist)) ||
        null,
    }
  }

  toJSON(): CandyMachineDataV2JSON {
    return {
      price: this.price.toString(),
      itemsAvailable: this.itemsAvailable.toString(),
      goLiveDate: this.goLiveDate.toString(),
      symbol: this.symbol,
      sellerFeeBasisPoints: this.sellerFeeBasisPoints,
      creators: this.creators.map((item) => item.toJSON()),
      isMutable: this.isMutable,
      retainAuthority: this.retainAuthority,
      baseUrl: this.baseUrl,
      mintsPerUser: this.mintsPerUser,
      whitelist: (this.whitelist && this.whitelist.toJSON()) || null,
    }
  }

  static fromJSON(obj: CandyMachineDataV2JSON): CandyMachineDataV2 {
    return new CandyMachineDataV2({
      price: new BN(obj.price),
      itemsAvailable: new BN(obj.itemsAvailable),
      goLiveDate: new BN(obj.goLiveDate),
      symbol: obj.symbol,
      sellerFeeBasisPoints: obj.sellerFeeBasisPoints,
      creators: obj.creators.map((item) => types.Creator.fromJSON(item)),
      isMutable: obj.isMutable,
      retainAuthority: obj.retainAuthority,
      baseUrl: obj.baseUrl,
      mintsPerUser: obj.mintsPerUser,
      whitelist:
        (obj.whitelist && types.WhitelistV2.fromJSON(obj.whitelist)) || null,
    })
  }

  toEncodable() {
    return CandyMachineDataV2.toEncodable(this)
  }
}
