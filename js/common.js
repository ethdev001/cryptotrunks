import { abi, address } from './contract.js';

let web3 = new Web3(ethereum);
let accounts = await web3.eth.getAccounts();
let contract = new web3.eth.Contract(abi, address);
let walletAddress = ethereum.selectedAddress;

const isMetaMaskConnected = async () => {
    let accounts = await web3.eth.getAccounts();
    return accounts.length > 0;
}

export async function updateMetaMaskStatus() {
  await isMetaMaskConnected().then((connected) => {
    let button = document.querySelector('#connect-text');
    if (connected) {
        button.innerHTML = "CONNECTED";
    }
  });
}

export async function updateTokenBalance() {
  let tokens = await contract.methods.balanceOf(walletAddress).call();
  document.querySelector('#token-count').innerHTML = tokens;
}

export async function connectMetaMask() {
  await ethereum.enable();
  let walletAddress = ethereum.selectedAddress;
  console.log(walletAddress);
  updateMetaMaskStatus();
}

/* window.onload = updateMetaMaskStatus(); */
