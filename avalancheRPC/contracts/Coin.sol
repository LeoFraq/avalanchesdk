// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Coin {
    address public minter;
    uint256 public result;

    mapping(address => uint) public balances;
    event Sent(address from, address to, uint amount);

    constructor() {
        minter = msg.sender;
    }

    function mint(address receiver, uint amount, uint iterations) public {
        require(msg.sender == minter);
        for (uint i = 0; i < iterations; i++) {
            // Simulate a resource-intensive operation (e.g., hashing)
            bytes32 hash = keccak256(abi.encodePacked(result, block.timestamp));
            result = uint256(hash); // Convert bytes32 to uint256
        }
        balances[receiver] += amount;
    }

    error InsufficientBalance(uint requested, uint available);

    function send(address receiver, uint amount) public {
        if (amount > balances[msg.sender])
            revert InsufficientBalance({
                requested: amount,
                available: balances[msg.sender]
            });

        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}
