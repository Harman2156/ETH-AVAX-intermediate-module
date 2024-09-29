// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;

    // Event emitted for deposit and withdraw actions
    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);

    // Custom error for insufficient balance
    error InsufficientBalance(uint256 available, uint256 requested);

    // Mapping to keep track of user balances
    mapping(address => uint256) public balances;

    constructor() {
        owner = payable(msg.sender);  // Set the contract deployer as the owner
    }

    // Function to get the current contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;  // Return the actual balance of the contract
    }

    // Function to get the balance of a specific user
    function getUserBalance(address user) public view returns (uint256) {
        return balances[user];  // Return the user's balance
    }

    // Deposit function, allowing deposits between 1 and 10 ETH
    function deposit() public payable {
        // The deposit amount should be between 1 and 10 ETH
        require(msg.value >= 1 ether && msg.value <= 10 ether, "Deposit must be between 1 and 10 ETH");

        // Update user balance
        balances[msg.sender] += msg.value;

        // Emit a deposit event for logging
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw function to allow the owner to withdraw funds
    function withdraw(uint256 _withdrawAmount) public {
        // Ensure that only the owner can withdraw
        require(msg.sender == owner, "You are not the owner of this account");

        // Check if there are enough funds to withdraw
        if (address(this).balance < _withdrawAmount) {
            revert InsufficientBalance({
                available: address(this).balance,
                requested: _withdrawAmount
            });
        }

        // Transfer the requested amount to the owner
        owner.transfer(_withdrawAmount);

        // Emit a withdraw event for logging
        emit Withdraw(owner, _withdrawAmount);
    }

    // Fallback function to accept direct ETH deposits
    receive() external payable {
        // Update balance for the sender
        balances[msg.sender] += msg.value;

        // Emit a deposit event when ETH is sent directly to the contract
        emit Deposit(msg.sender, msg.value);
    }
}


