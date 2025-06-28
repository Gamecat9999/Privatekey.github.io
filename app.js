// Static Wallet Finder Demo (client-side only)
// Uses ethers.js for wallet generation and balance lookup

const networkRPCs = {
  mainnet: 'https://mainnet.infura.io/v3/1b0b7e8e7e8e4e8e8e8e8e8e8e8e8e8e', // Demo public project ID
  bsc: 'https://bsc-dataseed.binance.org/',
  polygon: 'https://polygon-rpc.com/'
};

let currentWallet = null;
let running = false;
let searchTimeout = null;
let checkedCount = 0;
let checkedWallets = [];
const MAX_DISPLAYED = 20;
const BATCH_SIZE = 10; // 10 wallets per batch (previous value)
const DELAY_MS = 50;   // 50ms between batches (previous value)
let foundCount = 0;
let foundWallets = [];
const MAX_FOUND_DISPLAYED = 20;

function updateWalletInfo(wallet, balance, network) {
  document.getElementById('address').textContent = wallet.address;
  document.getElementById('privateKey').textContent = wallet.privateKey;
  document.getElementById('balance').textContent = balance !== undefined ? balance : '';
}

function updateCheckedWallets(address) {
  checkedCount++;
  checkedWallets.push(address);
  if (checkedWallets.length > MAX_DISPLAYED) checkedWallets.shift();
  document.getElementById('checkedCount').textContent = checkedCount;
  document.getElementById('checkedWallets').textContent = checkedWallets.map(a => `Checking wallet: ${a}`).join('\n');
}

function updateFoundWallets(wallet, balanceText) {
  foundCount++;
  foundWallets.push({address: wallet.address, privateKey: wallet.privateKey, balance: balanceText});
  if (foundWallets.length > MAX_FOUND_DISPLAYED) foundWallets.shift();
  document.getElementById('foundCount').textContent = foundCount;
  document.getElementById('foundWallets').textContent = foundWallets.map(w => `Address: ${w.address}\nPrivate Key: ${w.privateKey}\nBalance: ${w.balance}\n`).join('\n');
}

async function getBalanceEtherscan(address, apiKey) {
  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "1") {
      return ethers.utils.formatEther(data.result);
    } else {
      return '0';
    }
  } catch (e) {
    return null;
  }
}

async function generateAndCheckBatch() {
  if (!running) return;
  const network = document.getElementById('network').value;
  const batch = Array.from({length: BATCH_SIZE}, () => ethers.Wallet.createRandom());
  let balances = [];
  if (network === 'mainnet') {
    balances = await Promise.all(batch.map(w => getBalanceEtherscan(w.address, 'Q8JD386GBHQ477U82CBH96ICW9F9YEC2PG')));
  } else {
    const provider = new ethers.providers.JsonRpcProvider(networkRPCs[network]);
    balances = await Promise.all(batch.map(async w => {
      try {
        const bal = await provider.getBalance(w.address);
        return ethers.utils.formatEther(bal);
      } catch {
        return null;
      }
    }));
  }
  for (let i = 0; i < batch.length; i++) {
    let balanceText = '';
    let formatted = balances[i] || '0';
    if (balances[i] === null) {
      balanceText = 'Error fetching balance';
    } else {
      if (network === 'mainnet') {
        balanceText = formatted + ' ETH';
      } else if (network === 'bsc') {
        balanceText = formatted + ' BNB';
      } else if (network === 'polygon') {
        balanceText = formatted + ' MATIC';
      }
      if (parseFloat(formatted) > 0) {
        balanceText += '  🎉 Funded!';
        updateFoundWallets(batch[i], balanceText);
      }
    }
    updateWalletInfo(batch[i], balanceText, network);
    updateCheckedWallets(batch[i].address);
  }
  searchTimeout = setTimeout(generateAndCheckBatch, DELAY_MS);
}

function startSearch() {
  if (running) return;
  running = true;
  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('stopBtn').style.display = '';
  generateAndCheckBatch();
}

function stopSearch() {
  running = false;
  document.getElementById('startBtn').style.display = '';
  document.getElementById('stopBtn').style.display = 'none';
  if (searchTimeout) clearTimeout(searchTimeout);
}

// Remove old button event listeners if present
// document.getElementById('generateBtn').onclick = generateWallet;
// document.getElementById('checkBalanceBtn').onclick = checkBalance;

window.addEventListener('DOMContentLoaded', function() {
  document.getElementById('startBtn').onclick = startSearch;
  document.getElementById('stopBtn').onclick = stopSearch;
});
