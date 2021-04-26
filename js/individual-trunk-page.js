import { wallet } from './common.js';

async function fetchTrunk() {
  var queryDict = {};
  location.search.substr(1).split("&").forEach(function(item) {
    queryDict[item.split("=")[0]] = item.split("=")[1]
  });

  let url = `https://service.cryptotrunks.co/token/${queryDict.token}.json`
  let result = await (await fetch(url)).json();

  var formatted = ""
  result.elements.forEach(element => formatted = formatted.concat(`+ ${element}<br>`));
  let info = `<strong>[Generative]</strong><br><br>${result.tree}<br><br>${result.backgrounds.join(", ")}<br><br>${formatted}<br>`;
  document.querySelector('#individual-trunk-number').innerHTML = `TRUNK #${result.number}`;
  document.querySelector('#individual-trunk-info').innerHTML = info;
  document.querySelector('#individual-trunk-image').src = result.image;
}

document.onload = fetchTrunk()
