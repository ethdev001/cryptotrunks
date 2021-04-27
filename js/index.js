import { contract, wallet } from './common.js';

async function updateProgress() {
  let supply = parseInt(await contract.methods.getGenerativeSupply().call());
  let minted = parseInt(await contract.methods.getGenerativeMinted().call());
  let generative = minted.toLocaleString().concat(" / ").concat(supply.toLocaleString());
  document.querySelector('#progress-generative').innerHTML = generative.concat(" CLAIMED");
}

document.onload = updateProgress();
