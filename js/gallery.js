import { contract, wallet } from './common.js';

async function updateTokenSupply() {
  let supply = await contract.methods.getMaxSupply().call();
  let remaining = await contract.methods.getRemainingSupply().call();
  document.querySelector('#token-supply').innerHTML = (supply - remaining).toLocaleString();
  document.querySelector('#token-remaining').innerHTML = remaining.toLocaleString();
}

document.onload = updateTokenSupply();
