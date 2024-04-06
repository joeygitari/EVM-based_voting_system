async function main() {
    const [deployer] = await ethers.getSigners();
   
    console.log("Deploying contracts with the account:", deployer.address);
   
    const ContractFactory = await ethers.getContractFactory("Voting");
    const contractInstance = await ContractFactory.deploy();
   
    console.log("Contract deployed to:", contractInstance.address);
   
    // Wait for the transaction to be mined
    await contractInstance.deployTransaction.wait();
   
    console.log("Contract deployed!");
   }
   
   main()
    .then(() => process.exit(0))
    .catch((error) => {
       console.error(error);
       process.exit(1);
    });
   