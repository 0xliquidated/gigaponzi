// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MonDiamond is ERC20 {
    uint256 public constant MAX_SUPPLY = 21_000_000_000 * 10**18; // 21 billion

    constructor() ERC20("MonDiamond", "MDIAMOND") {}

    function mint(address to, uint256 amount) public {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}