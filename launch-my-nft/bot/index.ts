import { Connection } from "@solana/web3.js";
import { IMintTask, watchTasks, formatTask, runMintTask } from "./tasks";
import { IConfig } from "./config";

export async function run({ rpcUrl, interval }: IConfig) {
  const connection = new Connection(rpcUrl);
  const schedule: IMintTask[] = [];

  await watchTasks("tasks.json", (newTasks) => schedule.push(...newTasks));

  while (true) {
    const now = new Date();
    let task: IMintTask | undefined;

    while ((task = schedule.shift())) {
      if (task.startDate <= now) {
        console.log(`Running task:\n  ${formatTask(task)}`);
        try {
          await runMintTask({ connection, interval, task });
        } catch (e) {
          console.error("Task failed:", e);
        } finally {
          console.log("Task completed.");
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
