import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractXyz, TKN1, TKN2 } from "../typechain";
import { waitSeconds } from '../helper';

describe("ContractXyz", function () {
  let tkn1: TKN1;
  let tkn2: TKN2;
  let contractXyz: ContractXyz;
  let tkn1Address: string;
  let tkn2Address: string;
  let contractXyzAddress: string;
  let owner: any;
  let addr1: any;
  let addr2: any;
  const depositAmount = BigInt(100);
  const withdrawalAmount = BigInt(50);

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    console.log("owner address: ", owner.address);
    console.log("addr1 address: ", addr1.address);
    // Deploy TKN1
    const TKN1 = await ethers.getContractFactory("TKN1");
    tkn1 = await TKN1.deploy();
    tkn1Address = await tkn1.getAddress();
    console.log("TKN1 deployed to:", tkn1Address);

    // Deploy TKN2
    const TKN2 = await ethers.getContractFactory("TKN2");
    tkn2 = await TKN2.deploy();
    tkn2Address = await tkn2.getAddress();
    console.log("TKN2 deployed to:", tkn2Address);

    // Deploy ContractXyz
    const ContractXyz = await ethers.getContractFactory("ContractXyz");
    contractXyz = await upgrades.deployProxy(
      ContractXyz,
      [tkn1Address, tkn2Address],
      { initializer: "initialize" }
    );
    await waitSeconds(3);
    contractXyzAddress = await contractXyz.getAddress();
    console.log("ContractXyz deployed to:", contractXyzAddress);
  });

  it("should handle deposits correctly", async function () {
    await tkn1.transfer(addr1.address, depositAmount);
    await tkn1.connect(addr1).approve(contractXyzAddress, depositAmount);
    await contractXyz.connect(addr1).deposit(depositAmount);
    expect(await contractXyz.getDeposit(addr1.address)).to.equal(depositAmount);
    expect(await tkn1.balanceOf(contractXyzAddress)).to.equal(depositAmount);
  });

  it("should handle withdrawal requests correctly", async function () {
    await tkn1.transfer(addr1.address, depositAmount);
    await tkn1.connect(addr1).approve(contractXyzAddress, depositAmount);
    await contractXyz.connect(addr1).deposit(depositAmount);
    await contractXyz.connect(addr1).withdrawalRequest(withdrawalAmount);
    expect(await contractXyz.getWithdrawalRequest(addr1.address)).to.equal(withdrawalAmount);
    expect(await contractXyz.getDeposit(addr1.address)).to.equal(withdrawalAmount);
  });

  it("should handle claims correctly", async function () {
    await tkn1.transfer(addr1.address, depositAmount);
    await tkn1.connect(addr1).approve(contractXyzAddress, depositAmount);
    await contractXyz.connect(addr1).deposit(depositAmount);
    await contractXyz.connect(addr1).withdrawalRequest(depositAmount);
    await tkn2.mint(contractXyzAddress, depositAmount);
    await contractXyz.connect(addr1).claim();
    expect(await tkn2.balanceOf(addr1.address)).to.equal(depositAmount);
    expect(await contractXyz.getWithdrawalRequest(addr1.address)).to.equal(BigInt(0));
  });

  it("should allow owner to fund contract", async function () {
    await tkn2.mint(owner.address, depositAmount);
    await tkn2.approve(contractXyzAddress, depositAmount);
    await contractXyz.fundContract(depositAmount);
    expect(await tkn2.balanceOf(contractXyzAddress)).to.equal(depositAmount);
  });
});
