import * as fs from "fs";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { getCandyMachineFromUrl, readKeypairFile } from "./utils";
import { resolve } from "./providers/CandyMachineProvider";

type RawMetaplexTask = {
  metaplex: {
    candyMachine: string;
  };
};

type RawLaunchMyNftTask = {
  launchMyNft: {
    hyperspaceUrl: string;
  };
};

type RawTask = {
  startDate: string;
  payerKeypairFile: string;
  maxMintAmount: number;
} & (RawMetaplexTask | RawLaunchMyNftTask);

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

export const watchTasks = async (
  file: string,
  onChange: (tasks: IMintTask[]) => void
) => {
  if (!fs.existsSync(file)) {
    console.log(`Tasks file "${file}" not found!`);
    console.log("Creating a new file with example values...");
    const defaultTasks: RawTask[] = [
      {
        startDate: "2021-08-01 18:30:00",
        payerKeypairFile: "payer.json",
        launchMyNft: {
          hyperspaceUrl: "collection_hyperspace_url",
        },
        maxMintAmount: 1,
      },
      {
        startDate: "2021-08-01 18:30:00",
        payerKeypairFile: "payer.json",
        metaplex: {
          candyMachine: "candy_machine_address",
        },
        maxMintAmount: 1,
      },
    ];

    fs.writeFileSync(file, JSON.stringify(defaultTasks, null, 2));
    console.log(`Tasks file created at ${file}! Please edit it and try again.`);
    process.exit(1);
  }

  const oldTasks: IMintTask[] = [];
  let lastModified = 0;
  const update = async () => {
    const stats = await fs.promises.stat(file);
    if (stats.mtimeMs > lastModified) {
      lastModified = stats.mtimeMs;
      const data = await fs.promises.readFile(file, "utf-8");
      const parsed = JSON.parse(data).map((v: RawTask) =>
        newMintTask(
          v.payerKeypairFile,
          "metaplex" in v
            ? new PublicKey(v.metaplex.candyMachine)
            : getCandyMachineFromUrl(v.launchMyNft.hyperspaceUrl),
          new Date(v.startDate),
          v.maxMintAmount,
          "metaplex" in v ? "metaplex" : "launch-my-nft"
        )
      ) as IMintTask[];

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

const newMintTask = (
  payerKeypairFile: string,
  candyMachineAddress: PublicKey,
  startDate: Date,
  maxMintAmount: number,
  provider: "metaplex" | "launch-my-nft"
): IMintTask => {
  return {
    startDate,
    maxMintAmount,
    payer: readKeypairFile(payerKeypairFile),
    candyMachineAddress,
    provider,
  };
};
