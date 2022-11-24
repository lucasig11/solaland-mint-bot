import axios from "axios";
import * as anchor from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  MintLayout,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";

import { web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

const constants = {
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: new web3.PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  ),
  TOKEN_METADATA_PROGRAM_ID: new web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  ),
  NOVA_LAUNCH_PROGRAM: new web3.PublicKey(
    "nva24Y1vHfhCrCLcqqFLXher9uZR4JjKP4D89MHhkmA"
  ),
  LAUNCHPAD_PROGRAM: new web3.PublicKey(
    "CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb"
  ),
  CIVIC: new web3.PublicKey("gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs"),
  CANDY_MACHINE_PROGRAM: new web3.PublicKey(
    "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ"
  ),
  MONKE_LABS: new web3.PublicKey("minwAEdewYNqagUwzrVBUGWuo277eeSMwEwj76agxYd"),
  LMNFT_PROGRAM: new web3.PublicKey(
    "ArAA6CZC123yMJLUe4uisBEgvfuw2WEvex9iFmFCYiXv"
  ),
  CANDY_MACHINE_ID: new web3.PublicKey(
    "Bit2K3gjW7vXJvUZcHn4sCX6VdAqhQyvzNQcduH8fYwH"
  ),
};

const connection = new web3.Connection(
  "https://small-red-dew.solana-mainnet.quiknode.pro/a7a53c5e116e9196170c3ee6ddc1a150dd64cf9b/",
  { commitment: "finalized" }
);

const keypair = web3.Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(require("fs").readFileSync("keypair.json")))
);

const wallet = new anchor.Wallet(keypair);

const provider = new anchor.AnchorProvider(connection, wallet, {
  preflightCommitment: "processed",
});

async function start() {
  try {
    const { LAUNCHPAD_PROGRAM, CANDY_MACHINE_ID } = constants;
    const idl = await anchor.Program.fetchIdl(LAUNCHPAD_PROGRAM, provider);

    if (!idl) throw new Error("Failed to fetch idl");

    const program = new anchor.Program(idl, LAUNCHPAD_PROGRAM, provider);
    const candyMachineDetails = await program.account.candyMachine.fetch(
      CANDY_MACHINE_ID
    );

    const { args, accounts, signers } = await createLaunchpadMint(
      connection,
      CANDY_MACHINE_ID,
      wallet.payer.publicKey,
      program,
      candyMachineDetails,
      10000,
      "So11111111111111111111111111111111111111112"
    );

    const transaction = await getSignature(args, accounts);

    const notaryResult = await axios.post(
      "https://wk-notary-prod.magiceden.io/mintix",
      `{"params":{"walletLimitInfoBump":252,"inOrder":false,"blockhash":"DZYrNGFGr78LSjTMcrj9a5YsCK8R2P9EP4SpZDqq9tFk","needsNotary":true,"isLite":false},"accounts":{"config":"HP2gDumZYZksSufoHxfPfi87L7QjYt3moNg6uNXD644m","candyMachine":"Bit2K3gjW7vXJvUZcHn4sCX6VdAqhQyvzNQcduH8fYwH","launchStagesInfo":"BiVef6r42o5SiF4hvK5r9peTar9YEbbuhyDPf2sj5a65","candyMachineWalletAuthority":"2yqgkATm193DFuBYv48GaDWuxpNdNfYUKMxBbFqZREUd","mintReceiver":"9BeNtJPhQfV7iRGvgNGMC7Q8hBaiESE5YKQaHQTeiWRr","payer":"9BeNtJPhQfV7iRGvgNGMC7Q8hBaiESE5YKQaHQTeiWRr","payTo":"4JsU8hSktpbRJrBeENCtPVaAHMmmrWEn3htZ4JGVtrvb","payFrom":"9BeNtJPhQfV7iRGvgNGMC7Q8hBaiESE5YKQaHQTeiWRr","mint":"HkZ1QKowUGcEQbAtbysXRFzAn39Kvfxrh6WzLCeozkGT","tokenAta":"3z3khc5uj8zXA9EHySBmvWzVckNLkYwJtnAnRTmroNMt","metadata":"GSZ3ogfGyzmuHPPVsrW8Ru7iYKUCuJ1UTuW5USewAGPg","masterEdition":"HE1k6ox58qPmAbt9bRARLmhvqf34MeS3hDohDCKnpVZd","walletLimitInfo":"CE5T6Ft6SFSQVc1NnGmwroAbTaCK5Mv6aKTf8jKRei9h","tokenMetadataProgram":"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s","tokenProgram":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","systemProgram":"11111111111111111111111111111111","rent":"SysvarRent111111111111111111111111111111111","orderInfo":"ECFpCWtf7YYYNM4vBGEKmLgFt92f7VDqSD7dxFTQku7n","slotHashes":"SysvarS1otHashes111111111111111111111111111","notary":"23W5dZSNiNtKXCGvcjkRAJZ6admMXQ26s3ttBaH6Lb2k","associatedTokenProgram":"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"}}`,
      {
        headers: {
          Referer: "https://magiceden.io/",
          Origin: "https://magiceden.io/",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36",
        },
      }
    );

    console.log(notaryResult.data);

    // await program.provider.wallet.signTransaction(transaction);
    // transaction.partialSign(mintObject.W.mint);
    // transaction.addSignature(
    //   mintObject.W.notary,
    //   bs58.decode(notaryResult.data.signature)
    // );
    // const sendTx = transaction.serialize({ verifySignatures: !1 });

    // let mintTxId = await program.provider.connection.sendRawTransaction(
    //   sendTx,
    //   { preflightCommitment: "processed" }
    // );
    // console.log(mintTxId);

    console.log("misc", `Signing transaction...`);

    transaction.partialSign(...signers);
    console.log(2);

    const signedTx = await wallet.signTransaction(transaction);
    console.log(3);

    const rawTransaction = signedTx.serialize({
      verifySignatures: true,
    });

    connection.sendRawTransaction(rawTransaction);

    console.log(transaction);
  } catch (error) {
    console.log(error);
  }
}

