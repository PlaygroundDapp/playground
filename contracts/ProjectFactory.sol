// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Playground.sol";

contract ProjectFactory {
    event ProjectCreated(address _address, string _name, string _symbol);

    function createProject(
        string calldata name,
        string calldata symbol,
        address[] calldata shareholders,
        uint256[] calldata shareAmounts
    ) external returns (address) {
        Playground prj = new Playground(
            name,
            symbol,
            shareholders,
            shareAmounts
        );
        emit ProjectCreated(address(prj), name, symbol);
        return address(prj);
    }
}
