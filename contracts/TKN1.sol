// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TKN1 is ERC20 {
    constructor() ERC20("Token1", "TKN1") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
