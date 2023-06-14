// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../Controller.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MockController is Controller {
    constructor(address payable _depositToken) Controller(_depositToken) {
    }
}
