import { run } from "hardhat";
import { waitSeconds } from '../helper';
async function main() {
  // Proxy
  await run("verify:verify", {
    address: "0x6908D82edE2e2810868dcA61ec5047C61514Df6B",
    constructorArguments: [],
  });
  // TKN1
  await run("verify:verify", {
    address: "0xc1CF430E3Ac041B8D7FEE7dE70531c04b8052104",
    contract: "contracts/TKN1.sol:TKN1",
    constructorArguments: [],
  });
  // TKN2
  await run("verify:verify", {
    address: "0x1c1a8D7B9608842226d48405cd0fAa0924F91AC7",
    contract: "contracts/TKN2.sol:TKN2",
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
