import { ethers } from 'ethers';

export type Web3Provider = ethers.BrowserProvider;

// Простая детекция мобильного устройства
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Детекция встроенного браузера мобильного кошелька
export const detectMobileWallet = (): string | null => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('trust')) return 'Trust Wallet';
  if (userAgent.includes('metamask')) return 'MetaMask Mobile';
  if (userAgent.includes('coinbase')) return 'Coinbase Wallet';
  if (userAgent.includes('1inch')) return '1inch Wallet';
  if (userAgent.includes('tokenpocket')) return 'TokenPocket';
  if (userAgent.includes('imtoken')) return 'imToken';
  
  return null;
};

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
    // Улучшенные сообщения для мобильных устройств
    if (isMobile()) {
      const detectedWallet = detectMobileWallet();
      if (detectedWallet) {
        console.log(`Обнаружен ${detectedWallet}, но Web3 недоступен`);
      } else {
        console.log('Мобильное устройство обнаружено. Откройте сайт в браузере кошелька (Trust Wallet, MetaMask Mobile и др.) или используйте WalletConnect');
      }
    } else {
      console.log('MetaMask is not installed');
    }
    return { provider: null, signer: null, account: null };
  }
}; 