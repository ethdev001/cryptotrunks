import { web3, wallet, contract } from './common.js';

async function claimGenesisTrunk() {
  var queryDict = {};
  location.search.substr(1).split("&").forEach(function(item) {
    queryDict[item.split("=")[0]] = item.split("=")[1]
  });

  var numberToMint = 1;
  let number = queryDict.buy;
  if (number != undefined) {
    numberToMint = parseInt(number);
  }

  if (numberToMint < 1 || numberToMint > 20) {
    window.location.href = "genesis.html";
    return;
  }

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
