const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Deploy the contract
  const Voting = await hre.ethers.deployContract("Voting");
  await Voting.waitForDeployment();

  console.log("Voting contract deployed to:", Voting.target);

  // Read the compiled artifact of the contract asynchronously
  const artifactVoting = await hre.artifacts.readArtifact("Voting");

  // Save the contract address and ABI to a file
  const contractData = {
    address: Voting.target,
    abi: artifactVoting.abi,
  };

  const contractDataPath = path.join(__dirname, "../../frontend/src/contractData.json");
  fs.writeFileSync(contractDataPath, JSON.stringify(contractData, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });