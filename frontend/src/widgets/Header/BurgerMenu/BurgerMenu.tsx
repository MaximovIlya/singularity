import { Menu, Wallet, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../../shared/providers/Web3Context';
import styles from './BurgerMenu.module.css';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  showNavButtons: boolean;
  showWalletInfo: boolean;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({
  isOpen,
  onClose,
  showNavButtons,
  showWalletInfo,
}) => {
  const { account, connectWallet, disconnectWallet } = useWeb3();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Функция для копирования адреса
  const copyAddress = async () => {
    if (!account) return;
    
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Ошибка при копировании адреса:', err);
    }
  };



  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Предотвращаем скролл страницы
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Закрытие меню при нажатии Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleDisconnect = () => {
    disconnectWallet();
    onClose();
  };

  const handleConnect = () => {
    connectWallet();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} />
      
      {/* Menu */}
      <div ref={menuRef} className={styles.menu}>
        <div className={styles.menuHeader}>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть меню"
          >
            <X className={styles.closeButtonIcon} />
          </button>
        </div>

        <div className={styles.menuContent}>
          {/* Навигационные кнопки */}
          {showNavButtons && (
            <div className={styles.navSection}>
              <button
                className={styles.menuItem}
                onClick={() => handleNavigation('/my-investments')}
              >
                <span className={styles.menuItemText}>Мои вложения</span>
              </button>
              
              <button
                className={styles.menuItem}
                onClick={() => handleNavigation('/my-loans')}
              >
                <span className={styles.menuItemText}>Мои займы</span>
              </button>
            </div>
          )}

          {/* Информация о кошельке */}
          {showWalletInfo && (
            <div className={styles.walletSection}>
              {account ? (
                <div className={styles.walletInfo}>
                  <div className={styles.walletDetails}>
                    <Wallet className={styles.walletIcon} />
                    <div className={styles.walletText}>
                      <span className={styles.walletLabel}>Кошелек</span>
                      <span 
                        className={styles.walletAddress} 
                        title={copied ? 'Скопировано!' : 'Нажмите для копирования'}
                        onClick={copyAddress}
                      >
                        {account}
                      </span>
                    </div>
                  </div>
                  <button
                    className={styles.disconnectButton}
                    onClick={handleDisconnect}
                  >
                    Отключить
                  </button>
                </div>
              ) : (
                <button
                  className={styles.menuItem}
                  onClick={handleConnect}
                >
                  <Wallet className={styles.walletIcon} />
                  <span className={styles.menuItemText}>Подключить кошелек</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Кнопка для открытия burger меню
interface BurgerButtonProps {
  onClick: () => void;
  className?: string;
}

export const BurgerButton: React.FC<BurgerButtonProps> = ({ onClick, className }) => {
  return (
    <button 
      className={`${styles.burgerButton} ${className || ''}`}
      onClick={onClick}
      aria-label="Открыть меню"
      aria-expanded="false"
    >
      <Menu className={styles.burgerIcon} />
    </button>
  );
}; 