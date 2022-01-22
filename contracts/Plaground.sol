//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Playground is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    struct Project {
        address owner;
        string name;
    }

    mapping (uint => Project ) projects;

    mapping (uint256 => mapping(address => uint256)) internal claims;
    mapping (uint256 => uint256) internal projectToRevenue;

    constructor() ERC1155("invalid url") {}


    function createProject(string memory _name) public returns (uint) {
      uint currentId = _tokenIds.current();
      projects[currentId] = Project(msg.sender, _name);
      _tokenIds.increment();
      return currentId;
    }
    
    
    function claim(uint _tokenId) external {
        uint256 share = balanceOf(msg.sender, _tokenId);
        uint256 revenue = projectToRevenue[_tokenId];
        uint256 amountClaimed = claims[_tokenId][msg.sender];
        uint256 revenueToClaim = (revenue * (share / 100)) - amountClaimed;
        
        (bool success, ) = msg.sender.call{value: revenueToClaim}("");
        require(success, "Transaction failed");

        claims[_tokenId][msg.sender] = claims[_tokenId][msg.sender] + revenueToClaim;
    }
}