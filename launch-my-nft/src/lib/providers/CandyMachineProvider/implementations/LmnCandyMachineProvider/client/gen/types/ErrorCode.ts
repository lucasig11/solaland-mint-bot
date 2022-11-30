import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "." // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface IncorrectOwnerJSON {
  kind: "IncorrectOwner"
}

export class IncorrectOwner {
  static readonly discriminator = 0
  static readonly kind = "IncorrectOwner"
  readonly discriminator = 0
  readonly kind = "IncorrectOwner"

  toJSON(): IncorrectOwnerJSON {
    return {
      kind: "IncorrectOwner",
    }
  }

  toEncodable() {
    return {
      IncorrectOwner: {},
    }
  }
}

export interface UninitializedJSON {
  kind: "Uninitialized"
}

export class Uninitialized {
  static readonly discriminator = 1
  static readonly kind = "Uninitialized"
  readonly discriminator = 1
  readonly kind = "Uninitialized"

  toJSON(): UninitializedJSON {
    return {
      kind: "Uninitialized",
    }
  }

  toEncodable() {
    return {
      Uninitialized: {},
    }
  }
}

export interface MintMismatchJSON {
  kind: "MintMismatch"
}

export class MintMismatch {
  static readonly discriminator = 2
  static readonly kind = "MintMismatch"
  readonly discriminator = 2
  readonly kind = "MintMismatch"

  toJSON(): MintMismatchJSON {
    return {
      kind: "MintMismatch",
    }
  }

  toEncodable() {
    return {
      MintMismatch: {},
    }
  }
}

export interface IndexGreaterThanLengthJSON {
  kind: "IndexGreaterThanLength"
}

export class IndexGreaterThanLength {
  static readonly discriminator = 3
  static readonly kind = "IndexGreaterThanLength"
  readonly discriminator = 3
  readonly kind = "IndexGreaterThanLength"

  toJSON(): IndexGreaterThanLengthJSON {
    return {
      kind: "IndexGreaterThanLength",
    }
  }

  toEncodable() {
    return {
      IndexGreaterThanLength: {},
    }
  }
}

export interface ConfigMustHaveAtleastOneEntryJSON {
  kind: "ConfigMustHaveAtleastOneEntry"
}

export class ConfigMustHaveAtleastOneEntry {
  static readonly discriminator = 4
  static readonly kind = "ConfigMustHaveAtleastOneEntry"
  readonly discriminator = 4
  readonly kind = "ConfigMustHaveAtleastOneEntry"

  toJSON(): ConfigMustHaveAtleastOneEntryJSON {
    return {
      kind: "ConfigMustHaveAtleastOneEntry",
    }
  }

  toEncodable() {
    return {
      ConfigMustHaveAtleastOneEntry: {},
    }
  }
}

export interface NumericalOverflowErrorJSON {
  kind: "NumericalOverflowError"
}

export class NumericalOverflowError {
  static readonly discriminator = 5
  static readonly kind = "NumericalOverflowError"
  readonly discriminator = 5
  readonly kind = "NumericalOverflowError"

  toJSON(): NumericalOverflowErrorJSON {
    return {
      kind: "NumericalOverflowError",
    }
  }

  toEncodable() {
    return {
      NumericalOverflowError: {},
    }
  }
}

export interface TooManyCreatorsJSON {
  kind: "TooManyCreators"
}

export class TooManyCreators {
  static readonly discriminator = 6
  static readonly kind = "TooManyCreators"
  readonly discriminator = 6
  readonly kind = "TooManyCreators"

  toJSON(): TooManyCreatorsJSON {
    return {
      kind: "TooManyCreators",
    }
  }

  toEncodable() {
    return {
      TooManyCreators: {},
    }
  }
}

export interface UuidMustBeExactly6LengthJSON {
  kind: "UuidMustBeExactly6Length"
}

export class UuidMustBeExactly6Length {
  static readonly discriminator = 7
  static readonly kind = "UuidMustBeExactly6Length"
  readonly discriminator = 7
  readonly kind = "UuidMustBeExactly6Length"

  toJSON(): UuidMustBeExactly6LengthJSON {
    return {
      kind: "UuidMustBeExactly6Length",
    }
  }

  toEncodable() {
    return {
      UuidMustBeExactly6Length: {},
    }
  }
}

export interface NotEnoughTokensJSON {
  kind: "NotEnoughTokens"
}

export class NotEnoughTokens {
  static readonly discriminator = 8
  static readonly kind = "NotEnoughTokens"
  readonly discriminator = 8
  readonly kind = "NotEnoughTokens"

