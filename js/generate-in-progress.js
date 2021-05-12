import { web3, wallet, contract, formattedResult, connectMetaMask } from './common.js';

var currentSeed;
var tokenId;
var isLoading = false;
var isBasic = false;

var generateButtonBackground;
var generateButtonText;

function randomInt() {
  let min = 1;
  let max = 1e9;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function regenerateRandomInt() {
    currentSeed = randomInt();
}

async function getBaseFeeTier() {
  let count = await contract.methods.balanceOf(wallet).call()

  // Base case (first mint).
  if (count == 0) {
    return "0.002";
  }

  // Multiplier.
  var multiplier = 1;
  if (count <= 5) {
    multiplier = 1
  } else if (count <= 20) {
    multiplier = 1.5
  } else if (count <= 50) {
    multiplier = 2
  } else if (count <= 100) {
    multiplier = 2.5
  } else {
    multiplier = 3
  }

  // Calculation
  let fee = 0.05 * multiplier
  return fee.toString();
}

async function generateTrunk() {
  try {
    await connectMetaMask();
  } catch (error) {
    window.location.href = "generate.html";
  }

  document.querySelector('#generate-in-progress').style = "display:block";
  document.querySelector('#generate-done').style = "display:none";

  regenerateRandomInt();

  let url = `https://service.cryptotrunks.co/metadata.json?address=${wallet}&seed=${currentSeed}`
  let result = await (await fetch(url)).json();

  isBasic = (result.tree.includes("Sapling") && result.backgrounds.includes("Noon"));

  document.querySelector('#generate-info').innerHTML = formattedResult(result);
  document.querySelector('#generate-trunk-image').src = result.image;

  document.querySelector('#generate-in-progress').style = "display:none";
  document.querySelector('#generate-done').style = "display:block";
}

async function claimTrunk() {
  // Loading
  if (isLoading) {
    return false;
  }

  // Disable button
  generateButtonBackground = document.querySelector('#generate-confirm').style["background-image"];
  generateButtonText = document.querySelector('#generate-confirm-text').innerHTML;
  document.querySelector('#generate-confirm').style["background-image"] = "url('../images/button_mask.svg'), url('../images/button_background_disabled.svg')";
  document.querySelector('#generate-confirm-text').innerHTML = "CONNECTING...";
  document.querySelector('#loading-text').innerHTML = "CONNECTING...";
  document.querySelector('#loading-modal').style = "display:flex";
  isLoading = true;

  // Fetch fee (enforced by contract).
  var fee = 0;
  if (isBasic) {
    let baseFee = await getBaseFeeTier();
    fee = web3.utils.toWei(baseFee);
  } else {
    let url = `https://service.cryptotrunks.co/fee.json?address=${wallet}`
    let result = await (await fetch(url)).json();
    fee = web3.utils.toWei(String(result.result));
  }

  console.log(fee);

  // Listener.
  contract.events.RemoteMintFulfilled({}, function(error, result) {
    if (!error) {
      let resultId = result.returnValues.resultId;
      console.log("Minted: " + resultId);
      window.location.href = `individual-trunk-page.html?token=${resultId}`;
    } else {
      console.log("Mint error: " + error.message);
    }
  });

  // Minting.
  let mint = await contract.methods.mintTrunk(currentSeed, isBasic)
    .send({ from: wallet, value: fee })
    .then(function(result) {
      let trunk = result.events.Transfer.returnValues.tokenId;
      document.querySelector('#loading-text').innerHTML = `GROWING TRUNK #${trunk}...`;
    })
    .catch(error => {
      document.querySelector('#generate-confirm').style["background-image"] = generateButtonBackground;
      document.querySelector('#generate-confirm-text').innerHTML = generateButtonText;
      document.querySelector('#loading-modal').style = "display:none";
      isLoading = false;
    });
}

document.onload = generateTrunk();
document.querySelector('#generate-reroll').addEventListener('click', generateTrunk);
document.querySelector('#generate-confirm').addEventListener('click', claimTrunk);
