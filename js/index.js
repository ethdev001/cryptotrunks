import { contract, wallet } from './common.js';

async function updateProgress() {
  var supply = 19500;
  var minted = parseInt(await contract.methods.getGenerativeMinted().call());
  let generative = minted.toLocaleString().concat(" / ").concat(supply.toLocaleString());
  document.querySelector('#progress-generative').innerHTML = generative.concat(" CLAIMED");

  supply = 1500;
  minted = parseInt(await contract.methods.getGenesisMinted().call());
  let genesis = minted.toLocaleString().concat(" / ").concat(supply.toLocaleString());
  document.querySelector('#progress-genesis').innerHTML = genesis.concat(" CLAIMED");
}

document.onload = updateProgress();
