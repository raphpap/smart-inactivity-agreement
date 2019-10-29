const HDWalletProvider = require('truffle-hdwallet-provider')

const private_keys = [
  process.env.CONTRACT_OWNER_PK,
  process.env.CLIENT_1_PK,
  process.env.CLIENT_2_PK
];

module.exports = {
  networks: {
    cldev: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    live: {
      provider: () => {
        return new HDWalletProvider(private_keys, process.env.RPC_URL, 0, 3)
      },
      network_id: '3',
    },
  },
  compilers: {
    solc: {
      version: '0.4.24',
    },
  },
}
