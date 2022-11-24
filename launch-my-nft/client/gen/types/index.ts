import * as WhitelistMode from "./WhitelistMode"
import * as ErrorCode from "./ErrorCode"

export { PublicMode } from "./PublicMode"
export type { PublicModeFields, PublicModeJSON } from "./PublicMode"
export { WhitelistTokenMode } from "./WhitelistTokenMode"
export type {
  WhitelistTokenModeFields,
  WhitelistTokenModeJSON,
} from "./WhitelistTokenMode"
export { NFTHolderMode } from "./NFTHolderMode"
export type { NFTHolderModeFields, NFTHolderModeJSON } from "./NFTHolderMode"
export { WhitelistWalletListMode } from "./WhitelistWalletListMode"
export type {
  WhitelistWalletListModeFields,
  WhitelistWalletListModeJSON,
} from "./WhitelistWalletListMode"
export { SaleFaze } from "./SaleFaze"
export type { SaleFazeFields, SaleFazeJSON } from "./SaleFaze"
export { CandyMachineDataV3 } from "./CandyMachineDataV3"
export type {
  CandyMachineDataV3Fields,
  CandyMachineDataV3JSON,
} from "./CandyMachineDataV3"
export { CandyMachineDataV2 } from "./CandyMachineDataV2"
export type {
  CandyMachineDataV2Fields,
  CandyMachineDataV2JSON,
} from "./CandyMachineDataV2"
export { WhitelistV2 } from "./WhitelistV2"
export type { WhitelistV2Fields, WhitelistV2JSON } from "./WhitelistV2"
export { CandyMachineData } from "./CandyMachineData"
export type {
  CandyMachineDataFields,
  CandyMachineDataJSON,
} from "./CandyMachineData"
export { Creator } from "./Creator"
export type { CreatorFields, CreatorJSON } from "./Creator"
export { WhitelistMode }

export type WhitelistModeKind =
  | WhitelistMode.WalletBased
  | WhitelistMode.TokenBased
  | WhitelistMode.Public
  | WhitelistMode.NFTBased
export type WhitelistModeJSON =
  | WhitelistMode.WalletBasedJSON
  | WhitelistMode.TokenBasedJSON
  | WhitelistMode.PublicJSON
  | WhitelistMode.NFTBasedJSON

export { ErrorCode }

export type ErrorCodeKind =
  | ErrorCode.IncorrectOwner
  | ErrorCode.Uninitialized
  | ErrorCode.MintMismatch
  | ErrorCode.IndexGreaterThanLength
  | ErrorCode.ConfigMustHaveAtleastOneEntry
  | ErrorCode.NumericalOverflowError
  | ErrorCode.TooManyCreators
  | ErrorCode.UuidMustBeExactly6Length
  | ErrorCode.NotEnoughTokens
  | ErrorCode.NotEnoughSOL
  | ErrorCode.TokenTransferFailed
  | ErrorCode.CandyMachineEmpty
  | ErrorCode.CandyMachineNotLiveYet
  | ErrorCode.ConfigLineMismatch
  | ErrorCode.WhitelistExists
  | ErrorCode.WhiteListMissing
  | ErrorCode.WrongWhitelist
  | ErrorCode.NotWhitelisted
  | ErrorCode.InvalidFraction
  | ErrorCode.BumpMissing
  | ErrorCode.PriceViolation
  | ErrorCode.NotThawable
  | ErrorCode.TeePot
  | ErrorCode.PresentProof
  | ErrorCode.InvalidDiscriminator
  | ErrorCode.InvalidCollection
export type ErrorCodeJSON =
  | ErrorCode.IncorrectOwnerJSON
  | ErrorCode.UninitializedJSON
  | ErrorCode.MintMismatchJSON
  | ErrorCode.IndexGreaterThanLengthJSON
  | ErrorCode.ConfigMustHaveAtleastOneEntryJSON
  | ErrorCode.NumericalOverflowErrorJSON
  | ErrorCode.TooManyCreatorsJSON
  | ErrorCode.UuidMustBeExactly6LengthJSON
  | ErrorCode.NotEnoughTokensJSON
  | ErrorCode.NotEnoughSOLJSON
  | ErrorCode.TokenTransferFailedJSON
  | ErrorCode.CandyMachineEmptyJSON
  | ErrorCode.CandyMachineNotLiveYetJSON
  | ErrorCode.ConfigLineMismatchJSON
  | ErrorCode.WhitelistExistsJSON
  | ErrorCode.WhiteListMissingJSON
  | ErrorCode.WrongWhitelistJSON
  | ErrorCode.NotWhitelistedJSON
  | ErrorCode.InvalidFractionJSON
  | ErrorCode.BumpMissingJSON
  | ErrorCode.PriceViolationJSON
  | ErrorCode.NotThawableJSON
  | ErrorCode.TeePotJSON
  | ErrorCode.PresentProofJSON
  | ErrorCode.InvalidDiscriminatorJSON
  | ErrorCode.InvalidCollectionJSON
