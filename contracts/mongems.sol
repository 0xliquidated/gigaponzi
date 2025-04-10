// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MonGems is ERC20 {
    uint256 public constant MAX_SUPPLY = 21000000 * 10**18; // 21M with 18 decimals
    uint256 public constant INITIAL_SUPPLY = 5000000 * 10**18; // 5M initial
    
    constructor() ERC20("MonGems", "MGEM") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    function mint(address to, uint256 amount) public {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}