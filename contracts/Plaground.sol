//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Playground is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    struct Shareholder {
        uint amountClaimed;
    }

    mapping (uint => Shareholder) public shareholderToOwnership;
    mapping (uint => uint) public projectToRevenue;

    constructor() ERC1155("invalid url") {}


    function createProject() public returns (uint) {
      uint currentId = _tokenIds.current();
      _tokenIds.increment();
      return currentId;
    }
    
    function claim(uint tokenId) external {
        uint share = balanceOf(msg.sender, tokenId);
        uint revenue = projectToRevenue[tokenId];

        uint revenueToClaim = (revenue * (share / 100)) - shareholder.amountClaimed;
        
        (bool success, ) = msg.sender.call{value: share}("");
        require(success, "Transaction failed");

        shareholder.amountClaimed += share;
    }
}