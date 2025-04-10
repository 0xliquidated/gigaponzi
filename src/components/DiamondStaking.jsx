import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function DiamondStaking({ contracts, account }) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [staked, setStaked] = useState('0');
  const [rewards, setRewards] = useState('0');
  const [diamondBalance, setDiamondBalance] = useState('0');

  useEffect(() => {
    if (contracts.DiamondRewarder && contracts.MonDiamond) {
      updateStats();
      const interval = setInterval(updateStats, 5000);
      return () => clearInterval(interval);
    }
  }, [contracts]);

  const updateStats = async () => {
    try {
      const stakedAmount = await contracts.DiamondRewarder.stakedAmount(account);
      const pendingRewards = await contracts.DiamondRewarder.getPendingRewards(account);
      const balance = await contracts.MonDiamond.balanceOf(account);
      setStaked(ethers.utils.formatEther(stakedAmount));
      setRewards(ethers.utils.formatEther(pendingRewards));
      setDiamondBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("💎 MDIAMOND stats update failed:", error);
    }
  };

  const setStakePercentage = (percentage) => {
    const balance = parseFloat(diamondBalance);
    const amount = (balance * percentage) / 100;
    setStakeAmount(amount.toFixed(2));
  };

  const stakeDiamond = async () => {
    try {
      const amount = ethers.utils.parseEther(stakeAmount);
      console.log("Staking 💎 MDIAMOND:", stakeAmount);
      await contracts.MonDiamond.approve(contracts.DiamondRewarder.address, amount);
      const tx = await contracts.DiamondRewarder.stake(amount);
      console.log("💎 MDIAMOND stake tx hash:", tx.hash);
      await tx.wait();
      setStakeAmount('');
      updateStats();
    } catch (error) {
      console.error("💎 MDIAMOND stake failed:", error);
    }
  };

  const unstakeDiamond = async () => {
    try {
      console.log("Unstaking 💎 MDIAMOND:", staked);
      const tx = await contracts.DiamondRewarder.unstake(ethers.utils.parseEther(staked));
      console.log("💎 MDIAMOND unstake tx hash:", tx.hash);
      await tx.wait();
      updateStats();
    } catch (error) {
      console.error("💎 MDIAMOND unstake failed:", error);
    }
  };

  const claimRewards = async () => {
    try {
      console.log("Claiming 💎 MDIAMOND rewards...");
      const tx = await contracts.DiamondRewarder.claimRewards();
      console.log("💎 MDIAMOND claim tx hash:", tx.hash);
      await tx.wait();
      updateStats();
    } catch (error) {
      console.error("💎 MDIAMOND claim failed:", error);
    }
  };

  return (
    <div className="diamond-staking-container">
      <div className="card diamond-staking-card">
        <h2>Diamond Staking</h2>
        <div className="stats">
          <p>Staked 💎 MDIAMOND: {parseFloat(staked).toFixed(2)}</p>
          <p>Pending Rewards: {parseFloat(rewards).toFixed(2)} 🧹 MDUST</p>
        </div>
        <input
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          placeholder="Amount in 💎 MDIAMOND"
        />
        <div className="percentage-buttons">
          <button onClick={() => setStakePercentage(100)}>100%</button>
        </div>
        <div className="button-group">
          <button onClick={stakeDiamond}>Stake 💎 MDIAMOND</button>
          <button onClick={unstakeDiamond}>Unstake All</button>
          <button onClick={claimRewards}>Claim 🧹 MDUST</button>
        </div>
      </div>
    </div>
  );
}

export default DiamondStaking;