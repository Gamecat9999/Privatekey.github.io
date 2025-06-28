# Static Wallet Finder (Demo)
Try wallet finder here:
https://gamecat9999.github.io/Privatekey.github.io/

Static Wallet Finder is a client-side web application that demonstrates how random cryptocurrency wallets are generated and checked for balances on Ethereum, Binance Smart Chain (BSC), and Polygon networks. The app is built entirely with HTML, CSS, and JavaScript, and can be hosted on GitHub Pages or any static web server.

What It Does
Continuously generates random wallet addresses and private keys in the browser.
Checks the balance of each generated wallet using public blockchain APIs (Etherscan for Ethereum, public RPCs for BSC and Polygon).
Displays the address, private key, and balance of each wallet being checked in real time.
If a wallet with a balance greater than zero is found, it is saved and shown in a separate “Funded wallets found” section.
Keeps a running count of all checked wallets and all funded wallets found during the session.
How It Works
Random Generation: Uses the ethers.js library to generate random wallet addresses and private keys directly in your browser.
Balance Checking: For each wallet, the app queries the appropriate blockchain API to check the balance:
Ethereum: Uses the Etherscan API (with your API key).
BSC & Polygon: Uses public RPC endpoints.
Batch Processing: Wallets are generated and checked in batches for maximum speed, with results updated live on the page.
No Backend: All logic runs client-side; no private keys or data are sent to any server except for public API balance checks.
Safe for Demo: The app is for educational and demonstration purposes only. Never use real funds or private keys generated here for actual transactions.
Usage
Click “Start Random Search” to begin generating and checking wallets.
Click “Stop” to pause the search.
View the list of checked wallets and any funded wallets found in real time.
