import { connectMetaMask, contract, wallet, formattedResult } from './common.js';

function start() {
  connectMetaMask();
  loadWalletTrunks();
}

async function loadWalletTrunks() {
  var tokens = 0;

  await contract.methods.balanceOf(wallet).call()
  .then(function(_tokens) {
    tokens = _tokens;
    let trunks = (tokens == 1 ? "trunk" : "trunks");
    document.querySelector('#token-count').innerHTML = `You own <strong id="token-count">${tokens}</strong> ${trunks}.<br>`;
  });

  // Iterate tokens from contract and render.
  if (tokens == 0) {
    document.querySelector('#wallet-grid').innerHTML = `<div class="text_block">
      <a href="generate-in-progress.html" class="button_two w-inline-block">
        <div class="button_text">GET SOME TRUNKS</div>
      </a>
    </div>`;
  } else {
    let header = '<div class="wallet_grid">';
    let footer = '</div>';

    var grid = "";
    for (let i = 0; i < tokens; i++) {
      let token = await contract.methods.tokenOfOwnerByIndex(wallet, i).call();
      let url = await contract.methods.tokenURI(token).call();
      let metadata = await (await fetch(url)).json();

      grid = grid.concat(`
        <a href="individual-trunk-page.html?token=${metadata.id}" class="gallery_item w-inline-block">
          <img src="${metadata.image}" loading="lazy" alt="Image of a pixel art tree on a forested background." class="wallet_item_image">
          <div class="text_block wallet_info" style="min-width: 0px">
            <div class="info_text big">TRUNK #${metadata.number}<br></div>
            <div class="info_text">${formattedResult(metadata)}</div>
          </div>
        </a>`);

        document.querySelector('#wallet-grid').innerHTML = `${header}${grid}${footer}`;
    }
  }
}

document.onload = start();
