import { ethers, upgrades } from "hardhat";

async function main() {
  const NEW_CONTRACT_IMPLEMENTATION = ""; // The new implementation contract name
  const PROXY_ADDRESS = "0xYourProxyContractAddress"; // The deployed proxy contract address of ContractXyz

  console.log("Upgrading ContractXyz...");

  const ContractXyzNew = await ethers.getContractFactory(NEW_CONTRACT_IMPLEMENTATION);
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, ContractXyzNew);

  console.log("ContractXyz upgraded to:", await upgraded.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
