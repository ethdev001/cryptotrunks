import { connectMetaMask, wallet } from './common.js';

async function start() {
  try {
    await connectMetaMask();
  } catch (error) {
    window.location.href = "index.html";
  }

  fetchCarbonStats();
}

async function fetchCarbonStats() {
  let co2_per_wei = 0.0002874;
  let co2_absorbed_per_year = 21;
  let url = `https://service.cryptotrunks.co/carbon.json?address=${wallet}`
  let result = await (await fetch(url)).json();
  let gas = result["gas"];

  let co2 = gas * co2_per_wei;
  let co2_formatted = Math.round(co2).toLocaleString();

  let absorbed = Math.round(co2 / co2_absorbed_per_year);
  let absorbed_formatted = absorbed.toLocaleString();

  var gas_string = "you've spent little to no gas. Good on you!";
  var tree = "Your trunk will be a <strong>sapling</strong>";
  if (gas > 1e6) {
    gas_string = "you've spent a reasonable amount of gas. You might be spared.";
    tree = "Your trunk will be <strong>young</strong>";
  } else if (gas > 1e7) {
    gas_string = "you've spent a lot of gas. Why would you do that?";
    tree = "Your trunk will be an <strong>adult</strong>";
  } else if (gas > 1e8) {
    gas_string = "you've spent a huge amount of gas. I hope you're happy.";
    tree = "Your trunk will be an <strong>elder</strong>";
  } else if (gas > 1e9) {
    gas_string = "you've spent an outstanding amount of gas. You must really hate bears.";
    tree = "Your trunk will be <strong>ancient</strong>";
  }

  let carbon_html = `
    <div class="text_block one">
      <div class="text big_text_two">This address initiated <br><strong>${result["transactions"].toLocaleString()}</strong> transactions consuming <strong>${gas.toLocaleString()}</strong> gas.<br><br>In total, this address is responsible for<br><strong>${co2_formatted} kg of CO₂ emissions.</strong><br></div>
    </div>
    <div class="text_block tight one">
      <div class="text">It would take an adult tree <strong>${absorbed_formatted} years</strong> to absorb your emissions. Nice one.<br></div>
    </div>
    <div class="text_block two">
      <div class="text">${gas_string}<br></div>
    </div>
    <div class="text_block">
      <div class="text big_text_two">${tree}<br></div>
    </div>
  `.replaceAll("\u2028", "");

  document.querySelector('#carbon-info').innerHTML = carbon_html;
}

document.onload = start();
