import { address } from './contract.js';
import { web3, wallet, contract } from './common.js';

async function withdraw() {
  await contract.methods.withdraw().send({ from: wallet });
}

async function withdrawLink() {
  await contract.methods.withdrawLink().send({ from: wallet });
}

async function fetchGenesisSeedFromVRF() {
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

async function mintFreeGenerativeTrunk() {
  await mintGenerativeTrunk("0");
}

async function mintBaseGenerativeTrunk() {
  await mintGenerativeTrunk("0.05");
}

async function mintGenerativeTrunk(feeStr) {
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
  let mint = await contract.methods.mintTrunk(1, false) // Fixed "random" seed
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
  return balance;
}

async function readTokens() {
  let balance = await readTokenBalance();
  for (let i = 0; i < balance; i++) {
    let token = await contract.methods.tokenOfOwnerByIndex(wallet, i).call();
    let uri = await contract.methods.tokenURI(token).call();
    console.log("Token: " + token);
    console.log("Token URI: " + uri);
  }
}

async function getPauseStatus() {
  let status = await contract.methods.paused().call();
  console.log("Paused: " + status);
}

async function pause() {
  await contract.methods.pause().send({ from: wallet });
}

async function unpause() {
  await contract.methods.unpause().send({ from: wallet });
}

async function getOracle() {
  let oracle = await contract.methods.getOracle().call();
  console.log("Oracle address: " + oracle[0]);
  console.log("Job ID: " + oracle[1]);
  console.log("Fee: " + oracle[2]);
  document.oracle = oracle;
}

async function updateOracle() {
  await contract.methods.updateOracle(
    '0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b',
    "0xc7dd72ca14b44f0c9b6cfcd4b7ec0a2c",
    String(0.1 * 10 ** 18)
  )
    .send({ from: wallet })
    .catch(error => {
      console.log("Oracle update error: " + error.message);
      document.merror = error;
    });
    console.log("Done");
}

function start() {
  document.querySelector('#etherscan').href = `https://etherscan.io/address/${address}`
}

document.onload = start();

// MetaMask
document.querySelector('#connect').addEventListener('click', connect);

// Withdraw
document.querySelector('#withdraw').addEventListener('click', withdraw);
document.querySelector('#withdrawLink').addEventListener('click', withdrawLink);

// Pausing.
document.querySelector('#pause').addEventListener('click', pause);
document.querySelector('#unpause').addEventListener('click', unpause);
document.querySelector('#getPauseStatus').addEventListener('click', getPauseStatus);

// Genesis
document.querySelector('#fetchGenesisSeedFromVRF').addEventListener('click', fetchGenesisSeedFromVRF);
document.querySelector('#readGenesisRandomSeed').addEventListener('click', readGenesisRandomSeed);
document.querySelector('#mintGenesisTrunk').addEventListener('click', mintGenesisTrunk);
document.querySelector('#mintMultipleGenesisTrunks').addEventListener('click', mintMultipleGenesisTrunks);
document.querySelector('#getGenesisSupply').addEventListener('click', getGenesisSupply);

// Generative
document.querySelector('#getGenerativeSupply').addEventListener('click', getGenerativeSupply);
document.querySelector('#mintFreeGenerativeTrunk').addEventListener('click', mintFreeGenerativeTrunk);
document.querySelector('#mintBaseGenerativeTrunk').addEventListener('click', mintBaseGenerativeTrunk);
document.querySelector('#fetchGenerativeFee').addEventListener('click', fetchGenerativeFee);

// Utils
document.querySelector('#readTokenBalance').addEventListener('click', readTokenBalance);
document.querySelector('#readTokens').addEventListener('click', readTokens);
document.querySelector('#getOracle').addEventListener('click', getOracle);
document.querySelector('#updateOracle').addEventListener('click', updateOracle);
