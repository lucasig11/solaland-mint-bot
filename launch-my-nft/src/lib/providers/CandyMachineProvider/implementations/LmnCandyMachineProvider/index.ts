import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import ICandyMachineProvider, {
  ICreateMintInstructionDTO,
} from "../../models/ICandyMachineProvider";
import { LaunchMyNftCmClient } from "./client";
import { getVersionedCandyMachine } from "./client/utils";

// Launch my NFT fee wallet (should be the same for every mint/candy machine).
const LMN_FEE_WALLET = "33nQCgievSd3jJLSWFBefH3BJRN7h6sAoS82VFFdJGF5";

export default class LmnCandyMachineProvider implements ICandyMachineProvider {
  private feeWallet = new PublicKey(LMN_FEE_WALLET);
  private client: ReturnType<typeof LaunchMyNftCmClient>;

  public constructor(public readonly connection: Connection) {
    this.client = LaunchMyNftCmClient(connection);
  }

  public async createMintInstruction({
    candyMachine: candyMachineAddress,
    mint,
    payer,
  }: ICreateMintInstructionDTO): Promise<TransactionInstruction> {
    const candyMachine = await getVersionedCandyMachine(
      this.connection,
      candyMachineAddress
    );
    if (!candyMachine) throw new Error("Candy machine not found!");

    const wallet = candyMachine.wallet;

    if (
      candyMachine.version === "V2" ||
      candyMachine.version === "V3" ||
      candyMachine.version === "V4"
    )
      throw new Error("Unsupported candy machine version!");

    return this.client[`createMint${candyMachine.version}Instruction`]({
      feeWallet: this.feeWallet,
      candyMachine: candyMachineAddress,
      mint,
      payer,
      wallet,
    });
  }
}
