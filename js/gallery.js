import { contract, wallet } from './common.js';

async function updateTokenSupply() {
  let generative = parseInt(await contract.methods.getGenerativeMinted().call());
  let genesis = parseInt(await contract.methods.getGenesisMinted().call());
  let minted = generative + genesis;
  let trunks = (minted == 1 ? "trunk has" : "trunks have");

  document.querySelector('#gallery-stats').innerHTML = `
    Right now <strong>${minted.toLocaleString()}</strong> ${trunks} been claimed.<br>
    There are only <strong>${(21000 - minted).toLocaleString()}</strong> trunks remaining!<br>
  `
}

document.onload = updateTokenSupply();
