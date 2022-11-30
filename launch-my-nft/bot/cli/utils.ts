import * as path from "path";
import * as fs from "fs";
import { PublicKey } from "@solana/web3.js";

import { IConfig } from "..";
import { IMintTask, newMintTask } from "../tasks";
import { getCandyMachineFromUrl } from "../utils";

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

export const watchTaskFile = async (
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

export const readConfigFile = (file: string): IConfig => {
  const p = path.resolve(process.cwd(), file);

  if (!fs.existsSync(p)) {
    console.log(`Config file ${file} not found!`);
    console.log("Creating a new file with placeholder values...");

    const defaultConfig: IConfig = {
      rpcUrl: "https://api.mainnet-beta.solana.com",
      interval: 1000,
    };

    fs.writeFileSync(p, JSON.stringify(defaultConfig, null, 2));
    console.log(`Config file created ${file}! Please edit it and try again.`);
    process.exit(1);
  }

  const contents = fs.readFileSync(p, "utf8");
  const parsed = JSON.parse(contents, (k, v) => {
    switch (k) {
      case "interval":
        return v || 1000;
      default:
        return v;
    }
  }) as IConfig;

  return parsed;
};
