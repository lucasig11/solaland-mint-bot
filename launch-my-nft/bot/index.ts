#!/usr/bin/env node
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { LaunchMyNftCmClient } from "../client";
import { getVersionedCandyMachine } from "../client/utils";
import { fromTxError } from "../client/gen/errors";
import { readConfigFile } from "./config";
import { ITask, watchTasks, formatTask } from "./tasks";

// Launch my NFT fee wallet (should be the same for every mint/candy machine).
const LMN_FEE_WALLET = "33nQCgievSd3jJLSWFBefH3BJRN7h6sAoS82VFFdJGF5";

interface IRunTask {
  connection: Connection;
  client: ReturnType<typeof LaunchMyNftCmClient>;
  feeWallet: PublicKey;
  interval: number;
  task: ITask;
}

async function main() {
  const { rpcUrl, interval } = readConfigFile("config.json");
  const connection = new Connection(rpcUrl);
  const feeWallet = new PublicKey(LMN_FEE_WALLET);
  const client = LaunchMyNftCmClient(connection);
  const schedule: ITask[] = [];

  console.log("SolaLand Mint Bot v1.0.0");
  console.log("Use CTRL+C to quit.\n");
  console.log("========================================");
  console.log("RPC URL:", rpcUrl);
  console.log("Interval between RPC calls:", interval, "ms");

  await watchTasks("tasks.json", async (newTasks) => {
    process.stdout.clearLine(0);
    console.log(`Found ${newTasks.length} new task(s).`);
    console.log("========================================");
    schedule.push(...newTasks);
  });

  while (true) {
    const now = new Date();
    let task: ITask | undefined;

    while ((task = schedule.shift())) {
      if (task.startDate <= now) {
        console.log(`Running task:\n  ${formatTask(task)}`);
        try {
          await runTask({ connection, client, feeWallet, interval, task });
          console.log("Task completed.");
        } catch (e) {
          console.error("Task failed:");
          const err = e as { logs?: string[] };
          console.error(err.logs || "");
        } finally {
          console.log("========================================");
        }
      }
    }

    process.stdout.write("No task to run. Waiting for new tasks...\r");

    // Sleep for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function runTask({
  client,
  connection,
  feeWallet,
  interval,
  task: { candyMachineAddress, maxMintAmount, payer },
}: IRunTask) {
  const candyMachine = await getVersionedCandyMachine(
    connection,
    candyMachineAddress
  );
  if (!candyMachine) throw new Error("Candy machine not found!");

  try {
    const txs = await Promise.all(
      Array(maxMintAmount)
        .fill(0)
        .map(async () => {
          if (
            candyMachine.version === "V2" ||
            candyMachine.version === "V3" ||
            candyMachine.version === "V4"
          )
            throw new Error("Unsupported candy machine version!");

          const mint = Keypair.generate();
          const ix = client[`createMint${candyMachine.version}Instruction`]({
            feeWallet,
            mint: mint.publicKey,
            payer: payer.publicKey,
            wallet: candyMachine.wallet,
            candyMachine: candyMachineAddress,
          });

          const tx = new Transaction().add(ix);
          const txSig = await sendAndConfirmTransaction(connection, tx, [
            payer,
            mint,
          ]);

          // Wait interval
          await new Promise((resolve) => setTimeout(resolve, interval));

          return txSig;
        })
    );
    console.log(txs.join("\n"));
  } catch (e) {
    const parsed = fromTxError(e);
    if (parsed) throw parsed;
    throw e;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
