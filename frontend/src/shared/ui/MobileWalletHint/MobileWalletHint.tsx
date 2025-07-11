import React from 'react';
import { Smartphone, ExternalLink } from 'lucide-react';
import { useWeb3 } from '../../providers/Web3Context';
import styles from './MobileWalletHint.module.css';

export const MobileWalletHint: React.FC = () => {
  const { isMobileDevice, detectedMobileWallet, account } = useWeb3();

  // Не показываем подсказку если уже подключен или это не мобильное устройство
  if (!isMobileDevice || account) {
    return null;
  }

  return (
    <div className={`${styles.mobileHint} ${detectedMobileWallet ? styles.detectedWallet : ''}`}>
      <div className={styles.hintTitle}>
        <Smartphone className="icon" />
        {detectedMobileWallet ? `${detectedMobileWallet} обнаружен` : 'Мобильное устройство'}
      </div>
      
      <div className={styles.hintText}>
        {detectedMobileWallet ? (
          `Отлично! Вы используете ${detectedMobileWallet}. Если кошелек не подключается автоматически, попробуйте обновить страницу.`
        ) : (
          'Для подключения кошелька на мобильном устройстве откройте этот сайт в браузере одного из поддерживаемых кошельков:'
        )}
      </div>

      {!detectedMobileWallet && (
        <div className={styles.walletLinks}>
          <a 
            href="https://trustwallet.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.walletLink}
          >
            Trust Wallet
            <ExternalLink className="icon" size={12} />
          </a>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.walletLink}
          >
            MetaMask Mobile
            <ExternalLink className="icon" size={12} />
          </a>
          <a 
            href="https://www.coinbase.com/wallet" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.walletLink}
          >
            Coinbase Wallet
            <ExternalLink className="icon" size={12} />
          </a>
        </div>
      )}
    </div>
  );
}; 