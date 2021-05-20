import { web3, wallet, contract } from './common.js';

async function ape() {
  document.querySelector('#loading-text').innerHTML = "CONNECTING...";
  document.querySelector('#loading-modal').style = "display:flex";

  contract.events.RemoteMintTwentyFulfilled({}, function(error, result) {
    if (!error) {
      let resultId = result.returnValues.resultId;
      window.location.href = `wallet.html`;
    }
  });

  let fee = web3.utils.toWei("1");
  let mint = await contract.methods.mintTwentyTrunks()
    .send({ from: wallet, value: fee })
    .then(function(result) {
      document.querySelector('#loading-text').innerHTML = `GROWING TRUNKS...`;
    })
    .catch (function (error){
      window.location.href = "generate.html";
  });
}

document.onload = ape();
