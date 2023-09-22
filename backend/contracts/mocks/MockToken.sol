// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockToken is ERC20, Ownable {
	constructor() ERC20("Mock USDC", "mUSDC") {
		// Create an initial supply of 1000000 mUSDC
		_mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
	}

	// Development & Testing: Mint tokens to a specific address
	function mint(address to, uint256 amount) external onlyOwner {
		_mint(to, amount);
	}

	// Development & Testing: Burn a specific amount of tokens from an address
	function burn(address from, uint256 amount) external onlyOwner {
		_burn(from, amount);
	}
}