import { Connection } from "@solana/web3.js";
import { IMintTask, formatMintTask, runMintTask } from "./mintTask";
import { Scheduler } from "./scheduler";

interface IConfig {
  rpcUrl: string;
  interval: number;
}

async function start(
  { rpcUrl, interval }: IConfig,
  scheduler: Scheduler<IMintTask>
) {
  const connection = new Connection(rpcUrl);
  scheduler.run(async (task) => {
    console.log(`Running task:\n  ${formatMintTask(task)}`);
    return runMintTask({ connection, interval, task });
  });
}

export { start, IConfig, IMintTask };
