import { connectMetaMask, wallet } from './common.js';

function start() {
  connectMetaMask();
  fetchCarbonStats();
}

async function fetchCarbonStats() {
  let co2_per_wei = 0.0002874;
  let co2_absorbed_per_year = 21;
  let url = `https://service.cryptotrunks.co/carbon.json?address=${wallet}`
  let result = await (await fetch(url)).json();
  let gas = result["gas"];

  document.querySelector('#carbon-transactions').innerHTML = result["transactions"].toLocaleString();
  document.querySelector('#carbon-gas').innerHTML = gas.toLocaleString();

  let co2 = gas * co2_per_wei;
  let co2_formatted = Math.round(co2).toLocaleString();
  document.querySelector('#carbon-co2').innerHTML = co2_formatted.concat(" kg of CO₂ emissions.");

  let absorbed = Math.round(co2 / co2_absorbed_per_year);
  let absorbed_formatted = absorbed.toLocaleString();
  document.querySelector('#carbon-years').innerHTML = absorbed_formatted.concat(" years");

  var gas_string = "You’ve spent little to no gas. Good on you!";
  var tree = "Your trunk will be a <strong>sapling</strong>";
  if (gas > 1e6) {
    gas_string = "You’ve spent a reasonable amount of gas. You might be spared.";
    tree = "Your trunk will be <strong>young</strong>";
  } else if (gas > 1e7) {
    gas_string = "You’ve spent a lot of gas. Why would you do that?";
    tree = "Your trunk will be an <strong>adult</strong>";
  } else if (gas > 1e8) {
    gas_string = "You’ve spent a huge amount of gas. I hope you’re happy.";
    tree = "Your trunk will be an <strong>elder</strong>";
  } else if (gas > 1e9) {
    gas_string = "You’ve spent an outstanding amount of gas. You must really hate bears.";
    tree = "Your trunk will be <strong>ancient</strong>";
  }
  document.querySelector('#trunk-age').innerHTML = tree;
  document.querySelector('#trunk-gas').innerHTML = gas_string;
}

document.onload = start();
