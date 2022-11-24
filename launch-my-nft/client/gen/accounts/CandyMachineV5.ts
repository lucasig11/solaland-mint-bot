import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CandyMachineV5Fields {
  seed: PublicKey
  bump: number
  authority: PublicKey
  wallet: PublicKey
  itemsRedeemed: BN
  thawDate: BN | null
  allowThaw: boolean
  revealedUri: string | null
  data: types.CandyMachineDataV3Fields
  requiredSigned: PublicKey | null
}

export interface CandyMachineV5JSON {
  seed: string
  bump: number
  authority: string
  wallet: string
  itemsRedeemed: string
  thawDate: string | null
  allowThaw: boolean
  revealedUri: string | null
  data: types.CandyMachineDataV3JSON
  requiredSigned: string | null
}

export class CandyMachineV5 {
  readonly seed: PublicKey
  readonly bump: number
  readonly authority: PublicKey
  readonly wallet: PublicKey
  readonly itemsRedeemed: BN
  readonly thawDate: BN | null
  readonly allowThaw: boolean
  readonly revealedUri: string | null
  readonly data: types.CandyMachineDataV3
  readonly requiredSigned: PublicKey | null

  static readonly discriminator = Buffer.from([
    193, 154, 145, 64, 82, 69, 127, 140,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("seed"),
    borsh.u8("bump"),
    borsh.publicKey("authority"),
    borsh.publicKey("wallet"),
    borsh.u64("itemsRedeemed"),
    borsh.option(borsh.i64(), "thawDate"),
    borsh.bool("allowThaw"),
    borsh.option(borsh.str(), "revealedUri"),
    types.CandyMachineDataV3.layout("data"),
    borsh.option(borsh.publicKey(), "requiredSigned"),
  ])

  constructor(fields: CandyMachineV5Fields) {
    this.seed = fields.seed
    this.bump = fields.bump
    this.authority = fields.authority
    this.wallet = fields.wallet
    this.itemsRedeemed = fields.itemsRedeemed
    this.thawDate = fields.thawDate
    this.allowThaw = fields.allowThaw
    this.revealedUri = fields.revealedUri
    this.data = new types.CandyMachineDataV3({ ...fields.data })
    this.requiredSigned = fields.requiredSigned
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<CandyMachineV5 | null> {
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
  ): Promise<Array<CandyMachineV5 | null>> {
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

  static decode(data: Buffer): CandyMachineV5 {
    if (!data.slice(0, 8).equals(CandyMachineV5.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = CandyMachineV5.layout.decode(data.slice(8))

    return new CandyMachineV5({
      seed: dec.seed,
      bump: dec.bump,
      authority: dec.authority,
      wallet: dec.wallet,
      itemsRedeemed: dec.itemsRedeemed,
      thawDate: dec.thawDate,
      allowThaw: dec.allowThaw,
      revealedUri: dec.revealedUri,
      data: types.CandyMachineDataV3.fromDecoded(dec.data),
      requiredSigned: dec.requiredSigned,
    })
  }

  toJSON(): CandyMachineV5JSON {
    return {
      seed: this.seed.toString(),
      bump: this.bump,
      authority: this.authority.toString(),
      wallet: this.wallet.toString(),
      itemsRedeemed: this.itemsRedeemed.toString(),
      thawDate: (this.thawDate && this.thawDate.toString()) || null,
      allowThaw: this.allowThaw,
      revealedUri: this.revealedUri,
      data: this.data.toJSON(),
      requiredSigned:
        (this.requiredSigned && this.requiredSigned.toString()) || null,
    }
  }

  static fromJSON(obj: CandyMachineV5JSON): CandyMachineV5 {
    return new CandyMachineV5({
      seed: new PublicKey(obj.seed),
      bump: obj.bump,
      authority: new PublicKey(obj.authority),
      wallet: new PublicKey(obj.wallet),
      itemsRedeemed: new BN(obj.itemsRedeemed),
      thawDate: (obj.thawDate && new BN(obj.thawDate)) || null,
      allowThaw: obj.allowThaw,
      revealedUri: obj.revealedUri,
      data: types.CandyMachineDataV3.fromJSON(obj.data),
      requiredSigned:
        (obj.requiredSigned && new PublicKey(obj.requiredSigned)) || null,
    })
  }
}
