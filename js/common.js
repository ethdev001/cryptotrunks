import { abi, address } from './contract.js';

export let web3 = new Web3(ethereum);
let accounts = await web3.eth.getAccounts();
export let contract = new web3.eth.Contract(abi, address);
export let wallet = ethereum.selectedAddress;

const isMetaMaskConnected = async () => {
    let accounts = await web3.eth.getAccounts();
    return accounts.length > 0;
}

export async function updateMetaMaskStatus() {
  isMetaMaskConnected().then((connected) => {
    let button = document.querySelector('#connect-text');
    if (connected) {
        button.innerHTML = "METAMASK CONNECTED";
    }
  });
}

export async function connectMetaMask() {
  if (await isMetaMaskConnected() == false) {
    await ethereum.enable();
    await updateMetaMaskStatus();
    location.reload();
  }
}

export function formattedResult(result) {
  if (result.number <= 1500) {
    return '<strong class="green">[Genesis]</strong>';
  } else {
    var formatted = ""
    result.elements.forEach(element => formatted = formatted.concat(`+ ${element}<br>`));
    return `<strong>[Generative]</strong><br><br>${result.tree}<br><br>${result.backgrounds.join(", ")}<br><br>${formatted}<br>`;
  }
}

document.onload = updateMetaMaskStatus();
document.querySelector('#connect').addEventListener('click', connectMetaMask);
