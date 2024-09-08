import "./popup.css";

import { SwapSDK, Chains, Assets } from "@chainflip/sdk/swap";

// Initialize SDK
const swapSDK = new SwapSDK({
  network: "perseverance",
  broker: {
    url: 'https://perseverance.chainflip-broker.io/rpc/93c2bff017e243f29ffb14e42dccbec8',
    commissionBps: 0
  },
});

// Function to get a quote for the swap
async function getQuote(amount: number) {
  // Fetch quote for swap
  const quote = await swapSDK.getQuote({
    srcChain: Chains.Ethereum,
    srcAsset: Assets.ETH,
    destChain: Chains.Bitcoin,
    destAsset: Assets.BTC,
    amount: (amount * 1e18).toString(),
  });
  console.log("quote", quote);
  return quote;
}

document.addEventListener("DOMContentLoaded", function () {
  const quoteForm = document.getElementById("quoteForm") as HTMLFormElement;
  const quoteResult = document.getElementById("quoteResult") as HTMLDivElement;
  const quoteAmount = document.getElementById("quoteAmount") as HTMLSpanElement;

  quoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = (document.getElementById("amount") as HTMLInputElement).value;

    try {
      const a = parseFloat(amount);
      const quote = await getQuote(a);

      // Update the quote result
      quoteAmount.textContent = `${quote.quote.egressAmount} ${quote.destAsset}`;
      quoteResult.style.display = "block";

      const swapDepositAddressRequest = {
        srcChain: Chains.Ethereum,
        destChain: Chains.Bitcoin,
        srcAsset: Assets.ETH,
        destAsset: Assets.BTC,
        destAddress: "tb1q7dm0pch8uv4m0v2xu37u7kgsl32hgjtjwh3uvx",
        amount: (a).toString()
      };
      console.log(await swapSDK.requestDepositAddress(swapDepositAddressRequest));

    } catch (error) {
      console.error("Error getting quote:", error);
      // Optionally, hide the quote result if there's an error
      quoteResult.style.display = "none";
    }
  });
});
