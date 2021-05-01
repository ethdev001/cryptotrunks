import { contract, wallet } from './common.js';

async function updateTotals() {
  let minted = parseInt(await contract.methods.getGenesisMinted().call());
  let supply = parseInt(await contract.methods.getGenesisSupply().call());
  document.querySelector('#genesis-claimed').innerHTML = minted.toLocaleString();
  document.querySelector('#genesis-remaining').innerHTML = (supply - minted).toLocaleString();
}

document.onload = updateTotals();
