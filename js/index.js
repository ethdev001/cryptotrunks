import { updateMetaMaskStatus, connectMetaMask } from './common.js';

window.onload = updateMetaMaskStatus();
document.querySelector('#connect').addEventListener('click', connectMetaMask);
