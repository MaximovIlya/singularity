import { Globe, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BREAKPOINTS,
  SCREEN_QUERIES,
} from '../../shared/constants/breakpoints';
import { useWeb3 } from '../../shared/providers/Web3Context';
import { MobileWalletHint } from '../../shared/ui';
import { BurgerButton, BurgerMenu } from './BurgerMenu';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { account, connectWallet, disconnectWallet, isMobileDevice } =
    useWeb3();
  const navigate = useNavigate();

  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  // Отслеживаем размер экрана
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      // Закрываем burger меню при изменении размера экрана на desktop
      if (window.innerWidth >= BREAKPOINTS.LARGE && isBurgerMenuOpen) {
        setIsBurgerMenuOpen(false);
      }
    };

    handleResize(); // Проверяем при первом рендере
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [isBurgerMenuOpen]);

  // Определяем тип экрана
  const isDesktop = SCREEN_QUERIES.isDesktop(screenWidth);
  const isTablet = SCREEN_QUERIES.isTablet(screenWidth);
  const isMobile = SCREEN_QUERIES.isMobile(screenWidth);
  const isPhone = SCREEN_QUERIES.isPhone(screenWidth);

  const formatAddress = (addr: string) => {
    if (isPhone) {
      return `${addr.slice(0, 4)}...${addr.slice(-3)}`;
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Адаптивный текст для кнопок
  const getButtonText = (fullText: string, shortText: string) => {
    if (isPhone) {
      return shortText;
    }
    return fullText;
  };

  // Логика отображения элементов
  const shouldShowNavButtons = isDesktop; // На desktop показываем кнопки навигации
  const shouldShowWalletInfo = isDesktop; // Только на desktop показываем info кошелька в header
  const shouldShowBurgerButton = !isDesktop; // На tablet и mobile показываем burger

  // Что показывать в burger меню
  const burgerShowNavButtons = (isTablet || isMobile) && !!account; // В планшетном и мобильном формате только если кошелек подключен
  const burgerShowWalletInfo = isTablet || isMobile; // В планшетном и мобильном формате

  const handleBurgerMenuToggle = () => {
    setIsBurgerMenuOpen(!isBurgerMenuOpen);
  };

  const handleBurgerMenuClose = () => {
    setIsBurgerMenuOpen(false);
  };

  return (
    <header
      className={`${styles.header} ${isBurgerMenuOpen ? styles.headerBlurred : ''}`}
    >
      {/* Показываем подсказку для мобильных устройств без подключенного кошелька */}
      {isMobileDevice && !account && (
        <div className='container'>
          <MobileWalletHint />
        </div>
      )}

      <div className='container'>
        <div className={styles.headerContent}>
          <Link className={styles.logo} to='/' aria-label='Главная страница'>
            <Globe className={styles.logoIcon} />
            <span className={styles.logoText}>Astro DeFi</span>
          </Link>

          <div className={styles.headerActions}>
            {/* Навигационные кнопки (только на desktop и если кошелек подключен) */}
            {shouldShowNavButtons && !!account && (
              <>
                <button
                  className={styles.myInvestmentsButton}
                  onClick={() => navigate('/my-investments')}
                  title='Перейти к моим вложениям'
                >
                  {getButtonText('Мои вложения', 'Вложения')}
                </button>
                <button
                  className={styles.myInvestmentsButton}
                  onClick={() => navigate('/my-loans')}
                  title='Перейти к моим займам'
                >
                  {getButtonText('Мои займы', 'Займы')}
                </button>
              </>
            )}

            {/* Информация о кошельке (на desktop и tablet) */}
            {shouldShowWalletInfo && (
              <>
                {account ? (
                  <div
                    className={styles.walletInfo}
                    title={`Кошелек подключен: ${account}`}
                  >
                    <Wallet className={styles.walletIcon} />
                    <span className={styles.address}>
                      {formatAddress(account)}
                    </span>
                    <button
                      onClick={disconnectWallet}
                      className={styles.disconnectButton}
                      title='Отключить кошелек'
                      aria-label='Отключить кошелек'
                    >
                      {isPhone ? '×' : 'Disconnect'}
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.connectButton}
                    onClick={connectWallet}
                    title='Подключить Web3 кошелек'
                    aria-label='Подключить кошелек'
                  >
                    <Wallet className={styles.walletIcon} />
                    <span>Подключить кошелек</span>
                  </button>
                )}
              </>
            )}

            {/* Burger кнопка (на tablet и mobile) */}
            {shouldShowBurgerButton && (
              <BurgerButton
                onClick={handleBurgerMenuToggle}
                className={styles.burgerButtonCustom}
              />
            )}
          </div>
        </div>
      </div>

      {/* Burger меню */}
      <BurgerMenu
        isOpen={isBurgerMenuOpen}
        onClose={handleBurgerMenuClose}
        showNavButtons={burgerShowNavButtons}
        showWalletInfo={burgerShowWalletInfo}
      />
    </header>
  );
};
