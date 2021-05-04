import { connectMetaMask, contract, wallet, formattedResult } from './common.js';

function start() {
  connectMetaMask();
  loadWalletTrunks();
}

async function loadWalletTrunks() {
  contract.methods.balanceOf(wallet).call()
  .then(function(tokens) {
    document.querySelector('#token-count').innerHTML = `You own <strong id="token-count">${tokens}</strong> trunks.<br>`;
  });

  let url = `https://service.cryptotrunks.co/wallet.json?address=${wallet}`
  let result = await (await fetch(url)).json();

  var grid = "";
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
  document.querySelector('#wallet-grid').innerHTML = grid;
}

document.onload = start();
