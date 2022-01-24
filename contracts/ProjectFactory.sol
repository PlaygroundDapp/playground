// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Playground.sol";

// Playground is for creating a Project contract for our users
contract ProjectFactory {
    function createProject(
        string calldata name,
        string calldata symbol,
        address[] memory shareholders,
        uint256[] memory shareAmounts
    ) external returns (address) {
        require(shareholders.length == shareAmounts.length, "invalid param");

        uint256 shareSum = 0;
        for (uint256 i = 0; i < shareAmounts.length; i++) {
            shareSum += shareAmounts[i];
        }
        require(shareSum == 100, "sum of shares should be 100");

        Playground prj = new Playground(name, symbol);
        for (uint256 i = 0; i < shareholders.length; i++) {
            prj.mint(shareholders[i], shareAmounts[i]);
        }

        return address(prj);
    }
}
