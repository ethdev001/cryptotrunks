import { contract, wallet } from './common.js';

async function updateTotals() {
  let minted = parseInt(await contract.methods.getGenesisMinted().call());
  let supply = 15;

  let trunks = (minted == 1 ? "trunk has" : "trunks have");
  let stats = `Right now <strong>${minted.toLocaleString()}</strong> genesis ${trunks} been claimed. There are only <strong>${(supply - minted).toLocaleString()}</strong> genesis trunks remaining!<br>`

  document.querySelector('#genesis-stats').innerHTML = stats;
}

async function ape() {
  let number = document.querySelector('#genesis-ape-number').value;
  if (number >= 1 && number <= 20) {
    window.location.href = `genesis-in-progress.html?buy=${number}`;
  } else {
    document.querySelector('#genesis-ape-number').value = "";
  }
}

document.onload = updateTotals();
document.querySelector('#genesis-ape').addEventListener('click', ape);
