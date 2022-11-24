import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { mintV5, mintV6 } from "./gen/instructions";
import { Metaplex } from "@metaplex-foundation/js";
import BN from "bn.js";
import { getTotalMintsAddress } from "./pda";

interface MintV5Args {
  candyMachine: PublicKey;
  mint: PublicKey;
  payer: PublicKey;
  wallet: PublicKey;
  wallet2: PublicKey;
}

type MintV6Args = MintV5Args;

type ClientInstruction<R> = (a: R) => TransactionInstruction;

interface Client {
  createMintV5Instruction: ClientInstruction<MintV5Args>;
  createMintV6Instruction: ClientInstruction<MintV6Args>;
}

export const LaunchMyNftCmClient = (connection: Connection): Client => {
  const systemProgram = SystemProgram.programId;
  const tokenProgram = TOKEN_PROGRAM_ID;
  const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID;
  const metaplex = new Metaplex(connection);
  const tokenMetadataProgram = metaplex.programs().getTokenMetadata().address;

  const createMintV5Instruction = ({
    candyMachine,
    mint,
    payer,
    wallet,
    wallet2,
  }: MintV6Args) => {
    const metadata = metaplex.nfts().pdas().metadata({ mint });
    const masterEdition = metaplex.nfts().pdas().masterEdition({ mint });
    const associated = getAssociatedTokenAddressSync(mint, payer);
    const totalMints = getTotalMintsAddress({ candyMachine, payer });

    const expect = new BN([0x00, 0x87, 0x93, 0x03], "le");
    return mintV5(
      { expect, proof: [] },
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

  const createMintV6Instruction = ({
    candyMachine,
    mint,
    payer,
    wallet,
    wallet2,
  }: MintV6Args) => {
    const metadata = metaplex.nfts().pdas().metadata({ mint });
    const masterEdition = metaplex.nfts().pdas().masterEdition({ mint });
    const associated = getAssociatedTokenAddressSync(mint, payer);
    const totalMints = getTotalMintsAddress({ candyMachine, payer });

    const expect = new BN([0x00, 0x94, 0x35, 0x77], "le");

    return mintV6(
      { expect, proof: [] },
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
