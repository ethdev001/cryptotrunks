import { contract, wallet } from './common.js';

async function updateProgress() {
  var supply = parseInt(await contract.methods.getGenerativeSupply().call());
  var minted = parseInt(await contract.methods.getGenerativeMinted().call());
  let generative = minted.toLocaleString().concat(" / ").concat(supply.toLocaleString());
  document.querySelector('#progress-generative').innerHTML = generative.concat(" CLAIMED");

  supply = parseInt(await contract.methods.getGenesisSupply().call());
  minted = parseInt(await contract.methods.getGenesisMinted().call());
  let genesis = minted.toLocaleString().concat(" / ").concat(supply.toLocaleString());
  document.querySelector('#progress-genesis').innerHTML = genesis.concat(" CLAIMED");
}

document.onload = updateProgress();
