import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function Staking({ contracts, provider, account }) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [staked, setStaked] = useState('0');
  const [rewards, setRewards] = useState('0');

  useEffect(() => {
    if (contracts.MonStaking) {
      updateStats();
      const interval = setInterval(updateStats, 5000); // Update every 5s
      return () => clearInterval(interval);
    }
  }, [contracts]);

  const updateStats = async () => {
    try {
      const stakedAmount = await contracts.MonStaking.stakedAmount(account);
      const pendingRewards = await contracts.MonStaking.getPendingRewards(account);
      console.log("Staked:", ethers.utils.formatEther(stakedAmount), "Pending Rewards:", ethers.utils.formatEther(pendingRewards));
      setStaked(ethers.utils.formatEther(stakedAmount));
      setRewards(ethers.utils.formatEther(pendingRewards));
    } catch (error) {
      console.error("Update stats failed:", error);
    }
  };

  const stake = async () => {
    try {
      console.log("Staking:", stakeAmount, "MON");
      const tx = await contracts.MonStaking.stake({
        value: ethers.utils.parseEther(stakeAmount)
      });
      console.log("Stake tx hash:", tx.hash);
      await tx.wait();
      console.log("Stake confirmed");
      setStakeAmount('');
      updateStats();
    } catch (error) {
      console.error("Stake failed:", error);
    }
  };

  const withdraw = async () => {
    try {
      console.log("Withdrawing:", staked, "MON");
      const tx = await contracts.MonStaking.withdraw(ethers.utils.parseEther(staked));
      console.log("Withdraw tx hash:", tx.hash);
      await tx.wait();
      console.log("Withdraw confirmed");
      updateStats();
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };

  const claim = async () => {
    try {
      console.log("Claiming rewards...");
      const tx = await contracts.MonStaking.claimRewards();
      console.log("Claim tx hash:", tx.hash);
      await tx.wait();
      const dustBalance = await contracts.MonDust.balanceOf(account);
      console.log("MDUST balance after claim:", ethers.utils.formatEther(dustBalance));
      updateStats();
    } catch (error) {
      console.error("Claim failed:", error.message, error);
    }
  };

  return (
    <div className="card">
      <h2>Staking</h2>
      <div className="stats">
        <p>Staked MON: {parseFloat(staked).toFixed(2)}</p>
        <p>Pending Rewards: {parseFloat(rewards).toFixed(2)} MDUST</p>
      </div>
      <input
        type="number"
        value={stakeAmount}
        onChange={(e) => setStakeAmount(e.target.value)}
        placeholder="Amount in MON"
      />
      <div className="button-group">
        <button onClick={stake}>Stake</button>
        <button onClick={withdraw}>Withdraw All</button>
        <button onClick={claim}>Claim Rewards</button>
      </div>
    </div>
  );
}

export default Staking;