import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CandyMachineV6Fields {
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
  name: string
  enforceRoyalties: boolean
  collectionMint: PublicKey | null
}

export interface CandyMachineV6JSON {
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
  name: string
  enforceRoyalties: boolean
  collectionMint: string | null
}

export class CandyMachineV6 {
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
  readonly name: string
  readonly enforceRoyalties: boolean
  readonly collectionMint: PublicKey | null

  static readonly discriminator = Buffer.from([
    196, 204, 36, 6, 18, 215, 199, 134,
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
    borsh.str("name"),
    borsh.bool("enforceRoyalties"),
    borsh.option(borsh.publicKey(), "collectionMint"),
  ])

  constructor(fields: CandyMachineV6Fields) {
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
    this.name = fields.name
    this.enforceRoyalties = fields.enforceRoyalties
    this.collectionMint = fields.collectionMint
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<CandyMachineV6 | null> {
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
  ): Promise<Array<CandyMachineV6 | null>> {
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

  static decode(data: Buffer): CandyMachineV6 {
    if (!data.slice(0, 8).equals(CandyMachineV6.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = CandyMachineV6.layout.decode(data.slice(8))

    return new CandyMachineV6({
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
      name: dec.name,
      enforceRoyalties: dec.enforceRoyalties,
      collectionMint: dec.collectionMint,
    })
  }

  toJSON(): CandyMachineV6JSON {
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
      name: this.name,
      enforceRoyalties: this.enforceRoyalties,
      collectionMint:
        (this.collectionMint && this.collectionMint.toString()) || null,
    }
  }

  static fromJSON(obj: CandyMachineV6JSON): CandyMachineV6 {
    return new CandyMachineV6({
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
      name: obj.name,
      enforceRoyalties: obj.enforceRoyalties,
      collectionMint:
        (obj.collectionMint && new PublicKey(obj.collectionMint)) || null,
    })
  }
}
