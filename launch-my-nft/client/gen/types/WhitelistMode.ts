import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export type WalletBasedFields = {
  info: types.WhitelistWalletListModeFields
}
export type WalletBasedValue = {
  info: types.WhitelistWalletListMode
}

export interface WalletBasedJSON {
  kind: "WalletBased"
  value: {
    info: types.WhitelistWalletListModeJSON
  }
}

export class WalletBased {
  static readonly discriminator = 0
  static readonly kind = "WalletBased"
  readonly discriminator = 0
  readonly kind = "WalletBased"
  readonly value: WalletBasedValue

  constructor(value: WalletBasedFields) {
    this.value = {
      info: new types.WhitelistWalletListMode({ ...value.info }),
    }
  }

  toJSON(): WalletBasedJSON {
    return {
      kind: "WalletBased",
      value: {
        info: this.value.info.toJSON(),
      },
    }
  }

  toEncodable() {
    return {
      WalletBased: {
        info: types.WhitelistWalletListMode.toEncodable(this.value.info),
      },
    }
  }
}

export type TokenBasedFields = {
  info: types.WhitelistTokenModeFields
}
export type TokenBasedValue = {
  info: types.WhitelistTokenMode
}

export interface TokenBasedJSON {
  kind: "TokenBased"
  value: {
    info: types.WhitelistTokenModeJSON
  }
}

export class TokenBased {
  static readonly discriminator = 1
  static readonly kind = "TokenBased"
  readonly discriminator = 1
  readonly kind = "TokenBased"
  readonly value: TokenBasedValue

  constructor(value: TokenBasedFields) {
    this.value = {
      info: new types.WhitelistTokenMode({ ...value.info }),
    }
  }

  toJSON(): TokenBasedJSON {
    return {
      kind: "TokenBased",
      value: {
        info: this.value.info.toJSON(),
      },
    }
  }

  toEncodable() {
    return {
      TokenBased: {
        info: types.WhitelistTokenMode.toEncodable(this.value.info),
      },
    }
  }
}

export type PublicFields = {
  info: types.PublicModeFields
}
export type PublicValue = {
  info: types.PublicMode
}

export interface PublicJSON {
  kind: "Public"
  value: {
    info: types.PublicModeJSON
  }
}

export class Public {
  static readonly discriminator = 2
  static readonly kind = "Public"
  readonly discriminator = 2
  readonly kind = "Public"
  readonly value: PublicValue

  constructor(value: PublicFields) {
    this.value = {
      info: new types.PublicMode({ ...value.info }),
    }
  }

  toJSON(): PublicJSON {
    return {
      kind: "Public",
      value: {
        info: this.value.info.toJSON(),
      },
    }
  }

  toEncodable() {
    return {
      Public: {
        info: types.PublicMode.toEncodable(this.value.info),
      },
    }
  }
}

export type NFTBasedFields = {
  info: types.NFTHolderModeFields
}
export type NFTBasedValue = {
  info: types.NFTHolderMode
}

export interface NFTBasedJSON {
  kind: "NFTBased"
  value: {
    info: types.NFTHolderModeJSON
  }
}

export class NFTBased {
  static readonly discriminator = 3
  static readonly kind = "NFTBased"
  readonly discriminator = 3
  readonly kind = "NFTBased"
  readonly value: NFTBasedValue

  constructor(value: NFTBasedFields) {
    this.value = {
      info: new types.NFTHolderMode({ ...value.info }),
    }
  }

  toJSON(): NFTBasedJSON {
    return {
      kind: "NFTBased",
      value: {
        info: this.value.info.toJSON(),
      },
    }
  }

  toEncodable() {
    return {
      NFTBased: {
        info: types.NFTHolderMode.toEncodable(this.value.info),
      },
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.WhitelistModeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("WalletBased" in obj) {
    const val = obj["WalletBased"]
    return new WalletBased({
      info: types.WhitelistWalletListMode.fromDecoded(val["info"]),
    })
  }
  if ("TokenBased" in obj) {
    const val = obj["TokenBased"]
    return new TokenBased({
      info: types.WhitelistTokenMode.fromDecoded(val["info"]),
    })
  }
  if ("Public" in obj) {
    const val = obj["Public"]
    return new Public({
      info: types.PublicMode.fromDecoded(val["info"]),
    })
  }
  if ("NFTBased" in obj) {
    const val = obj["NFTBased"]
    return new NFTBased({
      info: types.NFTHolderMode.fromDecoded(val["info"]),
    })
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.WhitelistModeJSON
): types.WhitelistModeKind {
  switch (obj.kind) {
    case "WalletBased": {
      return new WalletBased({
        info: types.WhitelistWalletListMode.fromJSON(obj.value.info),
      })
    }
    case "TokenBased": {
      return new TokenBased({
        info: types.WhitelistTokenMode.fromJSON(obj.value.info),
      })
    }
    case "Public": {
      return new Public({
        info: types.PublicMode.fromJSON(obj.value.info),
      })
    }
    case "NFTBased": {
      return new NFTBased({
        info: types.NFTHolderMode.fromJSON(obj.value.info),
      })
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([types.WhitelistWalletListMode.layout("info")], "WalletBased"),
    borsh.struct([types.WhitelistTokenMode.layout("info")], "TokenBased"),
    borsh.struct([types.PublicMode.layout("info")], "Public"),
    borsh.struct([types.NFTHolderMode.layout("info")], "NFTBased"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
