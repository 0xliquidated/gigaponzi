import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function Stats({ contracts, account }) {
  const [balances, setBalances] = useState({ mon: '0', dust: '0', gems: '0', diamond: '0' });

  useEffect(() => {
    if (contracts.MonDust && contracts.MonGems && contracts.MonDiamond) {
      updateBalances();
    }
  }, [contracts]);

  const updateBalances = async () => {
    try {
      const provider = contracts.MonDust.provider;
      const mon = await provider.getBalance(account);
      const dust = await contracts.MonDust.balanceOf(account);
      const gems = await contracts.MonGems.balanceOf(account);
      const diamond = await contracts.MonDiamond.balanceOf(account);
      setBalances({
        mon: ethers.utils.formatEther(mon),
        dust: ethers.utils.formatEther(dust),
        gems: ethers.utils.formatEther(gems),
        diamond: ethers.utils.formatEther(diamond)
      });
    } catch (error) {
      console.error("Stats update failed:", error);
    }
  };

  return (
    <div>
      <div className="instructions">
        Instructions: For best experience stake 0.00000000001 MON. Stake MON, earn MDUST. Stake MDUST in the Ponziiiii to earn MGEMS. Swap MGEMS for more MDUST. Then Convert 1 billion MDUST to 100 MDIAMONDS. Stake MDiamonds to earn more DUST.
      </div>
      <div className="stats-card">
        <h2>Your Stats</h2>
        <div className="stats-grid">
          <div>🟣 MON: {parseFloat(balances.mon).toFixed(2)}</div>
          <div>🧹 MDUST: {parseFloat(balances.dust).toFixed(2)}</div>
          <div>⛏️ MGEM: {parseFloat(balances.gems).toFixed(2)}</div>
          <div>💎 MDIAMOND: {parseFloat(balances.diamond).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export default Stats;