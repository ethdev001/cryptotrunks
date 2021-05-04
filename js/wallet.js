import { connectMetaMask, contract, wallet, formattedResult } from './common.js';

function start() {
  connectMetaMask();
  loadWalletTrunks();
}



async function loadWalletTrunks() {
  var tokens = 0;

  contract.methods.balanceOf(wallet).call()
  .then(function(_tokens) {
    tokens = _tokens;
    let trunks = (tokens == 1 ? "trunk" : "trunks");
    document.querySelector('#token-count').innerHTML = `You own <strong id="token-count">${tokens}</strong> ${trunks}.<br>`;
  });

  let url = `https://service.cryptotrunks.co/wallet.json?address=${wallet}`
  let result = await (await fetch(url)).json();

  var grid = "";

  if (tokens == 0) {
    grid = `<div class="text_block">
      <a href="generate-in-progress.html" class="button_two w-inline-block">
        <div class="button_text">GET SOME TRUNKS</div>
      </a>
    </div>`;
  } else {
    grid = grid.concat('<div class="wallet_grid">');
    for (const metadata of result.result) {
      grid = grid.concat(`
        <a href="individual-trunk-page.html?token=${metadata.id}" class="gallery_item w-inline-block">
          <img src="${metadata.image}" loading="lazy" alt="Image of a pixel art tree on a forested background." class="wallet_item_image">
          <div class="text_block wallet_info">
            <div class="info_text big">TRUNK #${metadata.number}<br></div>
            <div class="info_text">${formattedResult(metadata)}</div>
          </div>
        </a>`);
    }
    grid = grid.concat('</div>');
  }
  document.querySelector('#wallet-grid').innerHTML = grid;
}

document.onload = start();
