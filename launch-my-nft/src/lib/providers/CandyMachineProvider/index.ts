import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import LmnCandyMachineProvider from "./implementations/LmnCandyMachineProvider";
import MetaplexCandyMachineV2Provider from "./implementations/MetaplexCandyMachineV2Provider";

export interface ICreateMintInstructionDTO {
  candyMachine: PublicKey;
  mint: PublicKey;
  payer: PublicKey;
}

export function resolve(
  provider: string,
  connection: Connection
): ICandyMachineProvider {
  switch (provider) {
    case "launch-my-nft":
      return new LmnCandyMachineProvider(connection);
    case "metaplex":
      return new MetaplexCandyMachineV2Provider(connection);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

interface ICandyMachineProvider {
  createMintInstruction: (
    args: ICreateMintInstructionDTO
  ) => Promise<TransactionInstruction>;
}

export default ICandyMachineProvider;
