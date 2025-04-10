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
    address: "0x0037aD1E5Cabd6a80bCc00778F0f3CAe626e1669",
    abi: [
      "function swapDustForGems(uint256 dustAmount, uint256 minGems)",
      "function swapGemsForDust(uint256 gemAmount, uint256 minDust)"
    ]
  },
  MonDiamond: {
    address: "0xBA10d0020Bb721f1F3842DB8ae455FE7303a2d47",
    abi: [
      "function balanceOf(address account) view returns (uint256)",
      "function totalSupply() view returns (uint256)"
    ]
  },
  DustRewarder: {
    address: "0xfB55cBf612352C7546e979d45d5b9E4a5DbA18d1",
    abi: [
      "function stake(uint256 amount)",
      "function unstake(uint256 amount)",
      "function claimRewards()",
      "function burnForDiamond(uint256 dustAmount)",
      "function stakedAmount(address) view returns (uint256)",
      "function getPendingRewards(address) view returns (uint256)"
    ]
  },
  DiamondRewarder: {
    address: "0xf72e0cE1872B4137Ccb92F1cf2474205b5Aeb6e1",
    abi: [
      "function stake(uint256 amount)",
      "function unstake(uint256 amount)",
      "function claimRewards()",
      "function stakedAmount(address) view returns (uint256)",
      "function getPendingRewards(address) view returns (uint256)"
    ]
  }
};

export const NETWORK = {
  chainId: "0x279f",
  chainName: "Monad Testnet",
  rpcUrls: ["https://testnet-rpc.monad.xyz/"],
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18
  }
};