// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/ERC2771Forwarder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Escrow is ERC2771Context, Ownable {
    using SafeERC20 for IERC20;

    // Struct to represent individual deposits
    struct Deposit {
        address depositor;
        address recipient;
        address tokenAddress;
        uint256 amount;
    }

    // DepositID to Deposit mapping (DepositIDs are unique IDs stored in Cloud Firestore)
    mapping(string => Deposit) private deposits;
    string[] private depositIds;

    event NativeTokenDepositCreated(string indexed depositId, address indexed depositor, address indexed recipient, uint256 amount);
    event ERC20TokenDepositCreated(string indexed depositId, address indexed depositor, address indexed recipient, uint256 amount, address tokenAddress);
    event DepositWithdrawn(string indexed depositId, address indexed recipient);
    event OwnerAction(string indexed action, string indexed depositId);

    modifier validateDeposit(address _recipient, string memory _depositId) {
        require(_msgSender() != address(0), "createDeposit: Invalid depositor address");
        require(_recipient != address(0), "createDeposit: Invalid recipient address");
        require(deposits[_depositId].depositor == address(0), "createDeposit: Deposit ID already exists");
        require(bytes(_depositId).length != 0, "createDeposit: DepositId should not be empty");
        _;
    }

    constructor(ERC2771Forwarder forwarder, address initialOwner) 
        ERC2771Context(address(forwarder))
        Ownable(initialOwner)
    {}

    function createNativeTokenDeposit(address _recipient, string memory _depositId) external payable validateDeposit(_recipient, _depositId) {
        require(msg.value > 0, "createDeposit: Amount must be greater than 0");

        deposits[_depositId] = Deposit({
            depositor: _msgSender(),
            recipient: _recipient,
            tokenAddress: address(0),
            amount: msg.value
        });
        depositIds.push(_depositId);
        
        emit NativeTokenDepositCreated(_depositId, _msgSender(), _recipient, msg.value);
    }

    function createERC20TokenDeposit(address _recipient, uint256 _amount, string memory _depositId, address _tokenAddress) external validateDeposit(_recipient, _depositId) {
        require(_amount > 0, "createDeposit: Amount must be greater than 0");
        require(_tokenAddress != address(0), "createDeposit: Invalid token address");

        IERC20 token = IERC20(_tokenAddress);
        SafeERC20.safeTransferFrom(token, _msgSender(), address(this), _amount);

        deposits[_depositId] = Deposit({
            depositor: _msgSender(),
            recipient: _recipient,
            tokenAddress: _tokenAddress,
            amount: _amount
        });
        depositIds.push(_depositId);

        emit ERC20TokenDepositCreated(_depositId, _msgSender(), _recipient, _amount, _tokenAddress);
    }

    function withdrawToRecipientByDepositor(string memory _depositId) external {
        require(deposits[_depositId].depositor == _msgSender(), "Not authorized to withdraw this deposit");
        _executeWithdraw(_depositId, deposits[_depositId].recipient);
    }

    function withdrawToRecipientByOwner(string memory _depositId) external onlyOwner {
        emit OwnerAction("withdrawToRecipient", _depositId);
        _executeWithdraw(_depositId, deposits[_depositId].recipient);
    }

    function withdrawToDepositorByOwner(string memory _depositId) external onlyOwner {
        emit OwnerAction("withdrawToDepositor", _depositId);
        _executeWithdraw(_depositId, deposits[_depositId].depositor);
    }

    function getDeposit(string memory _depositId) public view onlyOwner returns (Deposit memory) {
        return deposits[_depositId];
    }

    function getDepositIds() public view onlyOwner returns (string[] memory) {
        return depositIds;
    }

    function _executeWithdraw(string memory _depositId, address _recipient) internal {
        Deposit storage deposit = deposits[_depositId];
        require(deposit.depositor != address(0), "Deposit does not exist");

        uint256 amount = deposit.amount;
        address tokenAddress = deposit.tokenAddress;

        // Delete the deposit data
        delete deposits[_depositId];
        _removeDepositId(_depositId);

        if (tokenAddress == address(0)) {
            (bool sent, ) = _recipient.call{value: amount}("");
            require(sent, "Failed to send native token");
        } else {
            // Transfer the tokens using SafeERC20
            IERC20 token = IERC20(tokenAddress);
            SafeERC20.safeTransfer(token, _recipient, amount);
        }

        emit DepositWithdrawn(_depositId, _recipient);
    }

    function _removeDepositId(string memory _depositId) internal {
        uint256 index = _findDepositIdIndex(_depositId);
        require(index != type(uint256).max, "Deposit ID not found");

        // Get last element
        string memory lastElement = depositIds[depositIds.length - 1];
        // Set the last element to the position of the element you want to remove
        depositIds[index] = lastElement;
        // Decrease the size of the array by one
        depositIds.pop();
    }

    function _findDepositIdIndex(string memory _depositId) internal view returns (uint256) {
        for (uint256 i = 0; i < depositIds.length; i++) {
            if (keccak256(bytes(depositIds[i])) == keccak256(bytes(_depositId))) {
                return i;
            }
        }
        return type(uint256).max;
    }

    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}
