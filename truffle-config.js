require("dotenv").config();
const PrivateKeyProvider = require('./private-provider')
const { TruffleProvider } = require("@harmony-js/core");

//Local
const local_mnemonic = process.env.LOCAL_MNEMONIC;
const local_private_key = process.env.LOCAL_PRIVATE_KEY;
const local_url = process.env.LOCAL_0_URL;

//Testnet
const testnet_mnemonic = process.env.TESTNET_MNEMONIC;
const testnet_private_key = process.env.TESTNET_PRIVATE_KEY;
const testnet_url = process.env.TESTNET_2_URL;

const devnet_mnemonic = process.env.TESTNET_MNEMONIC;
const devnet_private_key = process.env.TESTNET_PRIVATE_KEY;
const devnet_url = process.env.DEVNET_0_URL;

//Mainnet
const mainnet_mnemonic = process.env.MAINNET_MNEMONIC;
const mainnet_private_key = process.env.MAINNET_PRIVATE_KEY;
const mainnet_url = process.env.MAINNET_0_URL;

//GAS - Currently using same GAS accross all environments
gasLimit = process.env.GAS_LIMIT;
gasPrice = process.env.GAS_PRICE;

const networkId = {
  Mainnet: 1666600000,
  Testnet: 1666700000,
  Devnet: 1666900000
}


module.exports = {
   compilers: {
    solc: {
     version: ">=0.6.0 < 0.8.0",
      optimizer: {
        enabled: true,
        runs: 400
      }
    }
  },
   development: {
        host: "127.0.0.1",
        port: 9545,
        network_id: "*",
        gas: 6800000
   },
   develop: {
        port: 9545,
   },
    networks: {
    local: {
      network_id: "2", // Any network (default: none)
      provider: () => {
        const truffleProvider = new TruffleProvider(
          local_url,
          { memonic: local_mnemonic },
          { shardID: 0, chainId: 2 },
          { gasLimit: gasLimit, gasPrice: gasPrice }
        );
        const newAcc = truffleProvider.addByPrivateKey(local_private_key);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
    },
 testnet: {
      provider: () => {
        return new PrivateKeyProvider(process.env.TESTNET_PRIVATE_KEY, testnet_url, networkId.Testnet)
      },
      network_id: networkId.Testnet
    },
 devnet: {
      provider: () => {
        return new PrivateKeyProvider(process.env.DEVNET_PRIVATE_KEY, devnet_url, networkId.Devnet)
      },
      network_id: networkId.Devnet
    },


   
    mainnet0: {
      network_id: "1", // Any network (default: none)
      provider: () => {
        const truffleProvider = new TruffleProvider(
          mainnet_url,
          { memonic: mainnet_mnemonic },
          { shardID: 0, chainId: 1 },
          { gasLimit: gasLimit, gasPrice: gasPrice }
        );
        const newAcc = truffleProvider.addByPrivateKey(mainnet_private_key);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
    },
  }
};

