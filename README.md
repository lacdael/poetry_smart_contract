# Quick Start

-   Add data needed in truffle conf to a `.env` file
-   npm install
-   **TEST:** `truffle test`
-   **Migrate contract to testnet:** `truffle migrate --reset --skip-dry-run --network devnet`
-   **Mint NFTs** `truffle exec scripts/mint.js --network devnet`
-   **Migrate contract to mainnet:** `truffle migrate --reset --skip-dry-run --network mainnet`
-   **Mint NFT on mainnet:** `truffle exec scripts/mint.js --network mainnet`

(Harmony Chain IDs)[https://docs.harmony.one/home/general/wallets/browser-extensions-wallets/metamask-wallet/adding-harmony])

## Poem Stansa NFT

To mint an NFT poem stansa pass a string of the text to the mint function. The nft will be an svg with text elements of the text, split at newlines.

## Image NFT

To mint an image NFT pass a file name beginning with a `-` character, e.g. `-an-image.png`. 
