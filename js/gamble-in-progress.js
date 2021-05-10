import { web3, wallet, contract } from './common.js';

async function ape() {
  contract.events.RemoteMintTwentyFulfilled({}, function(error, result) {
    if (!error) {
      let resultId = result.returnValues.resultId;
      console.log("Minted: " + resultId);
      document.result = result;
      window.location.href = `wallet.html`;
    } else {
      console.log("Mint error: " + error.message);
    }
  });

  let fee = web3.utils.toWei("1");
  let mint = await contract.methods.mintTwentyTrunks().send({ from: wallet, value: fee }).catch (function (error){
      window.location.href = "generate.html";
  });

  // window.location.href = "wallet.html";
}

document.onload = ape();
