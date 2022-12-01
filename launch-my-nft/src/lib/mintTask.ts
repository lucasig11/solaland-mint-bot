import { Metaplex } from "@metaplex-foundation/js";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { resolve } from "./providers/CandyMachineProvider";

export interface IMintTask {
  payer: Signer;
  startDate: Date;
  maxMintAmount: number;
  candyMachineAddress: PublicKey;
  provider: "metaplex" | "launch-my-nft";
}

interface IRunMintTask {
  task: IMintTask;
  interval: number;
  connection: Connection;
}

const isHolding = async (
  connection: Connection,
  user: PublicKey,
  creatorAddress: PublicKey
): Promise<boolean> => {
  const nfts = await Metaplex.make(connection)
    .nfts()
    .findAllByOwner({ owner: user });
  return nfts.some(({ creators }) =>
    creators[0].address.equals(creatorAddress)
  );
};

export async function runMintTask({
  connection,
  interval,
  task: { candyMachineAddress, maxMintAmount, payer, provider },
}: IRunMintTask): Promise<IRunMintTaskResult[]> {
  if (!isElegible(connection, payer.publicKey)) {
    return [
      {
        status: "failure",
        data: new Error(
          `[WhitelistError] Wallet ${payer.publicKey.toString()} is not elegible to mint.`
        ),
      },
    ];
  }

  const providerInstance = resolve(connection, provider);
  return Promise.all(
    Array(maxMintAmount)
      .fill(0)
      .reduce((results) => {
        return [
          ...results,
          mint(
            connection,
            providerInstance,
            payer,
            candyMachineAddress,
            interval
          ),
        ];
      }, [])
  );
}

export const formatMintTask = ({
  payer,
  startDate,
  candyMachineAddress,
  maxMintAmount,
}: IMintTask) => {
  return `  CM address: ${candyMachineAddress}
    Max mint amount: ${maxMintAmount}
    Payer: ${payer.publicKey}
    Start date: ${startDate}`;
};
