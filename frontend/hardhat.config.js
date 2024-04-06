require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: './frontend/src/artifacts'
  },
  networks: {
    localhost: {
      url: "http://localhost:8545", // Hardhat's default RPC server URL
    },
  },
};