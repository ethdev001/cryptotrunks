import { web3, wallet, contract } from './common.js';

async function claimGenesisTrunk() {
  // TODO Tidy up, set amounts
  let numberToMint = 1;
  let fee = web3.utils.toWei(String(numberToMint * 0.5));

  let mint = await contract.methods.mintGenesisTrunk(numberToMint).send({ from: wallet, value: fee }).catch (function (error){
      window.location.href = "genesis.html";
  });
  let tokenId = mint.events.Transfer.returnValues.tokenId;

  console.log("Mint: " + mint);
  document.mint = mint;
  console.log("Token ID: " + tokenId);
  window.location.href = "wallet.html";
}

document.onload = claimGenesisTrunk();
