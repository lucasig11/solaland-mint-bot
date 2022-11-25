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

export const fetchLmnCollections = async (owner: PublicKey) => {
  const searches = [
    {
      query_by: "owner",
      sort_by: "deployed:desc,fractionMinted:desc",
      exclude_fields: "collectionBannerUrl",
      highlight_full_fields: "owner",
      collection: "collections",
      q: `${owner}`,
      facet_by: "",
      page: 1,
    },
  ];

  const res = await axios.post(
    "https://s.launchmynft.io/multi_search",
    JSON.stringify({ data: { searches } }),
    {
      params: {
        "x-typesense-api-key":
          "UkN4Vnd3V2JMWWVIRlFNcTJ3dng4VGVtMGtvVGxBcmJJTTFFYS9MNXp1WT1Ha3dueyJmaWx0ZXJfYnkiOiJoaWRkZW46ZmFsc2UiLCJleGNsdWRlX2ZpZWxkcyI6ImhpZGRlbiIsInF1ZXJ5X2J5IjoiY29sbGVjdGlvbk5hbWUsb3duZXIiLCJsaW1pdF9oaXRzIjoyMDAsInNuaXBwZXRfdGhyZXNob2xkIjo1MH0=",
      },
    }
  );

  return res.data.results[0].hits;
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
