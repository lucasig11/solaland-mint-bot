#!/usr/bin/env node
import { start } from "..";
import Scheduler from "../scheduler";
import { IMintTask } from "../tasks";
import { readConfigFile, watchTaskFile } from "./utils";

async function main() {
  const config = readConfigFile("config.json");
  const scheduler = new Scheduler<IMintTask>(config.interval);
  await watchTaskFile("tasks.json", (newTasks) => scheduler.add(...newTasks));
  await start(config, scheduler);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