  toJSON(): NotEnoughTokensJSON {
    return {
      kind: "NotEnoughTokens",
    }
  }

  toEncodable() {
    return {
      NotEnoughTokens: {},
    }
  }
}

export interface NotEnoughSOLJSON {
  kind: "NotEnoughSOL"
}

export class NotEnoughSOL {
  static readonly discriminator = 9
  static readonly kind = "NotEnoughSOL"
  readonly discriminator = 9
  readonly kind = "NotEnoughSOL"

  toJSON(): NotEnoughSOLJSON {
    return {
      kind: "NotEnoughSOL",
    }
  }

  toEncodable() {
    return {
      NotEnoughSOL: {},
    }
  }
}

export interface TokenTransferFailedJSON {
  kind: "TokenTransferFailed"
}

export class TokenTransferFailed {
  static readonly discriminator = 10
  static readonly kind = "TokenTransferFailed"
  readonly discriminator = 10
  readonly kind = "TokenTransferFailed"

  toJSON(): TokenTransferFailedJSON {
    return {
      kind: "TokenTransferFailed",
    }
  }

  toEncodable() {
    return {
      TokenTransferFailed: {},
    }
  }
}

export interface CandyMachineEmptyJSON {
  kind: "CandyMachineEmpty"
}

export class CandyMachineEmpty {
  static readonly discriminator = 11
  static readonly kind = "CandyMachineEmpty"
  readonly discriminator = 11
  readonly kind = "CandyMachineEmpty"

  toJSON(): CandyMachineEmptyJSON {
    return {
      kind: "CandyMachineEmpty",
    }
  }

  toEncodable() {
    return {
      CandyMachineEmpty: {},
    }
  }
}

export interface CandyMachineNotLiveYetJSON {
  kind: "CandyMachineNotLiveYet"
}

export class CandyMachineNotLiveYet {
  static readonly discriminator = 12
  static readonly kind = "CandyMachineNotLiveYet"
  readonly discriminator = 12
  readonly kind = "CandyMachineNotLiveYet"

  toJSON(): CandyMachineNotLiveYetJSON {
    return {
      kind: "CandyMachineNotLiveYet",
    }
  }

  toEncodable() {
    return {
      CandyMachineNotLiveYet: {},
    }
  }
}

export interface ConfigLineMismatchJSON {
  kind: "ConfigLineMismatch"
}

export class ConfigLineMismatch {
  static readonly discriminator = 13
  static readonly kind = "ConfigLineMismatch"
  readonly discriminator = 13
  readonly kind = "ConfigLineMismatch"

  toJSON(): ConfigLineMismatchJSON {
    return {
      kind: "ConfigLineMismatch",
    }
  }

  toEncodable() {
    return {
      ConfigLineMismatch: {},
    }
  }
}

export interface WhitelistExistsJSON {
  kind: "WhitelistExists"
}

export class WhitelistExists {
  static readonly discriminator = 14
  static readonly kind = "WhitelistExists"
  readonly discriminator = 14
  readonly kind = "WhitelistExists"

  toJSON(): WhitelistExistsJSON {
    return {
      kind: "WhitelistExists",
    }
  }

  toEncodable() {
    return {
      WhitelistExists: {},
    }
  }
}

export interface WhiteListMissingJSON {
  kind: "WhiteListMissing"
}

export class WhiteListMissing {
  static readonly discriminator = 15
  static readonly kind = "WhiteListMissing"
  readonly discriminator = 15
  readonly kind = "WhiteListMissing"

  toJSON(): WhiteListMissingJSON {
    return {
      kind: "WhiteListMissing",
    }
  }

  toEncodable() {
    return {
      WhiteListMissing: {},
    }
  }
}

export interface WrongWhitelistJSON {
  kind: "WrongWhitelist"
}

export class WrongWhitelist {
  static readonly discriminator = 16
  static readonly kind = "WrongWhitelist"
  readonly discriminator = 16
  readonly kind = "WrongWhitelist"

  toJSON(): WrongWhitelistJSON {
    return {
      kind: "WrongWhitelist",
    }
  }

  toEncodable() {
    return {
      WrongWhitelist: {},
    }
  }
}

export interface NotWhitelistedJSON {
  kind: "NotWhitelisted"
}

export class NotWhitelisted {
  static readonly discriminator = 17
  static readonly kind = "NotWhitelisted"
  readonly discriminator = 17
  readonly kind = "NotWhitelisted"

  toJSON(): NotWhitelistedJSON {
    return {
      kind: "NotWhitelisted",
    }
  }

  toEncodable() {
    return {
      NotWhitelisted: {},
    }
  }
}

