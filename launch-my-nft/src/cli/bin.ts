#!/usr/bin/env node
import { start, Scheduler, IMintTask } from "../lib";
import { readConfigFile, watchTaskFile } from "./utils";

async function main() {
  const config = readConfigFile("config.json");
  const scheduler = new Scheduler<IMintTask>();
  await watchTaskFile("tasks.json", (newTasks) => scheduler.add(...newTasks));
  await start(config, scheduler);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
