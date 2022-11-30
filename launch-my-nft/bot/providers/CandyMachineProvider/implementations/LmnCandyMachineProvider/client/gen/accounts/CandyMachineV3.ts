import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CandyMachineV3Fields {
  seed: PublicKey
  bump: number
  authority: PublicKey
  wallet: PublicKey
  itemsRedeemed: BN
  data: types.CandyMachineDataV2Fields
}

export interface CandyMachineV3JSON {
  seed: string
  bump: number
  authority: string
  wallet: string
  itemsRedeemed: string
  data: types.CandyMachineDataV2JSON
}

export class CandyMachineV3 {
  readonly seed: PublicKey
  readonly bump: number
  readonly authority: PublicKey
  readonly wallet: PublicKey
  readonly itemsRedeemed: BN
  readonly data: types.CandyMachineDataV2

  static readonly discriminator = Buffer.from([
    221, 21, 200, 78, 142, 15, 223, 6,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("seed"),
    borsh.u8("bump"),
    borsh.publicKey("authority"),
    borsh.publicKey("wallet"),
    borsh.u64("itemsRedeemed"),
    types.CandyMachineDataV2.layout("data"),
  ])

  constructor(fields: CandyMachineV3Fields) {
    this.seed = fields.seed
    this.bump = fields.bump
    this.authority = fields.authority
    this.wallet = fields.wallet
    this.itemsRedeemed = fields.itemsRedeemed
    this.data = new types.CandyMachineDataV2({ ...fields.data })
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<CandyMachineV3 | null> {
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
  ): Promise<Array<CandyMachineV3 | null>> {
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

  static decode(data: Buffer): CandyMachineV3 {
    if (!data.slice(0, 8).equals(CandyMachineV3.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = CandyMachineV3.layout.decode(data.slice(8))

    return new CandyMachineV3({
      seed: dec.seed,
      bump: dec.bump,
      authority: dec.authority,
      wallet: dec.wallet,
      itemsRedeemed: dec.itemsRedeemed,
      data: types.CandyMachineDataV2.fromDecoded(dec.data),
    })
  }

  toJSON(): CandyMachineV3JSON {
    return {
      seed: this.seed.toString(),
      bump: this.bump,
      authority: this.authority.toString(),
      wallet: this.wallet.toString(),
      itemsRedeemed: this.itemsRedeemed.toString(),
      data: this.data.toJSON(),
    }
  }

  static fromJSON(obj: CandyMachineV3JSON): CandyMachineV3 {
    return new CandyMachineV3({
      seed: new PublicKey(obj.seed),
      bump: obj.bump,
      authority: new PublicKey(obj.authority),
      wallet: new PublicKey(obj.wallet),
      itemsRedeemed: new BN(obj.itemsRedeemed),
      data: types.CandyMachineDataV2.fromJSON(obj.data),
    })
  }
}
