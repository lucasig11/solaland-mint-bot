#!/usr/bin/env node
import { start, IMintTask } from "../lib";
import { Scheduler, SchedulerTaskResult } from "../lib/scheduler";
import { readConfigFile, watchTaskFile } from "./utils";

async function main() {
  const scheduler = new Scheduler<IMintTask>(taskResultHandler);
  const config = readConfigFile("config.json");
  await watchTaskFile("tasks.json", (newTasks) =>
    scheduler.queue.push(...newTasks)
  );
  await start(config, scheduler);
}

const taskResultHandler = (taskResults: SchedulerTaskResult[]) => {
  const [success, fail] = taskResults.reduce(
    ([s, f], res) => {
      if (res.status === "success") {
        s.push(res);
      } else {
        f.push(res);
      }
      return [s, f];
    },
    [[], []] as SchedulerTaskResult[][]
  );
  console.log(`Success: ${success.length}, Failure: ${fail.length}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
