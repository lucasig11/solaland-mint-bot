import { Connection } from "@solana/web3.js";
import { ITask, watchTasks, formatTask, runMintTask } from "./tasks";
import { IConfig } from "./config";
import LmnCandyMachineProvider from "./providers/CandyMachineProvider/implementations/LmnCandyMachineProvider";

export async function run({ rpcUrl, interval }: IConfig) {
  const connection = new Connection(rpcUrl);

  const schedule: ITask[] = [];
  await watchTasks("tasks.json", (newTasks) => schedule.push(...newTasks));

  while (true) {
    const now = new Date();
    let task: ITask | undefined;

    while ((task = schedule.shift())) {
      if (task.startDate <= now) {
        console.log(`Running task:\n  ${formatTask(task)}`);
        try {
          const lmnProvider = new LmnCandyMachineProvider(connection);

          await runMintTask({
            connection,
            provider: lmnProvider,
            interval,
            task,
          });
          console.log("Task completed.");
        } catch (e) {
          console.error("Task failed:", e);
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
