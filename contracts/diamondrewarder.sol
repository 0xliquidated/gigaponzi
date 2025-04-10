// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IMonDust is IERC20 {
    function mint(address to, uint256 amount) external;
}

interface IMonDiamond is IERC20 {}

contract DiamondRewarder is ReentrancyGuard {
    IMonDiamond public monDiamond;
    IMonDust public monDust;

    uint256 public constant REWARD_RATE = 115740740740740740740; // 10,000 MDUST per MDIAMOND per day, scaled to seconds
    uint256 public constant SECONDS_PER_DAY = 86400;

    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public lastUpdate;
    mapping(address => uint256) public accumulatedRewards;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(address _monDiamond, address _monDust) {
        monDiamond = IMonDiamond(_monDiamond);
        monDust = IMonDust(_monDust);
    }

    // Stake MDIAMOND to earn MDUST
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        updateRewards(msg.sender);
        monDiamond.transferFrom(msg.sender, address(this), amount);
        stakedAmount[msg.sender] += amount;
        lastUpdate[msg.sender] = block.timestamp;
        emit Staked(msg.sender, amount);
    }

    // Unstake MDIAMOND
    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(stakedAmount[msg.sender] >= amount, "Insufficient staked amount");
        updateRewards(msg.sender);
        stakedAmount[msg.sender] -= amount;
        monDiamond.transfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    // Claim MDUST rewards
    function claimRewards() external nonReentrant {
        updateRewards(msg.sender);
        uint256 reward = accumulatedRewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        accumulatedRewards[msg.sender] = 0;
        monDust.mint(msg.sender, reward);
        emit RewardsClaimed(msg.sender, reward);
    }

    // Update MDUST rewards
    function updateRewards(address user) internal {
        uint256 timeElapsed = block.timestamp - lastUpdate[user];
        uint256 reward = (stakedAmount[user] * REWARD_RATE * timeElapsed) / 1; // REWARD_RATE is per second
        accumulatedRewards[user] += reward;
        lastUpdate[user] = block.timestamp;
    }

    // View pending MDUST rewards
    function getPendingRewards(address user) external view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastUpdate[user];
        uint256 reward = (stakedAmount[user] * REWARD_RATE * timeElapsed) / 1; // REWARD_RATE is per second
        return accumulatedRewards[user] + reward;
    }
}