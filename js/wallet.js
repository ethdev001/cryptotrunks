import { contract, wallet } from './common.js';

async function updateTokenBalance() {
  let tokens = await contract.methods.balanceOf(wallet).call();
  document.querySelector('#token-count').innerHTML = tokens;
}

document.onload = updateTokenBalance();
