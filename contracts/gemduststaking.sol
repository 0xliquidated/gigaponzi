// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./mondust.sol";

contract MonStaking is ReentrancyGuard {
    MonDust public monDust;
    uint256 public constant APR = 10000000000000000000000; // 10,000,000,000,000,000,000,000% APR
    uint256 public constant SECONDS_PER_YEAR = 31536000;

    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public lastUpdate;
    mapping(address => uint256) public accumulatedRewards;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(address _monDust) {
        monDust = MonDust(_monDust);
    }

    function stake() external payable nonReentrant {
        updateRewards(msg.sender);
        stakedAmount[msg.sender] += msg.value;
        lastUpdate[msg.sender] = block.timestamp;
        emit Staked(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(stakedAmount[msg.sender] >= amount, "Insufficient staked amount");
        updateRewards(msg.sender);
        stakedAmount[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }

    function claimRewards() external nonReentrant {
        updateRewards(msg.sender);
        uint256 reward = accumulatedRewards[msg.sender];
        if (reward > 0) {
            accumulatedRewards[msg.sender] = 0;
            monDust.mint(msg.sender, reward);
            emit RewardsClaimed(msg.sender, reward);
        }
    }

    function updateRewards(address user) internal {
        uint256 timeElapsed = block.timestamp - lastUpdate[user];
        uint256 reward = (stakedAmount[user] * APR * timeElapsed) / (100 * SECONDS_PER_YEAR);
        accumulatedRewards[user] += reward;
        lastUpdate[user] = block.timestamp;
    }

    function getPendingRewards(address user) external view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastUpdate[user];
        uint256 reward = (stakedAmount[user] * APR * timeElapsed) / (100 * SECONDS_PER_YEAR);
        return accumulatedRewards[user] + reward;
    }
}