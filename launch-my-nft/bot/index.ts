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
import { readConfigFile, Task } from "./config";
import { formatTask, getCollectionFromUrl, readKeypairFile } from "./utils";

// Launch my NFT fee wallet (should be the same for every mint/candy machine).
const LMN_FEE_WALLET = "33nQCgievSd3jJLSWFBefH3BJRN7h6sAoS82VFFdJGF5";

interface IRunTask {
  connection: Connection;
  client: ReturnType<typeof LaunchMyNftCmClient>;
  feeWallet: PublicKey;
  interval: number;
  task: Task;
}

async function main() {
  const { rpcUrl, interval, tasks } = readConfigFile("config.json");
  const connection = new Connection(rpcUrl);
  const feeWallet = new PublicKey(LMN_FEE_WALLET);
  const client = LaunchMyNftCmClient(connection);

  console.log("SolaLand Mint Bot v1.0.0");
  console.log("========================================");
  console.log("RPC URL:", rpcUrl);
  console.log("Interval:", interval, "ms");
  console.log(
    tasks.map((t, i) => `Task #${i + 1}:\n  ${formatTask(t)}`).join("\n")
  );
  console.log("========================================");
  console.log("Use CTRL+C to quit.");

  while (true) {
    const now = new Date();
    for (const task of tasks) {
      if (task.startDate > now) continue;
      await runTask({ connection, client, feeWallet, interval, task });
    }

    // Sleep for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function runTask({
  client,
  connection,
  feeWallet,
  interval,
  task: { hyperspaceUrl, maxMintAmount, payerKeypairFile },
}: IRunTask) {
  const address = getCollectionFromUrl(hyperspaceUrl);
  const payer = readKeypairFile(payerKeypairFile);
  const candyMachineAddress = new PublicKey(address);
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
