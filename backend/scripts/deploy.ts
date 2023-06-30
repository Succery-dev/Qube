import {ethers} from "hardhat";
const hre = require("hardhat");
const fs = require('fs');

import {Controller} from "../typechain-types";

async function main() {

    const routerAddress = process.env.ROUTER as string;
    const network = await hre.ethers.provider.getNetwork();
    const mainnet = network.chainId === 1;
    const tesntet = network.chainId === 5;

    const ControllerFactory = await ethers.getContractFactory("Controller");
    const controller: Controller = await ControllerFactory.deploy();
    const controllerAddress = controller.address;
    const contracts = {
        controller: controllerAddress,
    };

    fs.writeFileSync('./contracts.json', JSON.stringify(contracts, null, 2));

    if (process.env.ETHERSCAN) {
        try {
            if (mainnet || tesntet) {
                controller.deployTransaction.wait(10);
                await hre.run("verify:verify", {
                    contract: "contracts/Controller.sol:Controller",
                    address: controllerAddress,
                    constructorArguments: []
                });
            }
        } catch (e) {
            console.log(e.toString());
        }
    } else {
        console.log(`contract verification canceled as ETHERSCAN API key not informed in .env file.`)
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
