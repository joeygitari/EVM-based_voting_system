require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["evm.bytecode", "evm.deployedBytecode", "abi"],
        },
      },
      viaIR: true,
    },
  },
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      chainId: 1337,
      gas: 10000000,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      gas: 10000000,
      allowUnlimitedContractSize: true,
    },
  },
  paths: {
    artifacts: "../frontend/src/artifacts",
  },
  mocha: {
    timeout: 100000,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
};