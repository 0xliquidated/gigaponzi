// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MonDust is ERC20 {
    constructor() ERC20("MonDust", "MDUST") {
        _mint(msg.sender, 50000000 * 10**18); // 50M with 18 decimals
    }
    
    // No supply cap - infinite minting possible by owner if needed
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}