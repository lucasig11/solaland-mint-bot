#!/usr/bin/env node
import { readConfigFile } from "./config";
import { run } from ".";

run(readConfigFile("config.json")).catch((e) => {
  console.error(e);
  process.exit(1);
});
