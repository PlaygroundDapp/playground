// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./Project.sol";

// Playground is for creating a Project contract for our users
contract Playground {
    function createProject(
        string calldata title,
        address[] calldata shareholders,
        uint256 someOtherData
    ) external returns (address) {
        Project prj = new Project(title, shareholders, someOtherData);
        return address(prj);
    }
}
