import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { mintV5, mintV6 } from "./gen/instructions";
import { Metaplex } from "@metaplex-foundation/js";
import BN from "bn.js";
import { findTotalMintsAddress } from "./pda";
import { getVersionedCandyMachine } from "./utils";
import { CandyMachineV2, CandyMachineV3 } from "./gen/accounts";
import { CandyMachineDataV3 } from "./gen/types";

export interface MintV5Args {
  candyMachine: PublicKey;
  mint: PublicKey;
  payer: PublicKey;
  wallet: PublicKey;
  feeWallet: PublicKey;
}

type MintV6Args = MintV5Args;

export const LaunchMyNftCmClient = (connection: Connection) => {
  const systemProgram = SystemProgram.programId;
  const tokenProgram = TOKEN_PROGRAM_ID;
  const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID;
  const metaplex = new Metaplex(connection);
  const tokenMetadataProgram = metaplex.programs().getTokenMetadata().address;

  const createMintV5Instruction = async ({
    candyMachine,
    mint,
    payer,
    wallet,
    feeWallet: wallet2,
  }: MintV6Args) => {
    const metadata = metaplex.nfts().pdas().metadata({ mint });
    const masterEdition = metaplex.nfts().pdas().masterEdition({ mint });
    const associated = getAssociatedTokenAddressSync(mint, payer);
    const totalMints = findTotalMintsAddress({ candyMachine, payer });

    const cm = await getVersionedCandyMachine(connection, candyMachine);
    const data = cm?.data as CandyMachineDataV3;
    const nowTs = Math.floor(Date.now() / 1000);
    const price =
      data.saleFazes.filter((f) => f.start.gtn(nowTs)).at(-1)?.price ||
      new BN(0);
    const proof = [[]];

    return mintV5(
      { expect: price, proof },
      {
        candyMachine,
        mint,
        metadata,
        totalMints,
        masterEdition,
        wallet,
        wallet2,
        associated,
        payer,
        systemProgram,
        tokenProgram,
        tokenMetadataProgram,
        associatedTokenProgram,
      }
    );
  };

  const createMintV6Instruction = async ({
    candyMachine,
    mint,
    payer,
    wallet,
    feeWallet: wallet2,
  }: MintV6Args) => {
    const metadata = metaplex.nfts().pdas().metadata({ mint });
    const masterEdition = metaplex.nfts().pdas().masterEdition({ mint });
    const associated = getAssociatedTokenAddressSync(mint, payer);
    const totalMints = findTotalMintsAddress({ candyMachine, payer });

    const cm = await getVersionedCandyMachine(connection, candyMachine);
    const data = cm?.data as CandyMachineDataV3;
    const nowTs = Math.floor(Date.now() / 1000);
    const price =
      data.saleFazes.filter((f) => f.start.gtn(nowTs)).at(0)?.price ||
      new BN(0);
    const proof = [[]];

    return mintV6(
      { expect: price, proof },
      {
        candyMachine,
        mint,
        metadata,
        totalMints,
        masterEdition,
        wallet,
        wallet2,
        associated,
        payer,
        systemProgram,
        tokenProgram,
        tokenMetadataProgram,
        associatedTokenProgram,
      }
    );
  };

  return { createMintV5Instruction, createMintV6Instruction };
};
