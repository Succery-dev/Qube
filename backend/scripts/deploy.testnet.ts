import "@nomicfoundation/hardhat-toolbox";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import hre from "hardhat";
import { writeFileSync } from "fs";
import { Contract } from "ethers";
import { ContractNames } from "../contractNames";
import { MumbaiTokenAddresses } from "../tokenAddresses";

async function deploy(hre: HardhatRuntimeEnvironment, name: string, ...params: any[]): Promise<Contract> {
  const Contract = await hre.ethers.getContractFactory(name);
  const contractInstance = await Contract.deploy(...params);
  return await contractInstance.deployed();
}

async function main() {
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const forwarder = await deploy(hre, ContractNames.ERC2771Forwarder, ContractNames.ERC2771Forwarder);
    const escrow = await deploy(hre, ContractNames.Escrow, forwarder.address, MumbaiTokenAddresses.USDC, deployer.address);

    writeFileSync("deploy.json", JSON.stringify({
      ERC2771Forwarder: forwarder.address,
      Escrow: escrow.address,
    }, null, 2));

    console.log(`${ContractNames.ERC2771Forwarder}: ${forwarder.address}\n${ContractNames.Escrow}: ${escrow.address}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
