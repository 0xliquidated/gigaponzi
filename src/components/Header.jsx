function Header({ account, connectWallet, disconnectWallet }) {
    return (
      <header className="header">
        <h1>Gigaponzi</h1>
        <div className="wallet">
          {account ? (
            <>
              <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
              <button onClick={disconnectWallet}>Disconnect</button>
            </>
          ) : (
            <button onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
      </header>
    );
  }
  
  export default Header;