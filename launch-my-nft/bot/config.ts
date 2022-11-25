import * as fs from "fs";
import * as path from "path";

interface Config {
  rpcUrl: string;
  payerKeypairFile: string;
  collectionHyperspaceUrl: string;
}

export const readConfigFile = (file: string): Config => {
  const contents = fs.readFileSync(path.resolve(__dirname, file), "utf8");
  return JSON.parse(contents) as Config;
};
