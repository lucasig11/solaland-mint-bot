import { Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";
import {
  CandyMachineV2,
  CandyMachineV3,
  CandyMachineV4,
  CandyMachineV5,
  CandyMachineV6,
} from "./gen/accounts";
import * as accounts from "./gen/accounts";

export type CandyMachineVersion = `V${2 | 3 | 4 | 5 | 6}`;
export type CandyMachine =
  | CandyMachineV2
  | CandyMachineV3
  | CandyMachineV4
  | CandyMachineV5
  | CandyMachineV6;
export type VersionedCandyMachine = CandyMachine & {
  version: CandyMachineVersion;
};

export const getVersionedCandyMachine = async (
  connection: Connection,
  candyMachine: PublicKey
): Promise<VersionedCandyMachine | null> => {
  const account = await connection.getAccountInfo(candyMachine);
  if (!account) return null;
  return Object.assign(decodeCandyMachine(account.data), {
    version: getCandyMachineVersion(account.data),
  });
};

export const decodeCandyMachine = (
  data: Buffer,
  version?: CandyMachineVersion
): CandyMachine => {
  return accounts[
    `CandyMachine${version ?? getCandyMachineVersion(data)}`
  ].decode(data);
};

/* Private helpers */
const getCandyMachineVersion = (data: Buffer): CandyMachineVersion => {
  const disc = data.subarray(0, 8).toString();
  switch (disc) {
    case CandyMachineV2.discriminator.toString():
      return "V2";
    case CandyMachineV3.discriminator.toString():
      return "V3";
    case CandyMachineV4.discriminator.toString():
      return "V4";
    case CandyMachineV5.discriminator.toString():
      return "V5";
    case CandyMachineV6.discriminator.toString():
      return "V6";
    default:
      throw new Error("Invalid account or CandyMachine version not supported.");
  }
};
