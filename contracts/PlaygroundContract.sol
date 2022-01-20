// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract PlaygroundContract {
    struct Shareholder {
        uint ownership;
        uint amountClaimed;
    }

    mapping (address => Shareholder) public shareholderToOwnership;
    uint totalRevenue;

    function claim() public {
        Shareholder storage shareholder = shareholderToOwnership[msg.sender];

        uint share = (totalRevenue * (shareholder.ownership / 100)) - shareholder.amountClaimed;
        
        (bool success, ) = msg.sender.call{value: share}("");
        require(success, "Transaction failed");

        shareholder.amountClaimed += share;
    }
}
