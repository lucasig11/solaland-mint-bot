import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";

export interface ICreateMintInstructionDTO {
  candyMachine: PublicKey;
  mint: PublicKey;
  payer: PublicKey;
}

interface ICandyMachineProvider<T> {
  createMintInstruction: (
    args: ICreateMintInstructionDTO
  ) => Promise<TransactionInstruction>;

  fetchCandyMachine: (
    connection: Connection,
    cm: PublicKey
  ) => Promise<T | null>;

  decodeCandyMachine: (data: Buffer) => T | null;
}

export default ICandyMachineProvider;
