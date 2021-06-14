import { contract, reforestation } from './common.js';

async function updateProgress() {
  // Generative progress
  var supply = 19500 + 2500;
  var minted = 19500 + parseInt(await reforestation.methods.getGenerativeMinted().call());
  let generative = minted.toLocaleString().concat(" / ").concat(supply.toLocaleString());
  document.querySelector('#progress-generative').innerHTML = generative.concat(" CLAIMED");
  var progress = parseInt((parseFloat(minted) / parseFloat(supply)) * 100);
  document.querySelector('#progress-bar-generative').style = `background-size: contain, contain, ${progress}% 90%, contain;`;

  // Disable button
  if (minted >= supply) {
    document.querySelector('#generate-buy').href = "#";
    document.querySelector('#generate-buy').style["background-image"] = "url('../images/button_mask.svg'), url('../images/button_background_disabled.svg')";
    document.querySelector('#generate-buy-text').innerHTML = "GENERATIVE SOLD OUT";
  }

  // Genesis progress
  supply = 1500;
  minted = parseInt(await contract.methods.getGenesisMinted().call());
  let genesis = minted.toLocaleString().concat(" / ").concat(supply.toLocaleString());
  document.querySelector('#progress-genesis').innerHTML = genesis.concat(" CLAIMED");
  var progress = parseInt((parseFloat(minted) / parseFloat(supply)) * 100);
  document.querySelector('#progress-bar-genesis').style = `background-size: contain, contain, ${progress}% 90%, contain;`;

  // Disable button
  if (minted >= supply) {
    document.querySelector('#genesis-buy').href = "#";
    document.querySelector('#genesis-buy').style["background-image"] = "url('../images/button_mask.svg'), url('../images/button_background_disabled.svg')";
    document.querySelector('#genesis-buy-text').innerHTML = "GENESIS SOLD OUT";
    document.querySelector('#genesis-ape').style["display"] = "none";
  }
}

async function toGenesis() {
  let number = parseInt(document.querySelector('#genesis-ape-number').value);
  if (number != NaN && number >= 1 && number <= 20) {
    ape();
  } else {
    window.location.href = "genesis-in-progress.html";
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

document.onload = updateProgress();
document.querySelector('#genesis-buy').addEventListener('click', toGenesis);
document.querySelector('#genesis-ape').addEventListener('click', ape);
