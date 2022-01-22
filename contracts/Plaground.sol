//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Playground is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter public _tokenIds;
    mapping(uint => uint) shares; // tokenId => share amount
    uint totalShares;

    constructor() ERC721('Playground', 'PG') {}

    function mint(uint _share, address _to) public onlyOwner returns(uint256){
        require(totalShares + _share <= 100);
        uint tokenId = _tokenIds.current();
        _safeMint(_to, tokenId);
        shares[tokenId] = _share;
        _tokenIds.increment();
        totalShares += _share;
        return tokenId;
    }

    
}