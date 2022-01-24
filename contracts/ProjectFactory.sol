// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./Playground.sol";

// Playground is for creating a Project contract for our users
contract ProjectFactory {
    function createProject(
        string calldata title,
        address[] memory shareholders,
        uint256[] memory shareAmounts
    ) external returns (address) {
        require(shareholders.length == shareAmounts.length, "invalid param");

        uint256 shareSum = 0;
        for (uint256 i = 0; i < shareAmounts.length; i++) {
            shareSum += shareAmounts[i];
        }
        require(shareSum == 100, "sum of shares should be 100");

        Playground prj = new Playground(title);
        for (uint256 i = 0; i < shareholders.length; i++) {
            prj.mint(shareholders[i], shareAmounts[i]);
        }

        return address(prj);
    }
}
