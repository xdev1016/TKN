import { ethers, upgrades } from "hardhat";
import { waitSeconds } from '../helper';
const hre = require("hardhat");

async function main() {
  // Deployer Address
  const deployer = (await ethers.getSigners())[0];
  console.log("Deploying contracts with the account:", deployer.address);
  // Deploy TKN1
  const TKN1 = await ethers.getContractFactory("TKN1");
  const tkn1 = await TKN1.deploy();
  const tkn1Address = await tkn1.getAddress();
  console.log("TKN1 deployed to:", tkn1Address);

  // Deploy TKN2
  const TKN2 = await ethers.getContractFactory("TKN2");
  const tkn2 = await TKN2.deploy();
  const tkn2Address = await tkn2.getAddress();
  console.log("TKN2 deployed to:", tkn2Address);

  // Deploy ContractXyz
  const ContractXyz = await ethers.getContractFactory("ContractXyz");
  const contractXyz = await upgrades.deployProxy(
    ContractXyz,
    [tkn1Address, tkn2Address],
    { initializer: "initialize" }
  );
  await waitSeconds(3);
  console.log("ContractXyz deployed to:", await contractXyz.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
