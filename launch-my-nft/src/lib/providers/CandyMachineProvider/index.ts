import { Connection } from "@solana/web3.js";
import LmnCandyMachineProvider from "./implementations/LmnCandyMachineProvider";
import MetaplexCandyMachineV2Provider from "./implementations/MetaplexCandyMachineV2Provider";
import ICandyMachineProvider from "./models/ICandyMachineProvider";

const providers: Record<string, any> = {
  "launch-my-nft": LmnCandyMachineProvider,
  metaplex: MetaplexCandyMachineV2Provider,
};

export function resolve(
  connection: Connection,
  provider: string
): ICandyMachineProvider {
  const Provider = providers[provider];
  if (!Provider) {
    throw new Error(`Provider ${provider} not found`);
  }
  return new Provider(connection);
}
