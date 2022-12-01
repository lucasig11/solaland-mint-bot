# Solana Mint Bot

## Setup
```sh
yarn install
```

## Run the CLI
```sh
cd launch-my-nft

# Build package
yarn build

# Install locally and run
yarn local
```

## Using as a lib.
```ts
// import react etc...
import {start, Scheduler, IMintTask } from "src/lib";

const ReactComponent = () => {
  const scheduler = new Scheduler<IMintTask>();
  const handleAddTask = useCallback((task) => {
    scheduler.queue.push(task);
  }, []);

  const handleStartBot = useCallback(async () => {
    await start({ rpcUrl, interval: 1000 })
  }, [])

  return (
    </>
      <button onClick={handleStartBot}>Start tasks</button>
      <button onClick={() => handleAddTask({
        payer,
        startDate,
        maxMintAmount,
        candyMachineAddress,
        provider: "metaplex", // or "launch-my-nft"
      })}>Add new task</button>
    </>
  )
}

```
