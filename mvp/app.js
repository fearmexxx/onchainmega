import { validateLine } from "./domain.mjs";

const selected = new Set();
const grid = document.querySelector("#numberGrid");
const display = document.querySelector("#selectedNumbers");
const review = document.querySelector("#review");
const dialog = document.querySelector("#dialog");

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
document.querySelector(".wallet").addEventListener("click", (event) => { event.currentTarget.textContent = "Wallet integration next"; });
review.addEventListener("click", () => {
  document.querySelector("#dialogNumbers").innerHTML = [...selected].sort((a, b) => a - b).map((n) => `<span>${n}</span>`).join("");
  dialog.showModal();
});
render();

