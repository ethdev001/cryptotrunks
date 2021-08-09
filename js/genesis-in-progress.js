import { web3, contract } from './common.js';

async function claimGenesisTrunk() {
  document.querySelector('#loading-text').innerHTML = "TRANSACTING WITH CRYPTOTRUNKS CONTRACT...";
  document.querySelector('#loading-modal').style = "display:flex";

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

  let accounts = await web3.eth.getAccounts();
  let wallet = ethereum.selectedAddress || accounts[0];

  // Network
  let network = await web3.eth.net.getId()
  if (network != 1) {
    alert("Hey! CryptoTrunks are only supported on the Ethereum network. It looks like you’re connected to a different network. Please check your settings and try again.");
    return;
  }

  let fee = web3.utils.toWei(String(numberToMint * 0.5));
  let mint = await contract.methods.mintGenesisTrunk(numberToMint)
    .send({ from: wallet, value: fee })
    .then(function(result) {
        window.location.href = "wallet.html";
    })
    .catch (function (error){
      window.location.href = "genesis.html";
  });
}

document.onload = claimGenesisTrunk();
