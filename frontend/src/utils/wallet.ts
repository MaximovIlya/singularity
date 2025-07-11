import { ethers } from 'ethers';

export type Web3Provider = ethers.BrowserProvider;

// Простая детекция мобильного устройства
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Детекция MetaMask Mobile
export const detectMobileWallet = (): string | null => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Проверяем только MetaMask
  if (userAgent.includes('metamask')) return 'MetaMask Mobile';
  
  // Дополнительная проверка через window.ethereum если доступен
  if (typeof window.ethereum !== 'undefined') {
    const ethereum = window.ethereum as any;
    if (ethereum.isMetaMask && isMobile()) return 'MetaMask Mobile';
  }
  
  return null;
};

// Функция для определения, находимся ли мы в браузере MetaMask Mobile
export const isMetaMaskMobile = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    isMobile() && 
    (userAgent.includes('metamask') || 
     (typeof window.ethereum !== 'undefined' && Boolean(window.ethereum.isMetaMask)))
  );
};

// Deep linking для MetaMask Mobile
export const openInMetaMask = (dappUrl: string = window.location.href) => {
  const deepLink = `metamask://dapp/${encodeURIComponent(dappUrl)}`;
  
  try {
    window.location.href = deepLink;
    return true;
  } catch (error) {
    console.warn('Failed to open MetaMask deep link:', error);
    return false;
  }
};

// Специальная функция для подключения MetaMask Mobile
const connectMetaMaskMobile = async (): Promise<{
  provider: Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
}> => {
  if (typeof window.ethereum === 'undefined') {
    // Если мы на мобильном устройстве, но window.ethereum недоступен
    if (isMobile()) {
      const currentUrl = window.location.href;
      const opened = openInMetaMask(currentUrl);
      
      if (!opened) {
        // Если deep link не сработал, перенаправляем на скачивание
        window.open('https://metamask.io/download/', '_blank');
      }
      
      throw new Error('MetaMask Mobile не обнаружен. Попробуйте открыть сайт в браузере MetaMask или установите приложение.');
    }
    
    throw new Error('MetaMask не установлен');
  }

  try {
    // Запрашиваем подключение
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const desiredChainId = '0xaa36a7'; // Sepolia testnet
    const network = await provider.getNetwork();

    // Проверяем и переключаем сеть при необходимости
    if (network.chainId !== BigInt(desiredChainId)) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: desiredChainId }],
        });
        // Re-instantiate provider after network switch
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await newProvider.getSigner();
        const account = await signer.getAddress();
        
        return { provider: newProvider, signer, account };
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Сеть не добавлена в кошелек, попробуем добавить
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: desiredChainId,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/']
              }]
            });
            
            // После добавления сети попробуем снова
            const newProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await newProvider.getSigner();
            const account = await signer.getAddress();
            
            return { provider: newProvider, signer, account };
          } catch (addError) {
            console.error('Failed to add Sepolia network:', addError);
            throw new Error('Пожалуйста, добавьте тестовую сеть Sepolia в MetaMask');
          }
        } else {
          console.error('Failed to switch network:', switchError);
          throw new Error('Не удалось переключиться на сеть Sepolia');
        }
      }
    }

    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    return { provider, signer, account };
    
  } catch (error: any) {
    console.error('Error connecting to MetaMask Mobile:', error);
    
    if (error.code === 4001) {
      throw new Error('Подключение отклонено пользователем');
    } else if (error.code === -32002) {
      throw new Error('Запрос на подключение уже отправлен. Проверьте MetaMask.');
    } else {
      throw new Error(error.message || 'Не удалось подключиться к MetaMask Mobile');
    }
  }
};

export const connectWallet = async (): Promise<{
  provider: Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
}> => {
  // Специальная обработка для MetaMask Mobile
  if (isMetaMaskMobile()) {
    try {
      return await connectMetaMaskMobile();
    } catch (error) {
      console.error('MetaMask Mobile connection failed:', error);
      return { provider: null, signer: null, account: null };
    }
  }

  // Обычная логика для desktop или браузера MetaMask
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
            console.error('Please add the Sepolia testnet to MetaMask.');
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
      console.error('Error connecting to MetaMask:', error);
      return { provider: null, signer: null, account: null };
    }
  } else {
    // Сообщения для устройств без MetaMask
    if (isMobile()) {
      const detectedWallet = detectMobileWallet();
      if (detectedWallet) {
        console.log(`Обнаружен ${detectedWallet}, но Web3 недоступен`);
      } else {
        console.log('Мобильное устройство обнаружено. Откройте сайт в браузере MetaMask Mobile.');
        
        // Предлагаем открыть в MetaMask Mobile
        setTimeout(() => {
          const userConfirm = confirm('Хотите открыть сайт в MetaMask Mobile?');
          if (userConfirm) {
            openInMetaMask();
          }
        }, 1000);
      }
    } else {
      console.log('MetaMask is not installed. Please install MetaMask extension.');
    }
    return { provider: null, signer: null, account: null };
  }
}; 