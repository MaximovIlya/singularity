import React from 'react';
import { Smartphone, ExternalLink } from 'lucide-react';
import { useWeb3 } from '../../providers/Web3Context';
import { openInMetaMask, isMetaMaskMobile } from '../../../utils/wallet';
import styles from './MobileWalletHint.module.css';

export const MobileWalletHint: React.FC = () => {
  const { isMobileDevice, detectedMobileWallet, account, connectWallet } = useWeb3();

  // Не показываем подсказку если уже подключен или это не мобильное устройство
  if (!isMobileDevice || account) {
    return null;
  }

  const currentUrl = window.location.href;

  // Функция для открытия MetaMask Mobile
  const handleMetaMaskOpen = () => {
    // Сначала попробуем deep link
    const opened = openInMetaMask(currentUrl);
    
    // Если deep link не сработал, через небольшую задержку откроем ссылку на скачивание
    if (!opened) {
      setTimeout(() => {
        window.open('https://metamask.io/download/', '_blank');
      }, 1000);
    }
  };

  // Специальная функция для подключения MetaMask Mobile
  const handleMetaMaskConnect = async () => {
    try {
      // Если мы уже в браузере MetaMask, попробуем подключиться напрямую
      if (isMetaMaskMobile()) {
        await connectWallet();
      } else {
        // Иначе используем deep linking
        handleMetaMaskOpen();
      }
    } catch (error) {
      console.error('Failed to connect to MetaMask Mobile:', error);
      // Fallback к deep linking
      handleMetaMaskOpen();
    }
  };

  // Если мы уже в браузере MetaMask Mobile
  if (isMetaMaskMobile()) {
    return (
      <div className={`${styles.mobileHint} ${styles.detectedWallet}`}>
        <div className={styles.hintTitle}>
          <Smartphone className="icon" />
          MetaMask Mobile обнаружен
        </div>
        
        <div className={styles.hintText}>
          Отлично! Вы используете MetaMask Mobile. Нажмите кнопку ниже чтобы подключить кошелек.
        </div>

        <div className={styles.walletActions}>
          <button 
            className={styles.connectButton}
            onClick={handleMetaMaskConnect}
          >
            Подключить MetaMask
          </button>
        </div>
      </div>
    );
  }

  // Если MetaMask обнаружен, но не подключен
  if (detectedMobileWallet === 'MetaMask Mobile') {
    return (
      <div className={`${styles.mobileHint} ${styles.detectedWallet}`}>
        <div className={styles.hintTitle}>
          <Smartphone className="icon" />
          MetaMask Mobile обнаружен
        </div>
        
        <div className={styles.hintText}>
          Отлично! Вы используете MetaMask Mobile. Если кошелек не подключается автоматически, попробуйте обновить страницу.
        </div>

        <div className={styles.walletActions}>
          <button 
            className={styles.connectButton}
            onClick={handleMetaMaskConnect}
          >
            Подключить MetaMask
          </button>
        </div>
      </div>
    );
  }

  // Для всех остальных мобильных устройств показываем инструкцию по MetaMask
  return (
    <div className={styles.mobileHint}>
      <div className={styles.hintTitle}>
        <Smartphone className="icon" />
        Мобильное устройство
      </div>
      
      <div className={styles.hintText}>
        Для подключения кошелька на мобильном устройстве откройте этот сайт в браузере MetaMask Mobile или установите приложение:
      </div>

      <div className={styles.walletLinks}>
        <button
          className={styles.metamaskButton}
          onClick={handleMetaMaskConnect}
        >
          MetaMask Mobile
          <ExternalLink className="icon" size={12} />
        </button>
      </div>
    </div>
  );
}; 