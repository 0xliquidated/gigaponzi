import { useState, useEffect } from 'react';
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

  // Initialize wallet connection on page load
  useEffect(() => {
    const initWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts(); // Check if MetaMask has an account
          if (accounts.length > 0) {
            await checkAndSwitchNetwork(provider);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setProvider(provider);
            setSigner(signer);
            setAccount(address);

            const contractInstances = {};
            for (const [name, { address, abi }] of Object.entries(CONTRACTS)) {
              console.log(`Initializing ${name} at ${address}`);
              contractInstances[name] = new ethers.Contract(address, abi, signer);
            }
            setContracts(contractInstances);
            console.log("Contracts initialized:", contractInstances);
          }
        } catch (error) {
          console.error("Failed to initialize wallet on load:", error);
        }
      }
    };

    initWallet();

    // Listen for account or network changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload(); // Reload to recheck network
      });
    }

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', disconnectWallet);
        window.ethereum.removeListener('chainChanged', () => window.location.reload());
      }
    };
  }, []);

  const checkAndSwitchNetwork = async (provider) => {
    const network = await provider.getNetwork();
    if (network.chainId !== parseInt(NETWORK.chainId, 16)) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: NETWORK.chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK],
          });
        } else {
          throw switchError;
        }
      }
    }
  };

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
      await checkAndSwitchNetwork(provider);
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