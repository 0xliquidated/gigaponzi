// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IMonGems is IERC20 {
    function mint(address to, uint256 amount) external;
}

interface IMonDiamond is IERC20 {
    function mint(address to, uint256 amount) external;
}

contract DustRewarder is ReentrancyGuard {
    IERC20 public monDust; // Changed to IERC20 since no burn function
    IMonGems public monGems;
    IMonDiamond public monDiamond;

    uint256 public constant STAKING_APR = 1000; // 1000% APR for MGEM rewards
    uint256 public constant SECONDS_PER_YEAR = 31536000;
    uint256 public constant MDIAMOND_MAX_SUPPLY = 21_000_000_000 * 10**18; // 21 billion MDIAMOND
    uint256 public constant MDUST_BURN_RATE = 1_000_000_000 * 10**18; // 1 billion MDUST
    uint256 public constant MDIAMOND_MINT_RATE = 100 * 10**18; // 100 MDIAMOND
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD; // Standard burn address

    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public lastUpdate;
    mapping(address => uint256) public accumulatedRewards;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event Burned(address indexed user, uint256 dustAmount, uint256 diamondAmount);

    constructor(address _monDust, address _monGems, address _monDiamond) {
        monDust = IERC20(_monDust);
        monGems = IMonGems(_monGems);
        monDiamond = IMonDiamond(_monDiamond);
    }

    // Stake MDUST to earn MGEM
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        updateRewards(msg.sender);
        monDust.transferFrom(msg.sender, address(this), amount);
        stakedAmount[msg.sender] += amount;
        lastUpdate[msg.sender] = block.timestamp;
        emit Staked(msg.sender, amount);
    }

    // Unstake MDUST
    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(stakedAmount[msg.sender] >= amount, "Insufficient staked amount");
        updateRewards(msg.sender);
        stakedAmount[msg.sender] -= amount;
        monDust.transfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    // Claim MGEM rewards
    function claimRewards() external nonReentrant {
        updateRewards(msg.sender);
        uint256 reward = accumulatedRewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        accumulatedRewards[msg.sender] = 0;
        monGems.mint(msg.sender, reward);
        emit RewardsClaimed(msg.sender, reward);
    }

    // "Burn" MDUST by sending to BURN_ADDRESS to mint MDIAMOND
    function burnForDiamond(uint256 dustAmount) external nonReentrant {
        require(dustAmount >= MDUST_BURN_RATE, "Minimum 1 billion MDUST required");
        require(dustAmount % MDUST_BURN_RATE == 0, "Amount must be multiple of 1 billion MDUST");

        uint256 diamondAmount = (dustAmount / MDUST_BURN_RATE) * MDIAMOND_MINT_RATE;
        uint256 totalSupply = monDiamond.totalSupply();
        require(totalSupply + diamondAmount <= MDIAMOND_MAX_SUPPLY, "Exceeds MDIAMOND max supply");

        monDust.transferFrom(msg.sender, address(this), dustAmount);
        monDust.transfer(BURN_ADDRESS, dustAmount); // Send to burn address instead of burning
        monDiamond.mint(msg.sender, diamondAmount);
        emit Burned(msg.sender, dustAmount, diamondAmount);
    }

    // Update MGEM rewards
    function updateRewards(address user) internal {
        uint256 timeElapsed = block.timestamp - lastUpdate[user];
        uint256 reward = (stakedAmount[user] * STAKING_APR * timeElapsed) / (100 * SECONDS_PER_YEAR);
        accumulatedRewards[user] += reward;
        lastUpdate[user] = block.timestamp;
    }

    // View pending MGEM rewards
    function getPendingRewards(address user) external view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastUpdate[user];
        uint256 reward = (stakedAmount[user] * STAKING_APR * timeElapsed) / (100 * SECONDS_PER_YEAR);
        return accumulatedRewards[user] + reward;
    }
}