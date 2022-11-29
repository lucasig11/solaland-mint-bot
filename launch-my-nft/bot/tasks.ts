import * as fs from "fs";
import { Keypair, PublicKey } from "@solana/web3.js";
import { getCandyMachineFromUrl, readKeypairFile } from "./utils";

interface IRawTask {
  startDate: string;
  payerKeypairFile: string;
  hyperspaceUrl: string;
  maxMintAmount: number;
}

export interface ITask {
  payer: Keypair;
  startDate: Date;
  maxMintAmount: number;
  candyMachineAddress: PublicKey;
}

export const newTask = (
  payerKeypairFile: string,
  hyperspaceUrl: string,
  startDate: Date,
  maxMintAmount: number
): ITask => {
  return {
    startDate,
    maxMintAmount,
    payer: readKeypairFile(payerKeypairFile),
    candyMachineAddress: getCandyMachineFromUrl(hyperspaceUrl),
  };
};

export const watchTasks = async (
  file: string,
  onChange: (tasks: ITask[]) => void
) => {
  if (!fs.existsSync(file)) {
    console.log(`Tasks file "${file}" not found!`);
    console.log("Creating a new file with placeholder values...");
    const defaultTasks: IRawTask[] = [
      {
        startDate: "2021-08-01 18:30:00",
        payerKeypairFile: "payer.json",
        hyperspaceUrl: "collection_hyperspace_url",
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
      const parsed = JSON.parse(data).map((v: IRawTask) =>
        newTask(
          v.payerKeypairFile,
          v.hyperspaceUrl,
          new Date(v.startDate),
          v.maxMintAmount
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
