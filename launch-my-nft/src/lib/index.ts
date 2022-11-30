import { Connection } from "@solana/web3.js";
import { IMintTask, formatTask, runMintTask } from "./tasks";
import Scheduler from "./scheduler";

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
    console.log(`Running task:\n  ${formatTask(task)}`);
    await runMintTask({ connection, interval, task });
  });
}

export { start, Scheduler, IConfig, IMintTask };
