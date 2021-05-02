import { address } from './contract.js';
import { web3, wallet, contract } from './common.js';

async function withdraw() {
  await contract.methods.withdraw().send({ from: wallet });
}

async function withdrawLink() {
  await contract.methods.withdrawLink().send({ from: wallet });
}

async function fetchGenesisSeedFromVRF() {
  // await contract.methods.fetchGenesisSeedFromVRF().send({ from: wallet });
  // await contract.methods.fetchGenesisSeedFromVRF().call();
  contract.methods.fetchGenesisSeedFromVRF().send({ from: wallet });
}

async function readGenesisRandomSeed() {
  // let seed = await contract.methods.getGenesisRandomSeed().send({ from: wallet });
  let seed = await contract.methods.getGenesisRandomSeed().call();
  console.log("Random seed: " + seed);
}

async function getGenerativeSupply() {
  let generative = await contract.methods.getGenerativeSupply().call();
  let minted = await contract.methods.getGenerativeMinted().call();
  console.log("Generative supply: " + minted + " / " + generative);
}

async function fetchGenerativeFee() {
  // Fetch fee (enforced by contract).
  let url = `https://service.cryptotrunks.co/fee.json?address=${wallet}`
  let result = await (await fetch(url)).json();
  console.log("Calculated fee: " + result.result + " eth");
}

async function mintGenerativeTrunk() {
  let feeStr = "0.002";
  let fee = web3.utils.toWei(feeStr);
  console.log("Mint fee: " + feeStr + " eth");

  // Listener.
  contract.events.RemoteMintFulfilled({}, function(error, result) {
    if (!error) {
      if (result.returnValues.tokenId == tokenId) {
        let resultId = result.returnValues.resultId;
        console.log("Minted: " + resultId);
      } else {
        console.log("Result: " + result);
      }
    } else {
      console.log("Listener mint error: " + error.message);
      document.lmerror = error;
    }
  });

  // Minting.
  let mint = await contract.methods.mintTrunk(1)
    .send({ from: wallet, value: fee })
    .catch(error => {
      console.log("Mint error: " + error.message);
      document.merror = error;
    });
  let tokenId = mint.events.Transfer.returnValues.tokenId;
  console.log("Token ID: " + tokenId);
}

async function getGenesisSupply() {
  let generative = await contract.methods.getGenesisSupply().call();
  let minted = await contract.methods.getGenesisMinted().call();
  console.log("Genesis supply: " + minted + " / " + generative);
}

async function mintGenesisTrunk() {
  let fee = web3.utils.toWei("0.5");
  let mint = await contract.methods.mintGenesisTrunk(1).send({ from: wallet, value: fee });
  let tokenId = mint.events.Transfer.returnValues.tokenId;
  console.log("Token ID: " + tokenId);
}

async function mintMultipleGenesisTrunks() {
  let fee = web3.utils.toWei("1.5");
  let mint = await contract.methods.mintGenesisTrunk(3).send({ from: wallet, value: fee });
  document.mint = mint;
  mint.events.Transfer.forEach(element => console.log("Token ID: " + element.returnValues.tokenId));
}

async function readTokenBalance() {
  let balance = await contract.methods.balanceOf(wallet).call();
  console.log("Token balance: " + balance);
}

function start() {
  document.querySelector('#etherscan').href = `https://kovan.etherscan.io/address/${address}`
}

document.onload = start();

// MetaMask
document.querySelector('#connect').addEventListener('click', connect);

// Withdraw
document.querySelector('#withdraw').addEventListener('click', withdraw);
document.querySelector('#withdrawLink').addEventListener('click', withdrawLink);

// Genesis
document.querySelector('#fetchGenesisSeedFromVRF').addEventListener('click', fetchGenesisSeedFromVRF);
document.querySelector('#readGenesisRandomSeed').addEventListener('click', readGenesisRandomSeed);
document.querySelector('#mintGenesisTrunk').addEventListener('click', mintGenesisTrunk);
document.querySelector('#mintMultipleGenesisTrunks').addEventListener('click', mintMultipleGenesisTrunks);
document.querySelector('#getGenesisSupply').addEventListener('click', getGenesisSupply);

// Generative
document.querySelector('#getGenerativeSupply').addEventListener('click', getGenerativeSupply);
document.querySelector('#mintGenerativeTrunk').addEventListener('click', mintGenerativeTrunk);
document.querySelector('#fetchGenerativeFee').addEventListener('click', fetchGenerativeFee);

// Utils
document.querySelector('#readTokenBalance').addEventListener('click', readTokenBalance);
