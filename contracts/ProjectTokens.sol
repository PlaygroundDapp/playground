// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract ProjectToken {
    address owner;
    string projectName;
    string symbol;
    uint256 totalDeposited;

    struct NftItem {
        uint256 sharePercent;
        uint256 amountClaimed;
    }

    mapping(address => NftItem) public shareData;

    constructor() {
        owner = msg.sender;
    }
}
