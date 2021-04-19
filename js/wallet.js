import { updateMetaMaskStatus, updateTokenBalance } from './common.js';

window.onload = function() {
  updateMetaMaskStatus();
  updateTokenBalance();
}()
