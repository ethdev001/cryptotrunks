import { contract, wallet } from './common.js';

async function updateProgress() {
  let supply = await contract.methods.getMaxSupply().call();
  let remaining = await contract.methods.getRemainingSupply().call();

  let generative = (supply - remaining).toLocaleString().concat(" / ").concat(remaining.toLocaleString());
  document.querySelector('#progress-generative').innerHTML = generative.concat(" CLAIMED");
}

document.onload = updateProgress();
