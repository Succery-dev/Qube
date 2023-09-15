// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Escrow is Ownable {
    // The ERC20 token being used (USDC)
    IERC20 public token;

    // Struct to represent individual deposits
    struct Deposite {
        address depositor;
        address recipient;
        uint256 amount;
        uint256 timestamp;
        bool withdrawn;
    }

    // DepositID to Deposit mapping (DepositIDs are unique IDs stored in Cloud Firestore)
    mapping(string => Deposite) public deposits;

    // TODO: Make events
    // event Deposited(address indexed user, uint256 amount, uint256 timestamp);
    // event Withdrawn(address indexed user, address indexed to, uint256 amount);

    constructor(address _token) {
        token = IERC20(_token);
    }

    // ① Wallet Connect -> Working on Task
    function depositTokens(address _recipient, uint256 _amount, string memory _depositId) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(bytes(_depositId).length != 0, "DepositId should not be empty");
        require(token.transferFrom(msg.sender, address(this), _amount), "Deposit failed");

        deposits[_depositId] = Deposite({
            depositor: msg.sender,
            recipient: _recipient,
            amount: _amount,
            timestamp: block.timestamp,
            withdrawn: false
        });
    }

    function _executeWithdraw(string memory _depositId, address _recipient) internal {
        Deposite memory deposit = deposits[_depositId];

        require(!deposit.withdrawn, "This deposit has already been withdrawn");

        uint256 amount = deposit.amount;

        // Mark this deposit as withdrawn
        deposit.withdrawn = true;

        // Update the deposit mapping
        deposits[_depositId] = deposit;

        // Transfer the tokens
        require(token.transfer(_recipient, amount), "Withdrawal failed");

        // OPTIONAL: Delete the deposit data
        // delete deposits[_depositId];
    }

    // ③ Approve The Submission
    function withdrawTokensToRecipientByDepositor(string memory _depositId) external {
        require(deposits[_depositId].depositor == msg.sender, "Not authorized to withdraw this deposit");
        _executeWithdraw(_depositId, deposits[_depositId].recipient);
    }

    // ⑦ No Approval (Ignored By Client)
    function withdrawTokensToRecipientByOwner(string memory _depositId) external onlyOwner {
        _executeWithdraw(_depositId, deposits[_depositId].recipient);
    }

    // ② No Submission By Lancer, ④ Disapprove The Submission, ⑥ Deadline-Extension Request (Disapproval)
    function withdrawTokensToDepositorByOwner(string memory _depositId) external onlyOwner {
        _executeWithdraw(_depositId, deposits[_depositId].depositor);
    }
}
