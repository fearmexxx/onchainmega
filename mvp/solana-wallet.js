const RPC_PATH = "/api/rpc";
const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
let activeProvider = null;
let activeWalletName = null;

function requireWeb3() {
  if (!window.solanaWeb3) throw new Error("Solana client library did not load. Check your internet connection.");
  return window.solanaWeb3;
}

function providerFor(id) {
  if (id === "phantom" && window.phantom?.solana?.isPhantom) return window.phantom.solana;
  if (id === "backpack") return window.backpack?.solana ?? window.backpack;
  return null;
}

function connection() {
  const { Connection } = requireWeb3();
  return new Connection(`${window.location.origin}${RPC_PATH}`, "confirmed");
}

export async function connectWallet(id) {
  const provider = providerFor(id);
  if (!provider) throw new Error(`${id} wallet was not detected.`);
  const result = await provider.connect();
  activeProvider = provider;
  activeWalletName = id;
  const publicKey = result?.publicKey ?? provider.publicKey;
  if (!publicKey) throw new Error("Wallet connected without a public key.");
  sessionStorage.setItem("onchainmega.wallet", id);
  return publicKey.toString();
}

export async function disconnectWallet() {
  try { await activeProvider?.disconnect?.(); } finally {
    activeProvider = null;
    activeWalletName = null;
    sessionStorage.removeItem("onchainmega.wallet");
  }
}

export async function getWalletSnapshot() {
  if (!activeProvider) {
    const remembered = sessionStorage.getItem("onchainmega.wallet");
    const provider = remembered ? providerFor(remembered) : null;
    if (provider?.publicKey) {
      activeProvider = provider;
      activeWalletName = remembered;
    }
  }
  const publicKey = activeProvider?.publicKey;
  if (!publicKey) return { connected: false, address: null, balanceSol: null, wallet: null };
  try {
    const balance = await connection().getBalance(publicKey, "confirmed");
    return { connected: true, address: publicKey.toString(), balanceSol: balance / 1_000_000_000, wallet: activeWalletName };
  } catch {
    return { connected: true, address: publicKey.toString(), balanceSol: null, wallet: activeWalletName };
  }
}

export async function submitDemoEntry(numbers) {
  const validation = numbers.length === 6 && new Set(numbers).size === 6 && numbers.every((number) => Number.isInteger(number) && number >= 1 && number <= 45);
  if (!validation) throw new Error("Choose six valid unique numbers before submitting.");
  if (!activeProvider?.publicKey) throw new Error("Connect a wallet first.");
  if (typeof activeProvider.signTransaction !== "function") throw new Error("This wallet cannot sign a devnet transaction in the browser.");

  const { PublicKey, Transaction, TransactionInstruction } = requireWeb3();
  const rpc = connection();
  const latest = await rpc.getLatestBlockhash("confirmed");
  const receipt = JSON.stringify({ app: "onchainmega", version: 1, network: "devnet", kind: "demo-entry", numbers });
  const transaction = new Transaction({ feePayer: activeProvider.publicKey, recentBlockhash: latest.blockhash }).add(
    new TransactionInstruction({ keys: [], programId: new PublicKey(MEMO_PROGRAM_ID), data: new TextEncoder().encode(receipt) }),
  );
  const signed = await activeProvider.signTransaction(transaction);
  const signature = await rpc.sendRawTransaction(signed.serialize(), { skipPreflight: false, preflightCommitment: "confirmed" });
  await rpc.confirmTransaction({ signature, blockhash: latest.blockhash, lastValidBlockHeight: latest.lastValidBlockHeight }, "confirmed");
  return signature;
}

