import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const EscrowContractFactory = await ethers.getContractFactory("Escrow");
  const EscrowContract = await EscrowContractFactory.deploy("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174");

  console.log("Escrow Contract deployed to:", EscrowContract.address);
  // 0xC4b96eF9eeA15e7c05FB429d36Fa6fFfDDB2DF01
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