async function createLaunchpadMint(
  connection: web3.Connection,
  candyMachineId: web3.PublicKey,
  payer: web3.PublicKey,
  program: anchor.Program,
  details: Record<string, any>,
  delay: number,
  paymentMint: string
) {
  try {
    let needsNotary =
      details.notary && !details.notary.equals(web3.SystemProgram.programId);

    const mintKp = await bump(payer);
    let payerAta = await anchor.utils.token.associatedAddress({
      mint: mintKp.publicKey,
      owner: payer,
    });
    let [metadata] = await getMetadata(mintKp.publicKey);
    let [masterEdition] = await getMasterEdition(mintKp.publicKey);

    let [limitKey, limitBump] = await limit(candyMachineId, payer);
    let [launchStagesInfo] = await getLaunchStagesInfo(candyMachineId);
    let mintPubkey = new web3.PublicKey(paymentMint);
    let walletAta = await anchor.utils.token.associatedAddress({
      mint: mintPubkey,
      owner: details.walletAuthority,
    });

    const payerAddress = mintPubkey.equals(NATIVE_MINT)
      ? payer
      : await anchor.utils.token.associatedAddress({
          mint: mintPubkey,
          owner: payer,
        });

    const blockhash = await connection.getLatestBlockhash("finalized");

    const args = {
      walletLimitInfoBump: limitBump,
      inOrder: false,
      blockhash: blockhash.blockhash,
      needsNotary: needsNotary,
      isLite: false,
    };

    const accounts = {
      config: details.config,
      candyMachine: candyMachineId,
      launchStagesInfo,
      candyMachineWalletAuthority: details.walletAuthority,
      mintReceiver: payer,
      payer: payer,
      payTo: walletAta,
      payFrom: payerAddress,
      mint: mintKp.publicKey,
      tokenAta: payerAta,
      metadata,
      masterEdition,
      walletLimitInfo: limitKey,
      tokenMetadataProgram: constants.TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      orderInfo: details.orderInfo,
      slotHashes: new web3.PublicKey(
        "SysvarS1otHashes111111111111111111111111111"
      ),
      notary: details.notary ?? web3.PublicKey.default,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    };

    return {
      args,
      accounts,
      signers: [mintKp],
    };
  } catch (err) {
    console.log(err);
    console.log("error", "Unknown error while creating mint!");

    return await createLaunchpadMint(
      connection,
      candyMachineId,
      payer,
      program,
      details,
      delay,
      paymentMint
    );
  }
}

async function bump(payer: PublicKey): Promise<web3.Keypair> {
  let pdas: [web3.PublicKey, number][];

  let metadata: [web3.PublicKey, number],
    masterEdition: [web3.PublicKey, number],
    tokenWallet: [web3.PublicKey, number];

  let metadataBump: number, masterEditionBump: number, tokenWalletBump: number;

  let a = 0;
  let t = [payer].length > 1 && void 0 !== [payer][1] ? [payer][1] : 100;

  while (true) {
    if (a >= t) throw 1;

    let r = web3.Keypair.generate();
    let metadataFunctions = await Promise.all([
      getMetadata(r.publicKey),
      getMasterEdition(r.publicKey),
      getTokenWallet(payer, r.publicKey),
    ]);

    if (
      ((pdas = metadataFunctions),
      (metadata = pdas[0]),
      metadata[0],
      (metadataBump = metadata[1]),
      (masterEdition = pdas[1]),
      masterEdition[0],
      (masterEditionBump = masterEdition[1]),
      (tokenWallet = pdas[2]),
      tokenWallet[0],
      (tokenWalletBump = tokenWallet[1]),
      255 !== metadataBump ||
        255 !== masterEditionBump ||
        255 !== tokenWalletBump)
    ) {
      a += 1;
    } else {
      return r;
    }
  }
}

