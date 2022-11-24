import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CandyMachineV4Fields {
  seed: PublicKey
  bump: number
  authority: PublicKey
  wallet: PublicKey
  itemsRedeemed: BN
  data: types.CandyMachineDataV2Fields
  thawDate: BN | null
  allowThaw: boolean
  revealedUri: string | null
}

export interface CandyMachineV4JSON {
  seed: string
  bump: number
  authority: string
  wallet: string
  itemsRedeemed: string
  data: types.CandyMachineDataV2JSON
  thawDate: string | null
  allowThaw: boolean
  revealedUri: string | null
}

export class CandyMachineV4 {
  readonly seed: PublicKey
  readonly bump: number
  readonly authority: PublicKey
  readonly wallet: PublicKey
  readonly itemsRedeemed: BN
  readonly data: types.CandyMachineDataV2
  readonly thawDate: BN | null
  readonly allowThaw: boolean
  readonly revealedUri: string | null

  static readonly discriminator = Buffer.from([
    247, 230, 179, 162, 114, 0, 193, 179,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("seed"),
    borsh.u8("bump"),
    borsh.publicKey("authority"),
    borsh.publicKey("wallet"),
    borsh.u64("itemsRedeemed"),
    types.CandyMachineDataV2.layout("data"),
    borsh.option(borsh.i64(), "thawDate"),
    borsh.bool("allowThaw"),
    borsh.option(borsh.str(), "revealedUri"),
  ])

  constructor(fields: CandyMachineV4Fields) {
    this.seed = fields.seed
    this.bump = fields.bump
    this.authority = fields.authority
    this.wallet = fields.wallet
    this.itemsRedeemed = fields.itemsRedeemed
    this.data = new types.CandyMachineDataV2({ ...fields.data })
    this.thawDate = fields.thawDate
    this.allowThaw = fields.allowThaw
    this.revealedUri = fields.revealedUri
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<CandyMachineV4 | null> {
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
  ): Promise<Array<CandyMachineV4 | null>> {
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

  static decode(data: Buffer): CandyMachineV4 {
    if (!data.slice(0, 8).equals(CandyMachineV4.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = CandyMachineV4.layout.decode(data.slice(8))

    return new CandyMachineV4({
      seed: dec.seed,
      bump: dec.bump,
      authority: dec.authority,
      wallet: dec.wallet,
      itemsRedeemed: dec.itemsRedeemed,
      data: types.CandyMachineDataV2.fromDecoded(dec.data),
      thawDate: dec.thawDate,
      allowThaw: dec.allowThaw,
      revealedUri: dec.revealedUri,
    })
  }

  toJSON(): CandyMachineV4JSON {
    return {
      seed: this.seed.toString(),
      bump: this.bump,
      authority: this.authority.toString(),
      wallet: this.wallet.toString(),
      itemsRedeemed: this.itemsRedeemed.toString(),
      data: this.data.toJSON(),
      thawDate: (this.thawDate && this.thawDate.toString()) || null,
      allowThaw: this.allowThaw,
      revealedUri: this.revealedUri,
    }
  }

  static fromJSON(obj: CandyMachineV4JSON): CandyMachineV4 {
    return new CandyMachineV4({
      seed: new PublicKey(obj.seed),
      bump: obj.bump,
      authority: new PublicKey(obj.authority),
      wallet: new PublicKey(obj.wallet),
      itemsRedeemed: new BN(obj.itemsRedeemed),
      data: types.CandyMachineDataV2.fromJSON(obj.data),
      thawDate: (obj.thawDate && new BN(obj.thawDate)) || null,
      allowThaw: obj.allowThaw,
      revealedUri: obj.revealedUri,
    })
  }
}
