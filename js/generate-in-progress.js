import { wallet } from './common.js';

function getRandomInt() {
    let min = 1;
    let max = 1e9;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateTrunk() {
  document.querySelector('#generate-in-progress').style = "display:block";
  document.querySelector('#generate-done').style = "display:none";

  let seed = getRandomInt();
  let url = `https://service.cryptotrunks.co/metadata.json?address=${wallet}&seed=${seed}`
  let result = await (await fetch(url)).json();

  var formatted = ""
  result.elements.forEach(element => formatted = formatted.concat(`+ ${element}<br>`));
  let info = `<strong>[Generative]</strong><br><br>${result.tree}<br><br>${result.backgrounds.join(", ")}<br><br>${formatted}<br>`
  document.querySelector('#generate-info').innerHTML = info;
  document.querySelector('#generate-trunk-image').src = result.image;

  document.querySelector('#generate-in-progress').style = "display:none";
  document.querySelector('#generate-done').style = "display:block";
}

document.onload = generateTrunk()
document.querySelector('#generate-reroll').addEventListener('click', generateTrunk);
