import * as fs from "fs";
import * as path from "path";

export interface IConfig {
  rpcUrl: string;
  interval: number;
}

export const readConfigFile = (file: string): IConfig => {
  const p = path.resolve(process.cwd(), file);

  if (!fs.existsSync(p)) {
    console.log(`Config file ${file} not found!`);
    console.log("Creating a new file with placeholder values...");

    const defaultConfig: IConfig = {
      rpcUrl: "https://api.mainnet-beta.solana.com",
      interval: 1000,
    };

    fs.writeFileSync(p, JSON.stringify(defaultConfig, null, 2));
    console.log(`Config file created ${file}! Please edit it and try again.`);
    process.exit(1);
  }

  const contents = fs.readFileSync(p, "utf8");
  const parsed = JSON.parse(contents, (k, v) => {
    switch (k) {
      case "interval":
        return v || 1000;
      default:
        return v;
    }
  }) as IConfig;

  return parsed;
};
