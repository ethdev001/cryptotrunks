import { wallet, contract } from './common.js';

var currentSeed;
var tokenId;

function regenerateRandomInt() {
    let min = 1;
    let max = 1e9;
    currentSeed = Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateTrunk() {
  document.querySelector('#generate-in-progress').style = "display:block";
  document.querySelector('#generate-done').style = "display:none";

  regenerateRandomInt();

  let url = `https://service.cryptotrunks.co/metadata.json?address=${wallet}&seed=${currentSeed}`
  let result = await (await fetch(url)).json();

  var formatted = ""
  result.elements.forEach(element => formatted = formatted.concat(`+ ${element}<br>`));
  let info = `<strong>[Generative]</strong><br><br>${result.tree}<br><br>${result.backgrounds.join(", ")}<br><br>${formatted}<br>`
  document.querySelector('#generate-info').innerHTML = info;
  document.querySelector('#generate-trunk-image').src = result.image;

  document.querySelector('#generate-in-progress').style = "display:none";
  document.querySelector('#generate-done').style = "display:block";
}

async function claimTrunk() {
  tokenId = await contract.methods.mintTrunk(currentSeed).send(
    { from: wallet, value: web3.utils.toWei("0.002") },
    function(error, transactionHash) {
      if (error) {
        console.log(error);
      } else {
        console.log(transactionHash);
      }
    }
  );
}

function contractEventListener() {
  contract.events.RemoteMintComplete({ filter: { tokenId: tokenId } }, function(error, event) {
    if (error) {
      console.log(error);
    } else {
      console.log(event);
    }
  });
}

document.onload = generateTrunk();
document.querySelector('#generate-reroll').addEventListener('click', generateTrunk);
document.querySelector('#generate-confirm').addEventListener('click', claimTrunk);
