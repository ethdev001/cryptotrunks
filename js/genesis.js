import { contract, wallet } from './common.js';

async function updateTotals() {
  let minted = parseInt(await contract.methods.getGenesisMinted().call());
  let supply = parseInt(await contract.methods.getGenesisSupply().call());

  let trunks = (minted == 1 ? "trunk has" : "trunks have");
  let stats = `Right now <strong>${minted.toLocaleString()}</strong> genesis ${trunks} been claimed. There are only <strong>${(supply - minted).toLocaleString()}</strong> genesis trunks remaining!<br>`

  document.querySelector('#genesis-stats').innerHTML = stats;
}

document.onload = updateTotals();
