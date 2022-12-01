import { PublicKey, TransactionInstruction } from "@solana/web3.js";

export interface ICreateMintInstructionDTO {
  candyMachine: PublicKey;
  mint: PublicKey;
  payer: PublicKey;
}

interface ICandyMachineProvider {
  createMintInstruction: (
    args: ICreateMintInstructionDTO
  ) => Promise<TransactionInstruction>;
}

export default ICandyMachineProvider;
