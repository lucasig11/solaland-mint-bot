import { Metaplex } from "@metaplex-foundation/js";
import { TransactionInstruction, Connection } from "@solana/web3.js";
import ICandyMachineProvider, { ICreateMintInstructionDTO } from "../..";

export default class MetaplexCandyMachineV2 implements ICandyMachineProvider {
  private metaplex: Metaplex;

  public constructor(public readonly connection: Connection) {
    this.metaplex = new Metaplex(connection);
  }

  public async createMintInstruction({
    candyMachine,
  }: ICreateMintInstructionDTO): Promise<TransactionInstruction> {
    const candyMachineAccount = await this.metaplex
      .candyMachinesV2()
      .findByAddress({ address: candyMachine });

    const ixs = (
      await this.metaplex.candyMachinesV2().builders().mint({
        candyMachine: candyMachineAccount,
      })
    ).getInstructions();

    console.log(ixs);

    return ixs[0];
  }
}