async function getSignature(
  args: Record<string, any>,
  accounts: Record<string, any>
): Promise<web3.Transaction> {
  try {
    const { LAUNCHPAD_PROGRAM, CANDY_MACHINE_ID } = constants;

    const idl = await anchor.Program.fetchIdl(LAUNCHPAD_PROGRAM, provider);
    if (!idl) throw new Error("Unable to fetch idl");

    const program = new anchor.Program(idl, LAUNCHPAD_PROGRAM, provider);
    let a = Object.keys(accounts).reduce((acc, curr) => {
      acc[curr] = new PublicKey(accounts[curr]);
      return acc;
    }, {} as Record<string, PublicKey>);

    const rent =
      await program.provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      );

    const candyMachineDetails = await program.account.candyMachine.fetch(
      CANDY_MACHINE_ID
    );

    const tx = await program.methods
      .mintNft(args.walletLimitBump, false, null, new anchor.BN(Date.now()))
      .accounts({
        config: candyMachineDetails.config,
        candyMachine: new web3.PublicKey(a.candyMachine),
        launchStagesInfo: new web3.PublicKey(a.launchStagesInfo), //
        payer: a.payer,
        candyMachineWalletAuthority: a.candyMachineWalletAuthority,
        mintReceiver: a.mintReceiver,
        payTo: a.payTo,
        payFrom: a.payFrom,
        mint: a.mint, //
        tokenAta: a.tokenAta,
        metadata: a.metadata, //
        masterEdition: a.masterEdition, //
        walletLimitInfo: a.walletLimitInfo, //
        mintAuthority: a.payer, //
        updateAuthority: a.payer, //
        tokenMetadataProgram: constants.TOKEN_METADATA_PROGRAM_ID, //
        tokenProgram: TOKEN_PROGRAM_ID, //
        systemProgram: web3.SystemProgram.programId, //
        rent: web3.SYSVAR_RENT_PUBKEY, //
        clock: web3.SYSVAR_CLOCK_PUBKEY, //
        orderInfo: a.orderInfo,
        slotHashes: new web3.PublicKey(
          "SysvarS1otHashes111111111111111111111111111"
        ), //
        notary: a.notary,
        associatedTokenProgram: a.associatedTokenProgram,
      })
      .signers([accounts.mint])
      .remainingAccounts([
        {
          pubkey: new web3.PublicKey("11111111111111111111111111111111"),
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: a.payer,
          isWritable: false,
          isSigner: false,
        },
        {
          pubkey: a.notary || web3.SystemProgram.programId,
          isWritable: false,
          isSigner: true,
        },
      ])
      .preInstructions([
        web3.SystemProgram.createAccount({
          fromPubkey: a.payer,
          newAccountPubkey: a.mint,
          space: MintLayout.span,
          lamports: rent,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(a.mint, 0, a.payer, a.payer),
        createAssociatedTokenAccountInstruction(
          a.payer,
          a.tokenAta,
          a.payer,
          a.mint
        ),
        createMintToInstruction(a.mint, a.tokenAta, a.payer, 1),
      ])
      .transaction();

    tx.feePayer = new web3.PublicKey(a.payer);
    tx.recentBlockhash = (
      await connection.getLatestBlockhash("finalized")
    ).blockhash;

    return tx;
  } catch (err) {
    console.log(err);
    console.log("error", "Unknown error while signing mint!");
    throw err;
  }
}

start();

const getMetadata = async (mint: PublicKey) => {
  return await web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      constants.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    constants.TOKEN_METADATA_PROGRAM_ID
  );
};

const getMasterEdition = async (mint: PublicKey) => {
  return await web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      constants.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    constants.TOKEN_METADATA_PROGRAM_ID
  );
};

const getTokenWallet = async (wallet: PublicKey, mint: PublicKey) => {
  return await web3.PublicKey.findProgramAddress(
    [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    constants.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
};

const limit = async (candyMachineId: PublicKey, payer: PublicKey) => {
  return web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("wallet_limit"),
      candyMachineId.toBuffer(),
      payer.toBuffer(),
    ],
    constants.LAUNCHPAD_PROGRAM
  );
};

const getLaunchStagesInfo = async (candyMachineId: PublicKey) => {
  return web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("candy_machine"),
      anchor.utils.bytes.utf8.encode("launch_stages"),
      candyMachineId.toBuffer(),
    ],
    constants.LAUNCHPAD_PROGRAM
  );
};
