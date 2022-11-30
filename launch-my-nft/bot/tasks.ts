import * as fs from "fs";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  Transaction,
} from "@solana/web3.js";
import { getCandyMachineFromUrl, readKeypairFile } from "./utils";
import { resolve } from "./providers/CandyMachineProvider";

type RawMetaplexTask = {
  startDate: string;
  payerKeypairFile: string;
  maxMintAmount: number;
  metaplex: {
    candyMachine: string;
  };
};

type RawLaunchMyNftTask = {
  startDate: string;
  payerKeypairFile: string;
  maxMintAmount: number;
  launchMyNft: {
    hyperspaceUrl: string;
  };
};

type RawTask = RawMetaplexTask | RawLaunchMyNftTask;

interface IRunMintTask {
  task: ITask;
  interval: number;
  connection: Connection;
}

export interface ITask {
  payer: Signer;
  startDate: Date;
  maxMintAmount: number;
  candyMachineAddress: PublicKey;
  provider: "metaplex" | "launch-my-nft";
}

export const newTask = (
  payerKeypairFile: string,
  candyMachineAddress: PublicKey,
  startDate: Date,
  maxMintAmount: number,
  provider: "metaplex" | "launch-my-nft"
): ITask => {
  return {
    startDate,
    maxMintAmount,
    payer: readKeypairFile(payerKeypairFile),
    candyMachineAddress,
    provider,
  };
};

export const watchTasks = async (
  file: string,
  onChange: (tasks: ITask[]) => void
) => {
  if (!fs.existsSync(file)) {
    console.log(`Tasks file "${file}" not found!`);
    console.log("Creating a new file with placeholder values...");
    const defaultTasks: RawTask[] = [
      {
        startDate: "2021-08-01 18:30:00",
        payerKeypairFile: "payer.json",
        launchMyNft: {
          hyperspaceUrl: "collection_hyperspace_url",
        },
        maxMintAmount: 1,
      },
    ];
    fs.writeFileSync(file, JSON.stringify(defaultTasks, null, 2));
    console.log(`Tasks file created at ${file}! Please edit it and try again.`);
    process.exit(1);
  }

  const oldTasks: ITask[] = [];
  let lastModified = 0;
  const update = async () => {
    const stats = await fs.promises.stat(file);
    if (stats.mtimeMs > lastModified) {
      lastModified = stats.mtimeMs;
      const data = await fs.promises.readFile(file, "utf-8");
      const parsed = JSON.parse(data).map((v: RawTask) =>
        newTask(
          v.payerKeypairFile,
          "metaplex" in v
            ? new PublicKey(v.metaplex.candyMachine)
            : getCandyMachineFromUrl(v.launchMyNft.hyperspaceUrl),
          new Date(v.startDate),
          v.maxMintAmount,
          "metaplex" in v ? "metaplex" : "launch-my-nft"
        )
      ) as ITask[];

      const newTasks = parsed.filter(
        (t) => !oldTasks.find((s) => JSON.stringify(s) === JSON.stringify(t))
      );

      oldTasks.push(...newTasks);
      onChange(newTasks);
    }
  };

  await update();

  fs.watch(file, update);
};

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
        const ix = await providerInstance.createMintInstruction({
          mint: mint.publicKey,
          payer: payer.publicKey,
          candyMachine: candyMachineAddress,
        });

        const tx = new Transaction().add(ix);
        const txSig = await sendAndConfirmTransaction(connection, tx, [
          payer,
          mint,
        ]);

        // Wait interval
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
}: ITask) => {
  return `  CM address: ${candyMachineAddress}
    Max mint amount: ${maxMintAmount}
    Payer: ${payer.publicKey}
    Start date: ${startDate}`;
};
