import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const EscrowContractFactory = await ethers.getContractFactory("Escrow");
  const EscrowContract = await EscrowContractFactory.deploy("0x0FA8781a83E46826621b3BC094Ea2A0212e71B23");

  console.log("Escrow Contract deployed to:", EscrowContract.address); 
  //0x0A2Dd392CBb168fE2aFe63C85a9cC7FD9b100892 Shungo's Alchemy
  //0x99404C0d2dE049111bAE676e9D36Fab4080F4E20 Succery's Alchemy
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
