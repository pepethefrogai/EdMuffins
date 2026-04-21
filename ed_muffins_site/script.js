const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const viewingCount = document.getElementById("viewingCount");
const audio = document.getElementById("bgAudio");
const soundBtn = document.getElementById("soundToggle");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("nav-open");
  });
}

if (viewingCount) {
  let viewers = 25;

  setInterval(() => {
    const change = Math.floor(Math.random() * 3) - 1;
    viewers = Math.max(19, Math.min(34, viewers + change));
    viewingCount.textContent = `${viewers} people are looking at this right now`;
  }, 5000);
}

if (audio && soundBtn) {
  audio.volume = 0.6;

  soundBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        soundBtn.textContent = "🔊 Sound On";
        soundBtn.classList.add("active");
      }).catch(() => {
        soundBtn.textContent = "🔇 Sound Blocked";
      });
    } else {
      audio.pause();
      soundBtn.textContent = "🔇 Sound Off";
      soundBtn.classList.remove("active");
    }
  });
}

const paymentOptions = {
  sol: {
    label: "Solana",
    amount: "0.04 SOL",
    network: "Solana",
    wallet: "2UuZrpdiM56e9c2HSB7cRx2LTwQxgPFNsy7cZgNcP43M",
    note: "Send only Solana to this address."
  },
  btc: {
    label: "Bitcoin",
    amount: "0.00007 BTC",
    network: "Bitcoin",
    wallet: "bc1qrnwxhsqyflk50n4p94m07s8legu3v4huh3jcrr",
    note: "Send only Bitcoin to this address."
  },
  eth: {
    label: "Ethereum",
    amount: "0.0026 ETH",
    network: "Ethereum",
    wallet: "0xDf0c9Ad266EadCbA98bE6c0ec36797E664aF3F18",
    note: "Send only Ethereum to this address."
  },
  usdt: {
    label: "USDT (ERC-20)",
    amount: "5.99 USDT",
    network: "ERC-20",
    wallet: "0xDf0c9Ad266EadCbA98bE6c0ec36797E664aF3F18",
    note: "Only send USDT using the ERC-20 network."
  }
};

const paymentButtons = document.querySelectorAll(".payment-method");
const selectedCoinLabel = document.getElementById("selectedCoinLabel");
const selectedAmount = document.getElementById("selectedAmount");
const selectedNetwork = document.getElementById("selectedNetwork");
const walletAddress = document.getElementById("walletAddress");
const walletNote = document.getElementById("walletNote");
const selectedCoinInput = document.getElementById("selectedCoinInput");
const selectedAmountInput = document.getElementById("selectedAmountInput");
const copyWalletBtn = document.getElementById("copyWalletBtn");
const paymentForm = document.getElementById("paymentForm");
const emailField = document.getElementById("email");
const replyToField = document.getElementById("replyToField");
const submitButton = paymentForm ? paymentForm.querySelector('button[type="submit"]') : null;

function updatePaymentMethod(coinKey) {
  const option = paymentOptions[coinKey];
  if (!option) return;

  if (selectedCoinLabel) selectedCoinLabel.textContent = option.label;
  if (selectedAmount) selectedAmount.textContent = option.amount;
  if (selectedNetwork) selectedNetwork.textContent = option.network;
  if (walletAddress) walletAddress.value = option.wallet;
  if (walletNote) walletNote.textContent = option.note;
  if (selectedCoinInput) selectedCoinInput.value = option.label;
  if (selectedAmountInput) selectedAmountInput.value = option.amount;

  paymentButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.coin === coinKey);
  });
}

paymentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updatePaymentMethod(button.dataset.coin);
  });
});

if (copyWalletBtn && walletAddress) {
  copyWalletBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(walletAddress.value);
      copyWalletBtn.textContent = "Copied";
      setTimeout(() => {
        copyWalletBtn.textContent = "Copy";
      }, 1400);
    } catch (error) {
      copyWalletBtn.textContent = "Failed";
      setTimeout(() => {
        copyWalletBtn.textContent = "Copy";
      }, 1400);
    }
  });
}

if (paymentForm) {
  paymentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (emailField && replyToField) {
      replyToField.value = emailField.value;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    try {
      const formData = new FormData(paymentForm);

      const response = await fetch(paymentForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        window.location.href = "thank-you.html";
      } else {
        alert("There was a problem submitting the order. Please try again.");
      }
    } catch (error) {
      alert("There was a problem submitting the order. Please try again.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Order";
      }
    }
  });
}

if (selectedCoinInput && selectedAmountInput) {
  updatePaymentMethod("sol");
}