import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function Swap({ contracts, account }) {
  const [dustAmount, setDustAmount] = useState('');
  const [gemAmount, setGemAmount] = useState('');
  const [dustBalance, setDustBalance] = useState('0');
  const [gemBalance, setGemBalance] = useState('0');

  useEffect(() => {
    if (contracts.MonDust && contracts.MonGems) {
      updateBalances();
    }
  }, [contracts]);

  const updateBalances = async () => {
    try {
      const dust = await contracts.MonDust.balanceOf(account);
      const gems = await contracts.MonGems.balanceOf(account);
      console.log("MDUST balance:", ethers.utils.formatEther(dust), "MGEM balance:", ethers.utils.formatEther(gems));
      setDustBalance(ethers.utils.formatEther(dust));
      setGemBalance(ethers.utils.formatEther(gems));
    } catch (error) {
      console.error("Balance update failed:", error);
    }
  };

  const checkAllowance = async (tokenContract, amount) => {
    const allowance = await tokenContract.allowance(account, contracts.SwapHelper.address);
    return allowance.gte(amount);
  };

  const approveDust = async (amount) => {
    console.log("Approving MDUST:", ethers.utils.formatEther(amount));
    const approveTx = await contracts.MonDust.approve(contracts.SwapHelper.address, amount);
    console.log("Approve tx hash:", approveTx.hash);
    await approveTx.wait();
    console.log("MDUST approval confirmed");
  };

  const swapDustToGems = async (amount) => {
    console.log("Swapping MDUST to MGEM...");
    const swapTx = await contracts.SwapHelper.swapDustForGems(amount, 0);
    console.log("Swap tx hash:", swapTx.hash);
    await swapTx.wait();
    console.log("Swap confirmed");
  };

  const approveAndSwapDust = async () => {
    try {
      const amount = ethers.utils.parseEther(dustAmount);
      const hasAllowance = await checkAllowance(contracts.MonDust, amount);

      if (!hasAllowance) {
        await approveDust(amount);
      } else {
        console.log("Allowance already sufficient for MDUST");
      }

      await swapDustToGems(amount);
      setDustAmount('');
      updateBalances();
    } catch (error) {
      console.error("Swap to MGEM failed:", error.message, error);
      alert(`Swap to MGEM failed: ${error.message}. Check console.`);
    }
  };

  const approveGems = async (amount) => {
    console.log("Approving MGEM:", ethers.utils.formatEther(amount));
    const approveTx = await contracts.MonGems.approve(contracts.SwapHelper.address, amount);
    console.log("Approve tx hash:", approveTx.hash);
    await approveTx.wait();
    console.log("MGEM approval confirmed");
  };

  const swapGemsToDust = async (amount) => {
    console.log("Swapping MGEM to MDUST...");
    const swapTx = await contracts.SwapHelper.swapGemsForDust(amount, 0);
    console.log("Swap tx hash:", swapTx.hash);
    await swapTx.wait();
    console.log("Swap confirmed");
  };

  const approveAndSwapGems = async () => {
    try {
      const amount = ethers.utils.parseEther(gemAmount);
      const hasAllowance = await checkAllowance(contracts.MonGems, amount);

      if (!hasAllowance) {
        await approveGems(amount);
      } else {
        console.log("Allowance already sufficient for MGEM");
      }

      await swapGemsToDust(amount);
      setGemAmount('');
      updateBalances();
    } catch (error) {
      console.error("Swap to MDUST failed:", error.message, error);
      alert(`Swap to MDUST failed: ${error.message}. Check console.`);
    }
  };

  return (
    <div className="card">
      <h2>Swap</h2>
      <div className="stats">
        <p>MDUST Balance: {parseFloat(dustBalance).toFixed(2)}</p>
        <p>MGEM Balance: {parseFloat(gemBalance).toFixed(2)}</p>
      </div>
      <div className="swap-section">
        <input
          type="number"
          value={dustAmount}
          onChange={(e) => setDustAmount(e.target.value)}
          placeholder="MDUST Amount"
        />
        <button onClick={approveAndSwapDust}>Swap to MGEM</button>
      </div>
      <div className="swap-section">
        <input
          type="number"
          value={gemAmount}
          onChange={(e) => setGemAmount(e.target.value)}
          placeholder="MGEM Amount"
        />
        <button onClick={approveAndSwapGems}>Swap to MDUST</button>
      </div>
    </div>
  );
}

export default Swap;