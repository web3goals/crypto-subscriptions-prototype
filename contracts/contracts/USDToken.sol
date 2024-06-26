// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDToken is ERC20 {
    constructor() ERC20("USDToken", "USDT") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}
