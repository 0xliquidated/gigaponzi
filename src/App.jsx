import { useState } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import Staking from './components/Staking';
import Swap from './components/Swap';
import Stats from './components/Stats';
import DiamondStaking from './components/DiamondStaking';
import { CONTRACTS, NETWORK } from './contracts';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState({});

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      console.log("Requesting accounts...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      console.log("Accounts connected, switching network...");
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [NETWORK]
      });
      console.log("Network switched, getting signer...");
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log("Signer address:", address);
      setProvider(provider);
      setSigner(signer);
      setAccount(address);

      console.log("Initializing contracts...");
      const contractInstances = {};
      for (const [name, { address, abi }] of Object.entries(CONTRACTS)) {
        console.log(`Initializing ${name} at ${address}`);
        contractInstances[name] = new ethers.Contract(address, abi, signer);
      }
      setContracts(contractInstances);
      console.log("Contracts initialized:", contractInstances);
    } catch (error) {
      console.error("Connection failed:", error.message, error.code, error);
      alert(`Failed to connect wallet: ${error.message}. Check console for details.`);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setContracts({});
  };

  return (
    <div className="app">
      <Header 
        account={account} 
        connectWallet={connectWallet} 
        disconnectWallet={disconnectWallet} 
      />
      <main className="container">
        {account ? (
          <>
            <Stats contracts={contracts} account={account} />
            <div className="grid">
              <Staking contracts={contracts} provider={provider} account={account} />
              <Swap contracts={contracts} account={account} />
            </div>
            <DiamondStaking contracts={contracts} account={account} />
          </>
        ) : (
          <div className="welcome">
            <h2>Welcome to Gigaponzi</h2>
            <p>Connect your wallet to start staking and swapping!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;