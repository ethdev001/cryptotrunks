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
  console.log(seed);
}

async function getGenerativeSupply() {
  let generative = await contract.methods.getGenerativeSupply().call();
  let minted = await contract.methods.getGenerativeMinted().call();
  console.log(minted + " / " + generative);
}

async function getGenesisSupply() {
  let generative = await contract.methods.getGenesisSupply().call();
  let minted = await contract.methods.getGenesisMinted().call();
  console.log(minted + " / " + generative);
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

document.querySelector('#connect').addEventListener('click', connect);
document.querySelector('#withdraw').addEventListener('click', withdraw);
document.querySelector('#withdrawLink').addEventListener('click', withdrawLink);
document.querySelector('#fetchGenesisSeedFromVRF').addEventListener('click', fetchGenesisSeedFromVRF);
document.querySelector('#readGenesisRandomSeed').addEventListener('click', readGenesisRandomSeed);
document.querySelector('#getGenerativeSupply').addEventListener('click', getGenerativeSupply);
document.querySelector('#mintGenesisTrunk').addEventListener('click', mintGenesisTrunk);
document.querySelector('#mintMultipleGenesisTrunks').addEventListener('click', mintMultipleGenesisTrunks);
document.querySelector('#getGenesisSupply').addEventListener('click', getGenesisSupply);
