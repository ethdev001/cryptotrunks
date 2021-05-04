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

  document.querySelector('#wallet-opensea').href = `https://opensea.io/accounts/${wallet}/CryptoTrunks`;
}

document.onload = start();
