import React, { useState } from 'react';
import { Wallet, Globe } from 'lucide-react';
import './Header.css';

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
    <header className='header'>
      <div className='container'>
        <div className='header-content'>
          <div className='logo'>
            <Globe className='logo-icon' />
            <span className='logo-text'>DeFi Lending</span>
          </div>

          <div className='header-actions'>
            {isConnected ? (
              <div className='wallet-info'>
                <Wallet className='wallet-icon' />
                <span className='address'>{formatAddress(address)}</span>
              </div>
            ) : (
              <button className='connect-button' onClick={connectWallet}>
                <Wallet className='wallet-icon' />
                Подключить кошелек
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
