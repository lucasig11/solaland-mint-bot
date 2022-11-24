import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CandyMachineV2Fields {
  authority: PublicKey
  wallet: PublicKey
  itemsRedeemed: BN
  data: types.CandyMachineDataV2Fields
}

export interface CandyMachineV2JSON {
  authority: string
  wallet: string
  itemsRedeemed: string
  data: types.CandyMachineDataV2JSON
}

export class CandyMachineV2 {
  readonly authority: PublicKey
  readonly wallet: PublicKey
  readonly itemsRedeemed: BN
  readonly data: types.CandyMachineDataV2

  static readonly discriminator = Buffer.from([
    50, 243, 71, 181, 164, 239, 110, 131,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("authority"),
    borsh.publicKey("wallet"),
    borsh.u64("itemsRedeemed"),
    types.CandyMachineDataV2.layout("data"),
  ])

  constructor(fields: CandyMachineV2Fields) {
    this.authority = fields.authority
    this.wallet = fields.wallet
    this.itemsRedeemed = fields.itemsRedeemed
    this.data = new types.CandyMachineDataV2({ ...fields.data })
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<CandyMachineV2 | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<CandyMachineV2 | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): CandyMachineV2 {
    if (!data.slice(0, 8).equals(CandyMachineV2.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = CandyMachineV2.layout.decode(data.slice(8))

    return new CandyMachineV2({
      authority: dec.authority,
      wallet: dec.wallet,
      itemsRedeemed: dec.itemsRedeemed,
      data: types.CandyMachineDataV2.fromDecoded(dec.data),
    })
  }

  toJSON(): CandyMachineV2JSON {
    return {
      authority: this.authority.toString(),
      wallet: this.wallet.toString(),
      itemsRedeemed: this.itemsRedeemed.toString(),
      data: this.data.toJSON(),
    }
  }

  static fromJSON(obj: CandyMachineV2JSON): CandyMachineV2 {
    return new CandyMachineV2({
      authority: new PublicKey(obj.authority),
      wallet: new PublicKey(obj.wallet),
      itemsRedeemed: new BN(obj.itemsRedeemed),
      data: types.CandyMachineDataV2.fromJSON(obj.data),
    })
  }
}
