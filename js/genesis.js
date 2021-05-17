import { contract, wallet } from './common.js';

async function updateTotals() {
  let minted = parseInt(await contract.methods.getGenesisMinted().call());
  let supply = 1500;

  let trunks = (minted == 1 ? "trunk has" : "trunks have");
  let stats = `Right now <strong>${minted.toLocaleString()}</strong> genesis ${trunks} been claimed. There are only <strong>${(supply - minted).toLocaleString()}</strong> genesis trunks remaining!<br>`.replaceAll("\u2028", "");

  document.querySelector('#genesis-stats').innerHTML = stats;

  // Disable button
  if (minted >= supply) {
    document.querySelector('#genesis-buy').href = "#";
    document.querySelector('#genesis-buy').style["background-image"] = "url('../images/button_mask.svg'), url('../images/button_background_disabled.svg')";
    document.querySelector('#genesis-buy-text').innerHTML = "GENESIS SOLD OUT";
    document.querySelector('#genesis-buy-text').style["font-size"] = "22px";
    document.querySelector('#genesis-ape').style["display"] = "none";
  }
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
