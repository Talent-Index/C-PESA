import axios from "axios";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.AVAX_RPC);
const wallet = new ethers.Wallet(process.env.HOT_WALLET_PRIVATE_KEY, provider);


let cached = { priceKES: null, ts: 0 };
const TTL = 30 * 1000;

export async function getAvaxPriceKES() {
  if (Date.now() - cached.ts < TTL && cached.priceKES) return cached.priceKES;
  const r = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
    params: { ids: "avalanche-2", vs_currencies: "kes" }
  });
  const priceKES = r.data?.["avalanche-2"]?.kes;
  if (!priceKES) throw new Error("Could not fetch AVAX price");
  cached = { priceKES, ts: Date.now() };
  return priceKES;
}

export async function sendAvax(to, amountAvax) {
  if (!ethers.isAddress(to)) throw new Error("Invalid AVAX address");
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountAvax.toString())
  });
  const receipt = await tx.wait();
  return receipt.transactionHash || tx.hash;
}
