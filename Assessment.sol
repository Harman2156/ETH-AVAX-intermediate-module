// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    bool public paused = false;

    // Events
    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);
    event WalletOpened(address indexed user);
    event Transfer(address indexed from, address indexed to, uint256 amount); // Event for transfer

    // Custom error
    error InsufficientBalance(uint256 available, uint256 requested);

    // Mappings
    mapping(address => uint256) public balances;
    mapping(address => bool) public hasOpenedWallet;

    // Constructor
    constructor() {
        owner = payable(msg.sender);
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // Function to open the wallet
    function openWallet() public whenNotPaused {
        require(!hasOpenedWallet[msg.sender], "Wallet already opened");
        hasOpenedWallet[msg.sender] = true;

        emit WalletOpened(msg.sender);
    }

    // Deposit function
    function deposit() public payable whenNotPaused {
        require(msg.value >= 1 ether && msg.value <= 10 ether, "Deposit must be between 1 and 10 ETH");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw function for the owner
    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        if (address(this).balance < _withdrawAmount) {
            revert InsufficientBalance({
                available: address(this).balance,
                requested: _withdrawAmount
            });
        }
        owner.transfer(_withdrawAmount);
        emit Withdraw(owner, _withdrawAmount);
    }

    // Emergency withdraw for users
    function emergencyWithdraw(uint256 _amount) public whenNotPaused {
        require(balances[msg.sender] >= _amount, "Insufficient balance for withdrawal");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdraw(msg.sender, _amount);
    }

    // Transfer functionality
    function transfer(address payable _to, uint256 _amount) public whenNotPaused {
        require(balances[msg.sender] >= _amount, "Insufficient balance for transfer");
        require(_to != address(0), "Invalid recipient address");
        
        // Update balances
        balances[msg.sender] -= _amount; // Deduct from sender's balance
        balances[_to] += _amount; // Add to recipient's balance

        // Emit transfer event
        emit Transfer(msg.sender, _to, _amount);
    }

    // Fallback function
    receive() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    function pauseContract() public {
        require(msg.sender == owner, "Only the owner can pause the contract");
        paused = true;
    }

    function unpauseContract() public {
        require(msg.sender == owner, "Only the owner can unpause the contract");
        paused = false;
    }
}


