import { address } from './contract.js';
import { formattedResult } from './common.js';

async function fetchTrunk() {
  var queryDict = {};
  location.search.substr(1).split("&").forEach(function(item) {
    queryDict[item.split("=")[0]] = item.split("=")[1]
  });

  let url = `https://service.cryptotrunks.co/token/${queryDict.token}`
  let result = await (await fetch(url)).json();

  var number = result.number;
  if (result.error == undefined) {
    var title = "YOUR TRUNK";
    if (number != undefined) {
      title = `TRUNK #${result.number}`;
    } else {
      number = queryDict.token;
    }
    document.querySelector('#individual-trunk-number').innerHTML = title;
    document.querySelector('#individual-trunk-info').innerHTML = formattedResult(result);
    document.querySelector('#individual-trunk-image').src = result.image;
    document.querySelector('#opensea-link').href = `https://opensea.io/assets/${address}/${number}`;
  } else {
    document.querySelector('#individual-trunk-number').innerHTML = `TRUNK NOT FOUND`;
  }
}

document.onload = fetchTrunk()
