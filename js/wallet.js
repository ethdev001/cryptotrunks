import { web3, connectMetaMask, contract, reforestation, formattedResult } from './common.js';

function start() {
  connectMetaMask();
  loadWalletTrunks();
}

async function loadWalletTrunks() {
  var total_tokens = 0;
  var contract_tokens = 0;
  var reforestation_tokens = 0;
  let accounts = await web3.eth.getAccounts();
  let wallet = ethereum.selectedAddress || accounts[0];

  try {
    contract_tokens = parseInt(await contract.methods.balanceOf(wallet).call());
    reforestation_tokens = parseInt(await reforestation.methods.balanceOf(wallet).call());
    total_tokens = contract_tokens + reforestation_tokens;
    let trunks = (total_tokens == 1 ? "trunk" : "trunks");
    document.querySelector('#token-count').innerHTML = `You own <strong id="token-count">${total_tokens}</strong> ${trunks}.<br>`;
  } catch (error) {
    document.querySelector('#token-count').innerHTML = "Couldn't load trunks.<br>";
  }

  var grid = "";
  if (total_tokens == 0) {
    grid = `<div class="text_block">
      <a href="generate-in-progress" class="button_two w-inline-block">
        <div class="button_text">GET SOME TRUNKS</div>
      </a>
    </div>`;
  } else {
    grid = grid.concat('<div class="wallet_grid">');
    for (let i = 0; i < Math.min(total_tokens, 30); i++) {
      var token;
      var uri;
      if (i < contract_tokens) {
        token = await contract.methods.tokenOfOwnerByIndex(wallet, i).call();
        uri = await contract.methods.tokenURI(token).call();
      } else {
        token = await reforestation.methods.tokenOfOwnerByIndex(wallet, i - contract_tokens).call();
        uri = await contract.methods.tokenURI(token).call();
      }
      let metadata = await (await fetch(uri)).json();

      if (metadata.error == undefined) {
        grid = grid.concat(`
          <a href="individual-trunk-page?token=${metadata.id}" class="gallery_item w-inline-block">
            <img src="${metadata.image}" loading="lazy" alt="Image of a pixel art tree on a forested background." class="wallet_item_image">
            <div class="text_block wallet_info" style="min-width: 0px">
              <div class="info_text big">TRUNK #${token}<br></div>
              <div class="info_text">${formattedResult(metadata)}</div>
            </div>
          </a>`);
      }
    }
    grid = grid.concat('</div>');
    document.querySelector('#wallet-grid').innerHTML = grid;
  }

  document.querySelector('#wallet-opensea').href = `https://opensea.io/accounts/${wallet}/cryptotrunks`;
}

document.onload = start();
