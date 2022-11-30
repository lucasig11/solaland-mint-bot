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

export async function runMintTask({
  connection,
  interval,
  task: { candyMachineAddress, maxMintAmount, payer, provider },
}: IRunMintTask): Promise<string[]> {
  const providerInstance = resolve(provider, connection);
  return Promise.all(
    Array(maxMintAmount)
      .fill(0)
      .map(async () => {
        const mint = Keypair.generate();
        return [
          await providerInstance.createMintInstruction({
            mint: mint.publicKey,
            payer: payer.publicKey,
            candyMachine: candyMachineAddress,
          }),
          mint,
        ] as [TransactionInstruction, Keypair];
      })
      .map(async (p) => {
        const [ix, mint] = await p;
        const tx = new Transaction().add(ix);
        const txSig = await sendAndConfirmTransaction(connection, tx, [
          payer,
          mint,
        ]);
        await new Promise((resolve) => setTimeout(resolve, interval));
        return txSig;
      })
  );
}

export const formatTask = ({
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

