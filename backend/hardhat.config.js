require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337, // Use the default Hardhat network chain ID
    },
  },
  paths: {
    artifacts: "../frontend/src/artifacts", // Save the contract artifacts in the frontend directory
  },
};