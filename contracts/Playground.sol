//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Playground is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter public _tokenIds;

    mapping(uint256 => uint256) public shares; // tokenId => share amount
    mapping(uint256 => uint256) amountsClaimed; //tokenId => amounts claimed

    uint256 private totalDeposit;

    constructor(
        string memory _name,
        string memory _symbol,
        address[] memory shareholders,
        uint256[] memory shareAmounts
    ) ERC721(_name, _symbol) {
        require(
            shareholders.length == shareAmounts.length,
            "size of shareholder and share amount array should be the same."
        );

        uint256 shareSum = 0;
        for (uint256 i = 0; i < shareAmounts.length; i++) {
            require(shareAmounts[i] > 0, "Amount should be bigger than 0");
            shareSum += shareAmounts[i];
        }
        require(shareSum == 100, "sum of shares should be 100");

        for (uint256 i = 0; i < shareholders.length; i++) {
            mint(shareholders[i], shareAmounts[i]);
        }
    }

    event Mint(address _to, uint256 _share);
    event Deposit(uint256 _amount);
    event Claim(address shareHolder, uint256 amountClaimed);

    modifier onlyShareholders() {
        bool isShareholder = false;
        for (uint256 i = 0; i < totalSupply(); i++) {
            if (ownerOf(i) == msg.sender) {
                isShareholder = true;
                break;
            }
        }

        require(
            isShareholder,
            "only shareholders are allowed to access this feature."
        );
        _;
    }

    function mint(address _to, uint256 _share)
        private
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = _tokenIds.current();
        _safeMint(_to, tokenId);
        shares[tokenId] = _share;
        _tokenIds.increment();
        emit Mint(_to, _share);
        return tokenId;
    }

    function deposit() external payable {
        totalDeposit += msg.value;
        emit Deposit(msg.value);
    }

    function totalDepositedAmount()
        external
        view
        onlyShareholders
        returns (uint256)
    {
        return totalDeposit;
    }

    function claimedAmount(uint256 _tokenId) external view onlyShareholders returns (uint256) {
        require(
            ownerOf(_tokenId) == msg.sender,
            "You are not the owner of this token."
        );

        return amountsClaimed[_tokenId];
    }

    function claim(uint256 _tokenId) external onlyShareholders {
        require(
            ownerOf(_tokenId) == msg.sender,
            "You are not the owner of this token."
        );
        uint256 amountDeserved = (totalDeposit * shares[_tokenId]) / 100;
        uint256 amountToSend = amountDeserved - amountsClaimed[_tokenId];

        require(amountToSend > 0, "You dont deserve shit.");
        amountsClaimed[_tokenId] += amountToSend;

        (bool success, ) = msg.sender.call{value: amountToSend}("Be rich");
        if (!success) {
            revert("Claim failed");
        }
        emit Claim(msg.sender, amountToSend);
    }
}
