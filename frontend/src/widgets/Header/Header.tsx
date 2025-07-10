import { Globe, Wallet } from 'lucide-react';
import React from 'react';
import { useWeb3 } from '../../shared/providers/Web3Context';
import styles from './Header.module.css';
import { TabType } from '../../app/App';

export const Header: React.FC<{
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}> = ({ setActiveTab }) => {
  const { account, connectWallet, disconnectWallet } = useWeb3();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className={styles.header}>
      <div className='container'>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Globe className={styles.logoIcon} />
            <span className={styles.logoText}>Shave ur balls</span>
          </div>

          <div className={styles.headerActions}>
            <button
              className={styles.myInvestmentsButton}
              onClick={() => setActiveTab('my-investments')}
            >
              Мои вложения
            </button>
            <button
              className={styles.myInvestmentsButton}
              onClick={() => setActiveTab('my-loans')}
            >
              Мои займы
            </button>
            {account ? (
              <div className={styles.walletInfo}>
                <Wallet className={styles.walletIcon} />
                <span className={styles.address}>{formatAddress(account)}</span>
                <button
                  onClick={disconnectWallet}
                  className={styles.disconnectButton}
                >
                  Disconnect
                </button>
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
