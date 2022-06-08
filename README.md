# Quick Start

i.  Add private key to .env
ii. npm install
iii.    TEST: `truffle test --network testnet`
iv. **If deploy on a testnet, get use network faucet
v. **Migrate contract to testnet:** `truffle migrate --reset --skip-dry-run --network testnet`
vi. **Mint NFTs** `truffle exec scripts/mint.js --network testnet`
vii. **Migrate contract to mainnet:** `truffle migrate --reset --skip-dry-run --network mainnet`
viii. **Mint NFT on mainnet:** `truffle exec scripts/mint.js --network mainnet`

## Poem Stansa NFT

To mint an NFT poem stansa pass a string of the text to the mint function. The nft will be an svg with text elements of the text, split at carriage returns.

## Image NFT

To mint an image NFT pass a file name beginning with a `-` character, e.g. `-an-image.png`. 
