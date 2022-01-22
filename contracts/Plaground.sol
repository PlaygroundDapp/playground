//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Playground is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter public _tokenIds;
    mapping(uint256 => uint256) public shares; // tokenId => share amount
    mapping(uint256 => uint256) amountsClaimed; //token id => amounts claimed
    uint256 public totalShares = 100;
    uint256 currentlyIssuedShares;
    uint256 totalDepositedAmount;

    constructor() ERC721("Playground", "PG") {}

    function mint(address _to, uint256 _share)
        public
        onlyOwner
        returns (uint256)
    {
        require(currentlyIssuedShares + _share <= totalShares);
        uint256 tokenId = _tokenIds.current();
        _safeMint(_to, tokenId);
        shares[tokenId] = _share;
        _tokenIds.increment();
        currentlyIssuedShares += _share;
        return tokenId;
    }

    modifier positiveAmount(uint256 _amount) {
        if (_amount == 0) {
            revert("Amount should be bigger than 0");
        }
        _;
    }

    function deposit(uint256 _amount) external payable positiveAmount(_amount) {
        totalDepositedAmount += _amount;
    }

    function claim(uint256 _tokenId) external {
        require(
            ownerOf(_tokenId) == msg.sender,
            "You are not the owner of this token."
        );
        uint256 amountDeserved = (totalDepositedAmount * shares[_tokenId]) /
            totalShares;
        uint256 amountToSend = amountDeserved - amountsClaimed[_tokenId];

        require(amountToSend > 0, "You dont deserve shit.");

        (bool success, ) = msg.sender.call{value: amountToSend}("Be rich");
        if (!success) {
            revert("Claim failed");
        }
        amountsClaimed[_tokenId] += amountToSend;
    }
}
