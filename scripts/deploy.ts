import hre from "hardhat";

async function main() {
  console.log("\n🚀 Starting deployment of DoubleFinancingAlert contract...\n");

  // Get the contract factory
  const DoubleFinancingAlert = await hre.ethers.getContractFactory("DoubleFinancingAlert");
  
  console.log("⏳ Deploying contract...");
  
  // Deploy the contract
  const doubleFinancingAlert = await DoubleFinancingAlert.deploy();
  
  // Wait for deployment to finish
  await doubleFinancingAlert.waitForDeployment();
  
  const contractAddress = await doubleFinancingAlert.getAddress();
  
  console.log("\n✅ DoubleFinancingAlert deployed successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📍 Contract Address:", contractAddress);
  
  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log("🔗 Network Name:", network.name);
  console.log("🆔 Chain ID:", network.chainId.toString());
  
  // Get deployer information
  const [deployer] = await hre.ethers.getSigners();
  const deployerBalance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👤 Deployed by:", deployer.address);
  console.log("💰 Deployer balance:", hre.ethers.formatEther(deployerBalance), "ETH");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // Verification instructions
  if (network.chainId !== 31337n) {
    console.log("📝 To verify the contract on Etherscan, run:");
    console.log(`npx hardhat verify --network ${network.name} ${contractAddress}\n`);
  }
  
  return doubleFinancingAlert;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });