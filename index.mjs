// @ts-check

import {
  amountToUiAmount,
  createInterestBearingMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// declare connection to connect to devnet cluster for testing purposes
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// generates a new keypair for the payer
const payer = Keypair.generate();

// requests for 1 Sol(i.e. 1 billion lamports in 1 sol) airdrop to the publick key generated.
// if I were to put 2000000000 instead == 2 Sol
const airdropSign = await connection.requestAirdrop(
  payer.publicKey, //payer's public key
  0 // = 1 Sol
);

//
await connection.confirmTransaction({
  signature: airdropSign,
  // fetches the latest blockhash
  ...(await connection.getLatestBlockhash()),
});

// has authority for minting the tokens
const mintAuthority = Keypair.generate();

// has authority for updating the interest on the token
const rateAuthority = Keypair.generate();

const mintKeypair = Keypair.generate();

const rate = 19000;
const decimals = 0;

const mint = await createInterestBearingMint(
  connection,
  payer,
  mintAuthority.publicKey,
  mintAuthority.publicKey,
  rateAuthority.publicKey,
  rate,
  decimals,
  mintKeypair,
  undefined,
  TOKEN_2022_PROGRAM_ID
); // creates new mint account with interest bearing

console.log(mint.toBase58());

const accountBalance = 1000;

setInterval(async () => {
  const uiAmount = await amountToUiAmount(
    connection,
    payer,
    mint,
    accountBalance,
    TOKEN_2022_PROGRAM_ID
  );
  console.log(uiAmount);
}, 2000);