export interface InvalidFractionJSON {
  kind: "InvalidFraction"
}

export class InvalidFraction {
  static readonly discriminator = 18
  static readonly kind = "InvalidFraction"
  readonly discriminator = 18
  readonly kind = "InvalidFraction"

  toJSON(): InvalidFractionJSON {
    return {
      kind: "InvalidFraction",
    }
  }

  toEncodable() {
    return {
      InvalidFraction: {},
    }
  }
}

export interface BumpMissingJSON {
  kind: "BumpMissing"
}

export class BumpMissing {
  static readonly discriminator = 19
  static readonly kind = "BumpMissing"
  readonly discriminator = 19
  readonly kind = "BumpMissing"

  toJSON(): BumpMissingJSON {
    return {
      kind: "BumpMissing",
    }
  }

  toEncodable() {
    return {
      BumpMissing: {},
    }
  }
}

export interface PriceViolationJSON {
  kind: "PriceViolation"
}

export class PriceViolation {
  static readonly discriminator = 20
  static readonly kind = "PriceViolation"
  readonly discriminator = 20
  readonly kind = "PriceViolation"

  toJSON(): PriceViolationJSON {
    return {
      kind: "PriceViolation",
    }
  }

  toEncodable() {
    return {
      PriceViolation: {},
    }
  }
}

export interface NotThawableJSON {
  kind: "NotThawable"
}

export class NotThawable {
  static readonly discriminator = 21
  static readonly kind = "NotThawable"
  readonly discriminator = 21
  readonly kind = "NotThawable"

  toJSON(): NotThawableJSON {
    return {
      kind: "NotThawable",
    }
  }

  toEncodable() {
    return {
      NotThawable: {},
    }
  }
}

export interface TeePotJSON {
  kind: "TeePot"
}

export class TeePot {
  static readonly discriminator = 22
  static readonly kind = "TeePot"
  readonly discriminator = 22
  readonly kind = "TeePot"

  toJSON(): TeePotJSON {
    return {
      kind: "TeePot",
    }
  }

  toEncodable() {
    return {
      TeePot: {},
    }
  }
}

export interface PresentProofJSON {
  kind: "PresentProof"
}

export class PresentProof {
  static readonly discriminator = 23
  static readonly kind = "PresentProof"
  readonly discriminator = 23
  readonly kind = "PresentProof"

  toJSON(): PresentProofJSON {
    return {
      kind: "PresentProof",
    }
  }

  toEncodable() {
    return {
      PresentProof: {},
    }
  }
}

export interface InvalidDiscriminatorJSON {
  kind: "InvalidDiscriminator"
}

export class InvalidDiscriminator {
  static readonly discriminator = 24
  static readonly kind = "InvalidDiscriminator"
  readonly discriminator = 24
  readonly kind = "InvalidDiscriminator"

  toJSON(): InvalidDiscriminatorJSON {
    return {
      kind: "InvalidDiscriminator",
    }
  }

  toEncodable() {
    return {
      InvalidDiscriminator: {},
    }
  }
}

export interface InvalidCollectionJSON {
  kind: "InvalidCollection"
}

export class InvalidCollection {
  static readonly discriminator = 25
  static readonly kind = "InvalidCollection"
  readonly discriminator = 25
  readonly kind = "InvalidCollection"

  toJSON(): InvalidCollectionJSON {
    return {
      kind: "InvalidCollection",
    }
  }

