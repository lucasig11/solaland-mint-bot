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
  const contents = fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
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
