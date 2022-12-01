import { Metaplex } from "@metaplex-foundation/js";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  Transaction,
} from "@solana/web3.js";
import { resolve } from "./providers/CandyMachineProvider";
import whitelists from "../config/whitelist";
import ICandyMachineProvider from "./providers/CandyMachineProvider/models/ICandyMachineProvider";

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

const isElegible = async (
  connection: Connection,
  user: PublicKey
): Promise<boolean> => {
  const mpl = new Metaplex(connection);
  const nfts = await mpl.nfts().findAllByOwner({ owner: user });
  return (
    await Promise.all(
      whitelists.map(async (whitelist) => {
        if (whitelist.type === "collection") {
          return nfts.some((nft) =>
            nft.collection?.address.equals(whitelist.collection)
          );
        } else if (whitelist.type === "creator") {
          return nfts.some(({ creators }) =>
            creators[0].address.equals(whitelist.creator)
          );
        }
        return false;
      })
    )
  ).some((isElegible) => isElegible);
};

interface IRunMintTaskResult {
  status: "success" | "failure";
  data: any;
}

const mint = async (
  connection: Connection,
  provider: ICandyMachineProvider,
  payer: Signer,
  candyMachineAddress: PublicKey,
  interval: number
): Promise<IRunMintTaskResult> => {
  const mint = Keypair.generate();
  const ix = await provider.createMintInstruction({
    mint: mint.publicKey,
    payer: payer.publicKey,
    candyMachine: candyMachineAddress,
  });
  const tx = new Transaction().add(ix);
  try {
    const txSig = await sendAndConfirmTransaction(connection, tx, [
      payer,
      mint,
    ]);
    await new Promise((resolve) => setTimeout(resolve, interval));
    return {
      status: "success",
      data: txSig,
    };
  } catch (e) {
    return {
      status: "failure",
      data: e,
    };
  }
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
