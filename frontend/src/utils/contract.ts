import { ethers } from 'ethers';
import { oracleABI } from './contracts/oracleContract';

export const contractAddress = '0x23A6517Bc37195fEc7D2cD655398aE5E1515bd24';

export type Web3Provider = ethers.BrowserProvider;
export type Contract = ethers.Contract;

export const connectWallet = async (): Promise<{
  provider: Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
}> => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      let provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const desiredChainId = '0xaa36a7';
      const network = await provider.getNetwork();

      if (network.chainId !== BigInt(desiredChainId)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: desiredChainId }],
          });
          // Re-instantiate the provider after a network switch
          provider = new ethers.BrowserProvider(window.ethereum);
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            console.error('Please add the Sepolia testnet to your wallet.');
          } else {
            console.error('Failed to switch network:', switchError);
          }
          return { provider: null, signer: null, account: null };
        }
      }

      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      return { provider, signer, account };
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      return { provider: null, signer: null, account: null };
    }
  } else {
    console.log('MetaMask is not installed');
    return { provider: null, signer: null, account: null };
  }
};

export const getReadOnlyContract = (
  contractAddress: string,
  provider: ethers.BrowserProvider
): ethers.Contract | null => {
  if (!contractAddress || !provider) return null;

  try {
    return new ethers.Contract(contractAddress, oracleABI, provider);
  } catch (error) {
    console.error('Error getting read-only contract:', error);
    return null;
  }
};

// Get a contract instance that can perform write operations
export const getSigningContract = (
  contractAddress: string,
  signer: ethers.Signer
): ethers.Contract | null => {
  if (!contractAddress || !signer) return null;

  try {
    return new ethers.Contract(contractAddress, oracleABI, signer);
  } catch (error) {
    console.error('Error getting signing contract:', error);
    return null;
  }
};
