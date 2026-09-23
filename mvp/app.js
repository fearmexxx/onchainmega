import { validateLine } from "./domain.mjs";
import { connectWallet, disconnectWallet, getWalletSnapshot, submitDemoEntry } from "./solana-wallet.js";

const selected = new Set();
const grid = document.querySelector("#numberGrid");
const display = document.querySelector("#selectedNumbers");
const review = document.querySelector("#review");
const dialog = document.querySelector("#dialog");
const walletDialog = document.querySelector("#walletDialog");
const walletButton = document.querySelector("#walletButton");
const submitDevnet = document.querySelector("#submitDevnet");

function shortAddress(address) { return `${address.slice(0, 4)}…${address.slice(-4)}`; }

async function refreshWalletUi() {
  const snapshot = await getWalletSnapshot();
  const state = document.querySelector("#walletState");
  state.hidden = !snapshot.connected;
  walletButton.textContent = snapshot.connected ? shortAddress(snapshot.address) : "Connect wallet";
  if (snapshot.connected) {
    document.querySelector("#walletAddress").textContent = shortAddress(snapshot.address);
    document.querySelector("#walletBalance").textContent = snapshot.balanceSol == null ? "Devnet balance unavailable" : `${snapshot.balanceSol.toFixed(4)} devnet SOL`;
  }
  return snapshot;
}

function render() {
  const values = [...selected].sort((a, b) => a - b);
  [...grid.children].forEach((button) => button.classList.toggle("active", selected.has(Number(button.textContent))));
  display.innerHTML = Array.from({ length: 6 }, (_, index) => `<span class="${values[index] ? "set" : ""}">${values[index] ?? "—"}</span>`).join("");
  review.disabled = !validateLine(values).ok;
}

for (let number = 1; number <= 45; number += 1) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = number;
  button.setAttribute("aria-label", `Number ${number}`);
  button.addEventListener("click", () => {
    if (selected.has(number)) selected.delete(number);
    else if (selected.size < 6) selected.add(number);
    render();
  });
  grid.append(button);
}

document.querySelector("#quickPick").addEventListener("click", () => {
  selected.clear();
  while (selected.size < 6) selected.add(crypto.getRandomValues(new Uint32Array(1))[0] % 45 + 1);
  render();
});
document.querySelector("#clear").addEventListener("click", () => { selected.clear(); render(); });
walletButton.addEventListener("click", async () => {
  const snapshot = await getWalletSnapshot();
  if (snapshot.connected) {
    await disconnectWallet();
    await refreshWalletUi();
    return;
  }
  const options = document.querySelector("#walletOptions");
  options.innerHTML = "";
  const providers = [
    { id: "phantom", name: "Phantom", available: Boolean(window.phantom?.solana?.isPhantom) },
    { id: "backpack", name: "Backpack", available: Boolean(window.backpack?.isBackpack || window.backpack?.solana?.isBackpack) },
  ];
  for (const wallet of providers) {
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = !wallet.available;
    button.innerHTML = `<strong>${wallet.name}</strong><span>${wallet.available ? "Detected" : "Not installed"}</span>`;
    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        await connectWallet(wallet.id);
        walletDialog.close();
        await refreshWalletUi();
      } catch (error) {
        document.querySelector("#walletHelp").textContent = error.message;
        button.disabled = false;
      }
    });
    options.append(button);
  }
  walletDialog.showModal();
});
review.addEventListener("click", () => {
  document.querySelector("#dialogNumbers").innerHTML = [...selected].sort((a, b) => a - b).map((n) => `<span>${n}</span>`).join("");
  dialog.showModal();
});
submitDevnet.addEventListener("click", async () => {
  const status = document.querySelector("#txStatus");
  const link = document.querySelector("#txLink");
  submitDevnet.disabled = true;
  link.hidden = true;
  try {
    status.textContent = "Waiting for wallet signature…";
    const snapshot = await getWalletSnapshot();
    if (!snapshot.connected) throw new Error("Connect a wallet first.");
    const signature = await submitDemoEntry([...selected].sort((a, b) => a - b));
    status.textContent = "Demo entry confirmed on Solana devnet.";
    link.href = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
    link.hidden = false;
    await refreshWalletUi();
  } catch (error) {
    status.textContent = error.message;
  } finally {
    submitDevnet.disabled = false;
  }
});
render();
refreshWalletUi();

