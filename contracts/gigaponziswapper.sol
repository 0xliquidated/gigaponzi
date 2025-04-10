// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapHelper {
    IUniswapV2Router02 public uniswapRouter;
    address public monDust;
    address public monGems;
    
    constructor(address _router, address _monDust, address _monGems) {
        uniswapRouter = IUniswapV2Router02(_router);
        monDust = _monDust;
        monGems = _monGems;
    }
    
    function swapDustForGems(uint256 dustAmount, uint256 minGems) external {
        IERC20(monDust).transferFrom(msg.sender, address(this), dustAmount);
        IERC20(monDust).approve(address(uniswapRouter), dustAmount);
        
        address[] memory path = new address[](2);
        path[0] = monDust;
        path[1] = monGems;
        
        uniswapRouter.swapExactTokensForTokens(
            dustAmount,
            minGems,
            path,
            msg.sender,
            block.timestamp
        );
    }
    
    function swapGemsForDust(uint256 gemAmount, uint256 minDust) external {
        IERC20(monGems).transferFrom(msg.sender, address(this), gemAmount);
        IERC20(monGems).approve(address(uniswapRouter), gemAmount);
        
        address[] memory path = new address[](2);
        path[0] = monGems;
        path[1] = monDust;
        
        uniswapRouter.swapExactTokensForTokens(
            gemAmount,
            minDust,
            path,
            msg.sender,
            block.timestamp
        );
    }
}