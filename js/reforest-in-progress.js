import { web3, reforestation, formattedResult, connectMetaMask } from './common.js';

var currentSeed;
var tokenId;
var baseFee;

var isLoading = false;
var isPaused = false;

var generateButtonBackground;
var generateButtonText;

function randomInt() {
  let min = 1;
  let max = 1e9;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getBaseFeeTier() {
  let accounts = await web3.eth.getAccounts();
  let wallet = ethereum.selectedAddress || accounts[0];
  let count = await reforestation.methods.balanceOf(wallet).call()

  // Base case (first mint).
  if (count == 0) {
    return "0";
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
    window.location.href = "generate";
  }

  document.querySelector('#generate-in-progress').style = "display:block";
  document.querySelector('#generate-done').style = "display:none";
  document.querySelector('#generate-reroll').href = `reforest-in-progress?seed=${randomInt()}`;

  var queryDict = {};
  location.search.substr(1).split("&").forEach(function(item) {
    queryDict[item.split("=")[0]] = item.split("=")[1]
  });

  currentSeed = parseInt(queryDict.seed);
  if (isNaN(currentSeed)) {
    currentSeed = randomInt();
    window.location.href = `reforest-in-progress?seed=${currentSeed}`;
    return;
  }

  let accounts = await web3.eth.getAccounts();
  let wallet = ethereum.selectedAddress || accounts[0];
  let url = `https://service.cryptotrunks.co/metadata.json?address=${wallet}&seed=${currentSeed}`
  let result = await (await fetch(url)).json();

  document.querySelector('#generate-info').innerHTML = formattedResult(result);
  document.querySelector('#generate-trunk-image').src = result.image;

  document.querySelector('#generate-in-progress').style = "display:none";
  document.querySelector('#generate-done').style = "display:block";

  baseFee = await getBaseFeeTier();
  isPaused = (await reforestation.methods.paused().call()) && (baseFee == "0");
  if (isPaused) {
    document.querySelector('#generate-paused').style = "display:block";
    disableButton("PAUSED");
  }
}

function disableButton(title) {
  generateButtonBackground = document.querySelector('#generate-confirm').style["background-image"];
  generateButtonText = document.querySelector('#generate-confirm-text').innerHTML;
  document.querySelector('#generate-confirm').style["background-image"] = "url('../images/button_mask.svg'), url('../images/button_background_disabled.svg')";
  document.querySelector('#generate-confirm-text').innerHTML = title;
}

function enableButton() {
  document.querySelector('#generate-confirm').style["background-image"] = generateButtonBackground;
  document.querySelector('#generate-confirm-text').innerHTML = generateButtonText;
}

async function claimTrunk() {
  // Loading
  if (isLoading) {
    return false;
  }

  // Paused.
  if (isPaused) {
    return false;
  }

  // Wallet
  let accounts = await web3.eth.getAccounts();
  let wallet = ethereum.selectedAddress || accounts[0];

  // Disable button
  disableButton("CONNECTING...");
  document.querySelector('#loading-text').innerHTML = "TRANSACTING WITH CRYPTOTRUNKS CONTRACT...";
  document.querySelector('#loading-modal').style = "display:flex";
  isLoading = true;

  // Fetch fee (enforced by contract).
  let url = `https://service.cryptotrunks.co/fee.json?address=${wallet}`
  let result = await (await fetch(url)).json();
  let fee = web3.utils.toWei(String(result.result));

  // Listener.
  var transferBlockHash = "";
  var chainlinkRequestId = "";
  var trunk = undefined;

  reforestation.events.allEvents({}, function(error, event) {
    let eventName = event.event;

    // Gate block hash on transfer matching sender address.
    if (eventName == "Transfer" && event.returnValues.to.toLowerCase() == wallet.toLowerCase()) {
      transferBlockHash = event.blockHash;
      trunk = event.returnValues.tokenId + 21000;
      document.querySelector('#loading-text').innerHTML = `GROWING TRUNK #${trunk}...`;
    }

    // Gate Chainlink id on block hash matching Transfer.
    if (eventName == "ChainlinkRequested" && transferBlockHash.length > 0 && event.blockHash == transferBlockHash) {
      chainlinkRequestId = event.returnValues.id;
      document.querySelector('#loading-text').innerHTML = `CONNECTING TRUNK #${trunk} TO ORACLE...`;
    }

    // Gate Chainlink fulfill on matching Chainlink id.
     if (eventName == "ChainlinkFulfilled" && chainlinkRequestId.length > 0 && event.returnValues.id == chainlinkRequestId) {
      document.querySelector('#loading-text').innerHTML = `UPDATING TRUNK #${trunk} FROM ORACLE...`;
    }

    // Gate event request id on matching Chainlink id.
    if (eventName == "RemoteMintFulfilled" && chainlinkRequestId.length > 0 && event.returnValues.requestId == chainlinkRequestId) {
      let resultId = event.returnValues.resultId;
      window.location.href = `individual-trunk-page?token=${trunk}`;
    }
  });

  // Minting.
  let mint = await reforestation.methods.mintTrunk(currentSeed)
    .send({ from: wallet, value: fee })
    .then(function(result) {
      let trunk = result.events.Transfer.returnValues.tokenId;
      document.querySelector('#loading-text').innerHTML = `GROWING TRUNK #${trunk}...`;
    })
    .catch(error => {
      enableButton();
      document.querySelector('#loading-modal').style = "display:none";
      isLoading = false;
    });
}

document.onload = generateTrunk();
document.querySelector('#generate-confirm').addEventListener('click', claimTrunk);
