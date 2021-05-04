import { wallet, formattedResult } from './common.js';

async function fetchTrunk() {
  var queryDict = {};
  location.search.substr(1).split("&").forEach(function(item) {
    queryDict[item.split("=")[0]] = item.split("=")[1]
  });

  let url = `https://service.cryptotrunks.co/token/${queryDict.token}.json`
  let result = await (await fetch(url)).json();

  if (result.error == "") {
    document.querySelector('#individual-trunk-number').innerHTML = `TRUNK #${result.number}`;
    document.querySelector('#individual-trunk-info').innerHTML = formattedResult(result);
    document.querySelector('#individual-trunk-image').src = result.image;
  } else {
    document.querySelector('#individual-trunk-number').innerHTML = `TRUNK NOT FOUND`;
  }
}

document.onload = fetchTrunk()
