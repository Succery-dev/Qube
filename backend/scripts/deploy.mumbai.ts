import "@nomicfoundation/hardhat-toolbox";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import hre from "hardhat";
import { writeFileSync } from "fs";
import { Contract } from "ethers";
import { ContractNames } from "../contractNames";

async function deploy(hre: HardhatRuntimeEnvironment, name: string, ...params: any[]): Promise<Contract> {
  const Contract = await hre.ethers.getContractFactory(name);
  const contractInstance = await Contract.deploy(...params);
  return await contractInstance.deployed();
}

async function verifyContract(hre: HardhatRuntimeEnvironment, contractAddress: string, ...constructorArguments: any[]) {
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArguments,
    });
    console.log(`Verified contract ${contractAddress}`);
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log(`Contract ${contractAddress} is already verified`);
    } else {
      console.error(`Error verifying contract ${contractAddress}:`, error);
    }
  }
}

async function main() {
  try {
    console.log("Deploying to mumbai...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const forwarder = await deploy(hre, ContractNames.ERC2771Forwarder, ContractNames.ERC2771Forwarder);
    const escrow = await deploy(hre, ContractNames.Escrow, forwarder.address, deployer.address);

    writeFileSync("deploy.mumbai.json", JSON.stringify({
      ERC2771Forwarder: forwarder.address,
      Escrow: escrow.address,
    }, null, 2));

    console.log(`${ContractNames.ERC2771Forwarder}: ${forwarder.address}\n${ContractNames.Escrow}: ${escrow.address}`);

    await verifyContract(hre, forwarder.address, ContractNames.ERC2771Forwarder);
    await verifyContract(hre, escrow.address, forwarder.address, deployer.address);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
