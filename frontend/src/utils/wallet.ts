import { ethers } from 'ethers';

export type Web3Provider = ethers.BrowserProvider;

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