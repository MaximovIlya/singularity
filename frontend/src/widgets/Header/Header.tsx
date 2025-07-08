import React, { useState } from 'react';
import { Wallet, Globe } from 'lucide-react';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setIsConnected(true);
        setAddress(accounts[0]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Failed to connect wallet:', error);
      }
    } else {
      alert('Пожалуйста, установите MetaMask!');
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className={styles.header}>
      <div className='container'>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Globe className={styles.logoIcon} />
            <span className={styles.logoText}>DeFi Lending</span>
          </div>

          <div className={styles.headerActions}>
            {isConnected ? (
              <div className={styles.walletInfo}>
                <Wallet className={styles.walletIcon} />
                <span className={styles.address}>{formatAddress(address)}</span>
              </div>
            ) : (
              <button className={styles.connectButton} onClick={connectWallet}>
                <Wallet className={styles.walletIcon} />
                <span>Подключить кошелек</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
