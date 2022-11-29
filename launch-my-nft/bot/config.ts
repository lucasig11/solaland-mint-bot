import * as fs from "fs";
import * as path from "path";

export interface Task {
  startDate: Date;
  payerKeypairFile: string;
  hyperspaceUrl: string;
  maxMintAmount: number;
}

export interface Config {
  rpcUrl: string;
  interval: number;
  tasks: Task[];
}

export const readConfigFile = (file: string): Config => {
  const p = path.resolve(process.cwd(), file);

  if (!fs.existsSync(p)) {
    console.log(`Config file ${file} not found!`);
    console.log("Creating a new file with placeholder values...");

    const defaultConfig: Config = {
      rpcUrl: "https://api.mainnet-beta.solana.com",
      interval: 1000,
      tasks: [
        {
          maxMintAmount: 1,
          startDate: new Date(),
          payerKeypairFile: "payer.json",
          hyperspaceUrl: "https://hyperspace.solana.com/candy/1",
        },
      ],
    };

    fs.writeFileSync(p, JSON.stringify(defaultConfig, null, 2));
    console.log(`Config file created ${file}! Please edit it and try again.`);
    process.exit(1);
  }

  const contents = fs.readFileSync(p, "utf8");
  const parsed = JSON.parse(contents, (k, v) => {
    switch (k) {
      case "tasks":
        return v.map((task: Task) => {
          const startDate = new Date(task.startDate);
          if (isNaN(startDate.getTime()))
            throw new Error(`Failed to parse date: ${task.startDate}`);
          return { ...task, startDate };
        });
      case "interval":
        return v || 1000;
      default:
        return v;
    }
  }) as Config;

  return parsed;
};