  toEncodable() {
    return {
      InvalidCollection: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ErrorCodeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("IncorrectOwner" in obj) {
    return new IncorrectOwner()
  }
  if ("Uninitialized" in obj) {
    return new Uninitialized()
  }
  if ("MintMismatch" in obj) {
    return new MintMismatch()
  }
  if ("IndexGreaterThanLength" in obj) {
    return new IndexGreaterThanLength()
  }
  if ("ConfigMustHaveAtleastOneEntry" in obj) {
    return new ConfigMustHaveAtleastOneEntry()
  }
  if ("NumericalOverflowError" in obj) {
    return new NumericalOverflowError()
  }
  if ("TooManyCreators" in obj) {
    return new TooManyCreators()
  }
  if ("UuidMustBeExactly6Length" in obj) {
    return new UuidMustBeExactly6Length()
  }
  if ("NotEnoughTokens" in obj) {
    return new NotEnoughTokens()
  }
  if ("NotEnoughSOL" in obj) {
    return new NotEnoughSOL()
  }
  if ("TokenTransferFailed" in obj) {
    return new TokenTransferFailed()
  }
  if ("CandyMachineEmpty" in obj) {
    return new CandyMachineEmpty()
  }
  if ("CandyMachineNotLiveYet" in obj) {
    return new CandyMachineNotLiveYet()
  }
  if ("ConfigLineMismatch" in obj) {
    return new ConfigLineMismatch()
  }
  if ("WhitelistExists" in obj) {
    return new WhitelistExists()
  }
  if ("WhiteListMissing" in obj) {
    return new WhiteListMissing()
  }
  if ("WrongWhitelist" in obj) {
    return new WrongWhitelist()
  }
  if ("NotWhitelisted" in obj) {
    return new NotWhitelisted()
  }
  if ("InvalidFraction" in obj) {
    return new InvalidFraction()
  }
  if ("BumpMissing" in obj) {
    return new BumpMissing()
  }
  if ("PriceViolation" in obj) {
    return new PriceViolation()
  }
  if ("NotThawable" in obj) {
    return new NotThawable()
  }
  if ("TeePot" in obj) {
    return new TeePot()
  }
  if ("PresentProof" in obj) {
    return new PresentProof()
  }
  if ("InvalidDiscriminator" in obj) {
    return new InvalidDiscriminator()
  }
  if ("InvalidCollection" in obj) {
    return new InvalidCollection()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.ErrorCodeJSON): types.ErrorCodeKind {
  switch (obj.kind) {
    case "IncorrectOwner": {
      return new IncorrectOwner()
    }
    case "Uninitialized": {
      return new Uninitialized()
    }
    case "MintMismatch": {
      return new MintMismatch()
    }
    case "IndexGreaterThanLength": {
      return new IndexGreaterThanLength()
    }
    case "ConfigMustHaveAtleastOneEntry": {
      return new ConfigMustHaveAtleastOneEntry()
    }
    case "NumericalOverflowError": {
      return new NumericalOverflowError()
    }
    case "TooManyCreators": {
      return new TooManyCreators()
    }
    case "UuidMustBeExactly6Length": {
      return new UuidMustBeExactly6Length()
    }
    case "NotEnoughTokens": {
      return new NotEnoughTokens()
    }
    case "NotEnoughSOL": {
      return new NotEnoughSOL()
    }
    case "TokenTransferFailed": {
      return new TokenTransferFailed()
    }
    case "CandyMachineEmpty": {
      return new CandyMachineEmpty()
    }
    case "CandyMachineNotLiveYet": {
      return new CandyMachineNotLiveYet()
    }
    case "ConfigLineMismatch": {
      return new ConfigLineMismatch()
    }
    case "WhitelistExists": {
      return new WhitelistExists()
    }
    case "WhiteListMissing": {
      return new WhiteListMissing()
    }
    case "WrongWhitelist": {
      return new WrongWhitelist()
    }
    case "NotWhitelisted": {
      return new NotWhitelisted()
    }
    case "InvalidFraction": {
      return new InvalidFraction()
    }
    case "BumpMissing": {
      return new BumpMissing()
    }
    case "PriceViolation": {
      return new PriceViolation()
    }
    case "NotThawable": {
      return new NotThawable()
    }
    case "TeePot": {
      return new TeePot()
    }
    case "PresentProof": {
      return new PresentProof()
    }
    case "InvalidDiscriminator": {
      return new InvalidDiscriminator()
    }
    case "InvalidCollection": {
      return new InvalidCollection()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "IncorrectOwner"),
    borsh.struct([], "Uninitialized"),
    borsh.struct([], "MintMismatch"),
    borsh.struct([], "IndexGreaterThanLength"),
    borsh.struct([], "ConfigMustHaveAtleastOneEntry"),
    borsh.struct([], "NumericalOverflowError"),
    borsh.struct([], "TooManyCreators"),
    borsh.struct([], "UuidMustBeExactly6Length"),
    borsh.struct([], "NotEnoughTokens"),
    borsh.struct([], "NotEnoughSOL"),
    borsh.struct([], "TokenTransferFailed"),
    borsh.struct([], "CandyMachineEmpty"),
    borsh.struct([], "CandyMachineNotLiveYet"),
    borsh.struct([], "ConfigLineMismatch"),
    borsh.struct([], "WhitelistExists"),
    borsh.struct([], "WhiteListMissing"),
    borsh.struct([], "WrongWhitelist"),
    borsh.struct([], "NotWhitelisted"),
    borsh.struct([], "InvalidFraction"),
    borsh.struct([], "BumpMissing"),
    borsh.struct([], "PriceViolation"),
    borsh.struct([], "NotThawable"),
    borsh.struct([], "TeePot"),
    borsh.struct([], "PresentProof"),
    borsh.struct([], "InvalidDiscriminator"),
    borsh.struct([], "InvalidCollection"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
