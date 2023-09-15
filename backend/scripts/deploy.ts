import { ethers } from "hardhat";

async function main() {
  const [owner, account1, account2] = await ethers.getSigners();
  console.log("Deploying contracts with the owner account: ", owner.address);

  // Deploy MockToken contract
  const MockToken = await ethers.getContractFactory("MockToken");
  const USDC = await MockToken.deploy();
  console.log("USDC Contract deployed to:", USDC.address);

  // Deploy Qube contract
  const Escrow = await ethers.getContractFactory("Escrow");
  const Qube = await Escrow.deploy(USDC.address);
  console.log("Qube Contract deployed to:", Qube.address);

  // USDC: Init Distribution Status
  // owner(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266): 1000000 (by constructor in MockToken.sol)
  // account1(0x70997970C51812dc3A010C7d01b50e0d17dc79C8): 1000
  // account2(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC): 1000
  console.log("Owner(%s): %sUSDC", owner.address, ethers.utils.formatEther(await USDC.balanceOf(owner.address)));
  const amount = ethers.utils.parseEther("1000");
  await USDC.mint(account1.address, amount);
  console.log("Account1(%s): %sUSDC", account1.address, ethers.utils.formatEther(await USDC.balanceOf(account1.address)));
  await USDC.mint(account2.address, amount);
  console.log("Account2(%s): %sUSDC", account2.address, ethers.utils.formatEther(await USDC.balanceOf(account2.address)));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });