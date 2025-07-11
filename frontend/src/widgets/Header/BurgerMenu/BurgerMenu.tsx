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
  const walletAddressRef = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);
  const [availableWidth, setAvailableWidth] = useState(0);

  // Функция для форматирования адреса кошелька с учетом доступного пространства
  const formatWalletAddress = (address: string, containerWidth: number): string => {
    if (!address) return '';
    
    // Если контейнер еще не измерен, возвращаем стандартный формат
    if (containerWidth === 0) {
      return `${address.slice(0, 6)}∙∙∙${address.slice(-4)}`;
    }
    
    // Примерная ширина одного символа в пикселях (для monospace шрифта 16px)
    const charWidth = 9.6; // более точное значение для monospace
    // Учитываем padding элемента (2px * 2 = 4px)
    const availableWidth = containerWidth - 8;
    
    // Ширина трех точек
    const dotsWidth = 3 * charWidth;
    
    // Вычисляем максимальное количество символов, которое поместится
    const maxChars = Math.floor((availableWidth - dotsWidth) / charWidth);
    
    // Минимальное количество символов для отображения (начало + конец)
    const minChars = 8;
    
    if (maxChars < minChars || address.length <= maxChars + 3) {
      return address;
    }
    
    // Распределяем символы: больше в начале, меньше в конце
    const startLength = Math.ceil(maxChars * 0.6);
    const endLength = Math.floor(maxChars * 0.4);
    
    // Убеждаемся, что не показываем меньше минимума
    const actualStart = Math.max(startLength, 4);
    const actualEnd = Math.max(endLength, 4);
    
    return `${address.slice(0, actualStart)}∙∙∙${address.slice(-actualEnd)}`;
  };

  // Функция для измерения доступной ширины
  const measureAvailableWidth = () => {
    if (walletAddressRef.current) {
      const element = walletAddressRef.current;
      const containerWidth = element.offsetWidth || element.parentElement?.offsetWidth || 0;
      setAvailableWidth(containerWidth);
    }
  };

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

  // Измерение ширины при открытии меню и изменении размера
  useEffect(() => {
    if (isOpen && account) {
      // Небольшая задержка для завершения анимации
      setTimeout(() => {
        measureAvailableWidth();
      }, 100);
    }
  }, [isOpen, account]);

  // Обработка изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && account) {
        measureAvailableWidth();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, account]);

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
                        ref={walletAddressRef}
                        className={styles.walletAddress} 
                        title={copied ? 'Скопировано!' : 'Нажмите для копирования'}
                        onClick={copyAddress}
                      >
                        {formatWalletAddress(account, availableWidth)}
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