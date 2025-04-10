import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function Stats({ contracts, account }) {
  const [balances, setBalances] = useState({ mon: '0', dust: '0', gems: '0' });

  useEffect(() => {
    if (contracts.MonDust) {
      updateBalances();
    }
  }, [contracts]);

  const updateBalances = async () => {
    const provider = contracts.MonDust.provider;
    const mon = await provider.getBalance(account);
    const dust = await contracts.MonDust.balanceOf(account);
    const gems = await contracts.MonGems.balanceOf(account);
    setBalances({
      mon: ethers.utils.formatEther(mon),
      dust: ethers.utils.formatEther(dust),
      gems: ethers.utils.formatEther(gems)
    });
  };

  return (
    <div className="stats-card">
      <h2>Your Stats</h2>
      <div className="stats-grid">
        <div>MON: {parseFloat(balances.mon).toFixed(2)}</div>
        <div>MDUST: {parseFloat(balances.dust).toFixed(2)}</div>
        <div>MGEM: {parseFloat(balances.gems).toFixed(2)}</div>
      </div>
    </div>
  );
}

export default Stats;