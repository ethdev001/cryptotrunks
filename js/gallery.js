import { contract, reforestation } from './common.js';

var grid = "";
var offset = 1500;

async function updateTokenSupply() {
  var queryDict = {};
  location.search.substr(1).split("&").forEach(function(item) {
    queryDict[item.split("=")[0]] = item.split("=")[1]
  });

  try {
    let generative = parseInt(await contract.methods.getGenerativeMinted().call());
    let genesis = parseInt(await contract.methods.getGenesisMinted().call());
    let reforested = parseInt(await reforestation.methods.getGenerativeMinted().call());
    let minted = generative + genesis + reforested;
    let trunks = (minted == 1 ? "trunk has" : "trunks have");

    document.querySelector('#gallery-stats').innerHTML = `
      Right now <strong>${minted.toLocaleString()}</strong> ${trunks} been claimed.<br>
      There are only <strong>${(23500 - minted).toLocaleString()}</strong> trunks remaining!<br><br>
      Genesis trunks are not currently shown and will be added after they have sold out.
      Not all trunks are currently displayed. We're working on it!<br><br>
      If the generative sale is still ongoing, searching for a trunk number that has not yet been minted may show a trunk that does not exist.`.replaceAll("\u2028", "");
  } catch (error) {
    document.querySelector('#gallery-stats').innerHTML = "";
  }

  getMoreTrunks();
}

async function getMoreTrunks() {
  let url = `https://service.cryptotrunks.co/gallery.json?offset=${offset}`
  let result = (await (await fetch(url)).json()).result;

  for (let i = 0; i < result.length; i++) {
    let metadata = result[i];
    if (metadata.error == undefined) {
      grid = grid.concat(`
        <a href="individual-trunk-page?token=${metadata.id}" class="gallery_item w-inline-block">
          <div class="gallery_item_number">#${metadata.number}</div>
          <img src="${metadata.image}" loading="lazy" alt="Image of a pixel art tree on a forested background." class="gallery_item_image">
        </a>`);
      document.querySelector('#gallery-grid').innerHTML = grid;
    }
  }

  // Last page, hide.
  if (result.length < 30) {
    document.querySelector('#gallery-view-more').style = "display:none";
  }
}

async function viewMore() {
  offset += 30;
  await getMoreTrunks();
}

async function getTrunk() {
  let number = document.querySelector('#gallery-trunk-number').value;
  if (number >= 1501 && number <= 23500) {
    window.location.href = `individual-trunk-page.html?token=${number}`;
  } else {
    document.querySelector('#gallery-trunk-number').value = "";
  }
}

document.onload = updateTokenSupply();
document.querySelector('#gallery-view-more').addEventListener('click', viewMore);
document.querySelector('#gallery-submit').addEventListener('click', getTrunk);
