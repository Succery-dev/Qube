// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.6.6;
import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MockRouter is UniswapV2Router02{
    constructor(address _factory, address _WETH) UniswapV2Router02(_factory, _WETH) public
    {

    }
}
