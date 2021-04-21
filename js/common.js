import { abi, address } from './contract.js';

let web3 = new Web3(ethereum);
let accounts = await web3.eth.getAccounts();
export let contract = new web3.eth.Contract(abi, address);
export let wallet = ethereum.selectedAddress;

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

export async function connectMetaMask() {
  await ethereum.enable();
  updateMetaMaskStatus();
}

document.onload = updateMetaMaskStatus();
document.querySelector('#connect').addEventListener('click', connectMetaMask);
