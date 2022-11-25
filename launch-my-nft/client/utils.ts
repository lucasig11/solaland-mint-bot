import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import {
  Connection,
  GetProgramAccountsFilter,
  MemcmpFilter,
  PublicKey,
} from "@solana/web3.js";
import axios from "axios";
import { CandyMachineV5, CandyMachineV6 } from "./gen/accounts";
import { PROGRAM_ID } from "./gen/programId";

export const getCandyMachines = async (
  connection: Connection,
  authority: PublicKey
) => {
  const cmV5Accounts = await fetchAccounts(connection, [
    accountFilter(CandyMachineV5.discriminator),
    memcmp(41, authority.toBase58()),
  ]);

  const cmV6Accounts = await fetchAccounts(connection, [
    accountFilter(CandyMachineV5.discriminator),
    memcmp(41, authority.toBase58()),
  ]);

  return cmV5Accounts
    .concat(cmV6Accounts)
    .map(({ account, pubkey }) =>
      Object.assign(decodeCandyMachine(account.data), { pubkey })
    );
};

export const decodeCandyMachine = (data: Buffer): CandyMachine =>
  lookup(data).machine.decode(data);

export const getCandyMachineVersion = (data: Buffer): CandyMachineVersion =>
  lookup(data).version;

export const fetchLmnCollections = async () => {
  const data = {
    searches: [
      {
        query_by: "collectionName,owner",
        sort_by: "deployed:desc,fractionMinted:desc",
        exclude_fields: "collectionBannerUrl",
        highlight_full_fields: "collectionName,owner",
        collection: "collections",
        q: "*",
        facet_by: "",
        page: 1,
      },
    ],
  };

  const res = await axios.post(
    "https://s.launchmynft.io/multi_search",
    JSON.stringify(data),
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

type CandyMachine = CandyMachineV5 | CandyMachineV6;

type CandyMachineType = typeof CandyMachineV5 | typeof CandyMachineV6;

type CandyMachineVersion = `v${5 | 6}`;

type CandyMachineInfo = {
  version: CandyMachineVersion;
  machine: CandyMachineType;
};

const INFO_LOOKUP: Record<string, CandyMachineInfo> = {
  [CandyMachineV5.discriminator.toString()]: {
    version: "v5",
    machine: CandyMachineV5,
  },
  [CandyMachineV6.discriminator.toString()]: {
    version: "v6",
    machine: CandyMachineV6,
  },
};

const lookup = (data: Buffer): CandyMachineInfo => {
  const disc = data.subarray(0, 8).toString();
  if (!INFO_LOOKUP[disc])
    throw new Error("Invalid account or CandyMachine version not supported.");
  return INFO_LOOKUP[disc];
};

const fetchAccounts = (
  connection: Connection,
  filters: GetProgramAccountsFilter[]
) => {
  return connection.getProgramAccounts(PROGRAM_ID, {
    filters,
    encoding: "base64",
  });
};

const accountFilter = (discriminator: Buffer) =>
  memcmp(0, bs58.encode(discriminator));

const memcmp = (offset: number, bytes: string): MemcmpFilter => ({
  memcmp: { bytes, offset },
});
