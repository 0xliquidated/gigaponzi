export const CONTRACTS = {
    MonDust: {
      address: "0x68ebb5EdDedd567e4721154d9092B474D7080940",
      abi: [
        "function balanceOf(address account) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)"
      ]
    },
    MonGems: {
      address: "0x1827bDeDA998e6250B05ced369862D0553Ee53C0",
      abi: [
        "function balanceOf(address account) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)"
      ]
    },
    MonStaking: {
      address: "0x5D1C457Fbb301D0dE6Bf70D3B7743cC2eFCf016F",
      abi: [
        "function stake() payable",
        "function withdraw(uint256 amount)",
        "function claimRewards()",
        "function stakedAmount(address) view returns (uint256)",
        "function getPendingRewards(address) view returns (uint256)"
      ]
    },
    SwapHelper: {
      address: "0x0037aD1E5Cabd6a80bCc00778F0f3CAe626e1669", // New address
      abi: [
        "function swapDustForGems(uint256 dustAmount, uint256 minGems)",
        "function swapGemsForDust(uint256 gemAmount, uint256 minDust)"
      ]
    }
  };
  
  export const NETWORK = {
    chainId: "0x279f", // 10143 in hex
    chainName: "Monad Testnet",
    rpcUrls: ["https://testnet-rpc.monad.xyz/"],
    nativeCurrency: {
      name: "MON",
      symbol: "MON",
      decimals: 18
    }
  };