import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractXyz, TKN1, TKN2 } from "../typechain";
import { waitSeconds } from '../helper';

describe("ContractXyz", function () {
  let tkn1: TKN1;
  let tkn2: TKN2;
  let contractXyz: ContractXyz;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    console.log("owner address: ", owner.address);

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
  });

  it("should handle deposits correctly", async function () {
    await tkn1.transfer(addr1.address, 100);
    await tkn1.connect(addr1).approve(contractXyz.address, 100);
    await contractXyz.connect(addr1).deposit(100);
    expect(await contractXyz.getDeposit(addr1.address)).to.equal(100);
    expect(await tkn1.balanceOf(contractXyz.address)).to.equal(100);
  });

  it("should handle withdrawal requests correctly", async function () {
    await tkn1.transfer(addr1.address, 100);
    await tkn1.connect(addr1).approve(contractXyz.address, 100);
    await contractXyz.connect(addr1).deposit(100);
    await contractXyz.connect(addr1).withdrawalRequest(50);
    expect(await contractXyz.getWithdrawalRequest(addr1.address)).to.equal(50);
    expect(await contractXyz.getDeposit(addr1.address)).to.equal(50);
  });

  it("should handle claims correctly", async function () {
    await tkn1.transfer(addr1.address, 100);
    await tkn1.connect(addr1).approve(contractXyz.address, 100);
    await contractXyz.connect(addr1).deposit(100);
    await contractXyz.connect(addr1).withdrawalRequest(100);
    await tkn2.mint(contractXyz.address, 100);
    await contractXyz.connect(addr1).claim();
    expect(await tkn2.balanceOf(addr1.address)).to.equal(100);
    expect(await contractXyz.getWithdrawalRequest(addr1.address)).to.equal(0);
  });

  it("should allow owner to fund contract", async function () {
    await tkn2.mint(owner.address, 100);
    await tkn2.approve(contractXyz.address, 100);
    await contractXyz.fundContract(100);
    expect(await tkn2.balanceOf(contractXyz.address)).to.equal(100);
  });
});
