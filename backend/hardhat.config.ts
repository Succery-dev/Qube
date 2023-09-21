import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();
require("@nomiclabs/hardhat-etherscan");
import "@typechain/hardhat";
import "solidity-coverage";
import "hardhat-gas-reporter";

task("balance", "Prints an account's balance")
    .addParam("account", "The account's address")
    .setAction(async (taskArgs, hre) => {
        const balance = await hre.ethers.provider.getBalance(taskArgs.account);
        console.log(hre.ethers.utils.formatEther(balance), "ETH");
    });

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    solidity: "0.8.18",
    networks: {
        // mainnet: {
        //     url: "https://eth.llamarpc.com",
        //     accounts: [`${process.env.PRIVATE_KEY}`],
        // },
        // testnet: {
        //     url: "https://rpc.ankr.com/eth_goerli",
        //     accounts: [`${process.env.PRIVATE_KEY}`],
        // },
        // hardhat: {
        //     forking: {
        //         url: "https://eth.llamarpc.com",
        //         blockNumber: 17103794
        //     }
        // },
        // localhost: {
        //     url: "http://127.0.0.1:8545"
        // },
        mainnet: {
            url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_PRODUCTION}`,
            accounts: [process.env.PRIVATE_KEY_PRODUCTION as string],
        },
        mumbai: {
            url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            accounts: [process.env.PRIVATE_KEY as string],
        },
        hardhat: {
            chainId: 31337,
            initialBaseFeePerGas: 0,
        }
    },
    // solidity: {
    //     compilers: [
    //         {
    //             version: '0.8.18',
    //             settings: {
    //                 optimizer: {
    //                     enabled: true,
    //                     runs: 200
    //                 },
    //             },
    //         },
    //         {
    //             version: '0.6.6',
    //             settings: {
    //                 optimizer: {
    //                     enabled: true,
    //                     runs: 200
    //                 },
    //             },
    //         }
    //     ],
    // },
    etherscan: {
        apiKey: { // npx hardhat verify --list-networks
            goerli: `${process.env.ETHERSCAN}`,
            mainnet: `${process.env.ETHERSCAN}`,
        }
    },
    gasReporter: {
        enabled: true,
        currency: 'USD',
        gasPrice: 21
    }
};

export default config;
