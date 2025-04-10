import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function Staking({ contracts, provider, account }) {
  // MON Staking State
  const [monStakeAmount, setMonStakeAmount] = useState('');
  const [monStaked, setMonStaked] = useState('0');
  const [monRewards, setMonRewards] = useState('0');

  // MDUST Staking State
  const [dustStakeAmount, setDustStakeAmount] = useState('');
  const [dustStaked, setDustStaked] = useState('0');
  const [dustRewards, setDustRewards] = useState('0');
  const [dustBalance, setDustBalance] = useState('0'); // Added to track MDUST balance

  // MDUST Burning State
  const [dustBurnAmount, setDustBurnAmount] = useState('');

  useEffect(() => {
    if (contracts.MonStaking && contracts.DustRewarder && contracts.MonDust) {
      updateMonStats();
      updateDustStats();
      const interval = setInterval(() => {
        updateMonStats();
        updateDustStats();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [contracts]);

  const updateMonStats = async () => {
    try {
      const stakedAmount = await contracts.MonStaking.stakedAmount(account);
      const pendingRewards = await contracts.MonStaking.getPendingRewards(account);
      setMonStaked(ethers.utils.formatEther(stakedAmount));
      setMonRewards(ethers.utils.formatEther(pendingRewards));
    } catch (error) {
      console.error("MON stats update failed:", error);
    }
  };

  const updateDustStats = async () => {
    try {
      const stakedAmount = await contracts.DustRewarder.stakedAmount(account);
      const pendingRewards = await contracts.DustRewarder.getPendingRewards(account);
      const balance = await contracts.MonDust.balanceOf(account);
      setDustStaked(ethers.utils.formatEther(stakedAmount));
      setDustRewards(ethers.utils.formatEther(pendingRewards));
      setDustBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("🧹 MDUST stats update failed:", error);
    }
  };

  // MON Staking Functions
  const stakeMon = async () => {
    try {
      console.log("Staking MON:", monStakeAmount);
      const tx = await contracts.MonStaking.stake({ value: ethers.utils.parseEther(monStakeAmount) });
      console.log("MON stake tx hash:", tx.hash);
      await tx.wait();
      setMonStakeAmount('');
      updateMonStats();
    } catch (error) {
      console.error("MON stake failed:", error);
    }
  };

  const withdrawMon = async () => {
    try {
      console.log("Withdrawing MON:", monStaked);
      const tx = await contracts.MonStaking.withdraw(ethers.utils.parseEther(monStaked));
      console.log("MON withdraw tx hash:", tx.hash);
      await tx.wait();
      updateMonStats();
    } catch (error) {
      console.error("MON withdraw failed:", error);
    }
  };

  const claimMonRewards = async () => {
    try {
      console.log("Claiming MON rewards...");
      const tx = await contracts.MonStaking.claimRewards();
      console.log("MON claim tx hash:", tx.hash);
      await tx.wait();
      updateMonStats();
    } catch (error) {
      console.error("MON claim failed:", error);
    }
  };

  // MDUST Staking Functions
  const setDustStakePercentage = (percentage) => {
    const balance = parseFloat(dustBalance);
    const amount = (balance * percentage) / 100;
    setDustStakeAmount(amount.toString());
  };

  const stakeDust = async () => {
    try {
      const amount = ethers.utils.parseEther(dustStakeAmount);
      console.log("Staking 🧹 MDUST:", dustStakeAmount);
      await contracts.MonDust.approve(contracts.DustRewarder.address, amount);
      const tx = await contracts.DustRewarder.stake(amount);
      console.log("🧹 MDUST stake tx hash:", tx.hash);
      await tx.wait();
      setDustStakeAmount('');
      updateDustStats();
    } catch (error) {
      console.error("🧹 MDUST stake failed:", error);
    }
  };

  const unstakeDust = async () => {
    try {
      console.log("Unstaking 🧹 MDUST:", dustStaked);
      const tx = await contracts.DustRewarder.unstake(ethers.utils.parseEther(dustStaked));
      console.log("🧹 MDUST unstake tx hash:", tx.hash);
      await tx.wait();
      updateDustStats();
    } catch (error) {
      console.error("🧹 MDUST unstake failed:", error);
    }
  };

  const claimDustRewards = async () => {
    try {
      console.log("Claiming 🧹 MDUST rewards...");
      const tx = await contracts.DustRewarder.claimRewards();
      console.log("🧹 MDUST claim tx hash:", tx.hash);
      await tx.wait();
      updateDustStats();
    } catch (error) {
      console.error("🧹 MDUST claim failed:", error);
    }
  };

  // MDUST Burning Functions
  const setBurnAmount = (billions) => {
    const amount = billions * 1000000000; // Convert billions to token units
    setDustBurnAmount(amount.toString());
  };

  const burnDust = async () => {
    try {
      const amount = ethers.utils.parseEther(dustBurnAmount);
      console.log("Burning 🧹 MDUST:", dustBurnAmount);
      await contracts.MonDust.approve(contracts.DustRewarder.address, amount);
      const tx = await contracts.DustRewarder.burnForDiamond(amount);
      console.log("🧹 MDUST burn tx hash:", tx.hash);
      await tx.wait();
      setDustBurnAmount('');
      updateDustStats();
    } catch (error) {
      console.error("🧹 MDUST burn failed:", error);
    }
  };

  return (
    <div className="card">
      <h2>Staking</h2>
      <div className="stats">
        <p>Staked MON: {parseFloat(monStaked).toFixed(2)}</p>
        <p>Pending Rewards: {parseFloat(monRewards).toFixed(2)} 🧹 MDUST</p>
      </div>
      <input
        type="number"
        value={monStakeAmount}
        onChange={(e) => setMonStakeAmount(e.target.value)}
        placeholder="Amount in MON"
      />
      <div className="button-group">
        <button onClick={stakeMon}>Stake</button>
        <button onClick={withdrawMon}>Withdraw All</button>
        <button onClick={claimMonRewards}>Claim Rewards</button>
      </div>

      <hr className="separator" />
      <h2>Ponziiiiii</h2>

      <div className="stats">
        <p>Staked 🧹 MDUST: {parseFloat(dustStaked).toFixed(2)}</p>
        <p>Pending ⛏️ MGEM Rewards: {parseFloat(dustRewards).toFixed(2)}</p>
      </div>
      <input
        type="number"
        value={dustStakeAmount}
        onChange={(e) => setDustStakeAmount(e.target.value)}
        placeholder="Amount in 🧹 MDUST"
      />
      <div className="percentage-buttons">
        <button onClick={() => setDustStakePercentage(100)}>100%</button>
      </div>
      <div className="button-group">
        <button onClick={stakeDust}>Stake 🧹 MDUST</button>
        <button onClick={unstakeDust}>Unstake All</button>
        <button onClick={claimDustRewards}>Claim ⛏️ MGEM</button>
      </div>

      <input
        type="number"
        value={dustBurnAmount}
        onChange={(e) => setDustBurnAmount(e.target.value)}
        placeholder="🧹 MDUST to Burn (min 1B)"
      />
      <div className="percentage-buttons">
        <button onClick={() => setBurnAmount(1)}>1B</button>
        <button onClick={() => setBurnAmount(2)}>2B</button>
        <button onClick={() => setBurnAmount(3)}>3B</button>
      </div>
      <div className="button-group">
        <button onClick={burnDust}>Burn for 💎 MDIAMOND</button>
      </div>
    </div>
  );
}

export default Staking;