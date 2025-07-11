import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, PiggyBank, Shield, Zap, ArrowRight, Star, Users, DollarSign } from 'lucide-react';
import { LoanForm } from '../../widgets/LoanForm/LoanForm';
import { PoolManagerContract } from '../../contracts/PoolManager';
import { MockTokenContract } from '../../contracts/MockToken';
import styles from './HomePage.module.css';

interface HomePageProps {
  poolManager: PoolManagerContract;
  mockToken: MockTokenContract | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  poolManager,
  mockToken,
}) => {
  const navigate = useNavigate();
  const [heroVisible, setHeroVisible] = useState(true); // Показываем сразу при загрузке
  const [tradingVisible, setTradingVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const tradingRef = useRef<HTMLElement>(null);

  const scrollToBorrow = () => {
    navigate('/borrow');
    setTimeout(() => {
      const tradingSection = document.getElementById('trading-section');
      if (tradingSection) {
        tradingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const scrollToInvest = () => {
    navigate('/invest');
    setTimeout(() => {
      const tradingSection = document.getElementById('trading-section');
      if (tradingSection) {
        tradingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Начинаем скрывать раньше
      threshold: [0, 0.25, 0.5, 0.75, 1] // Множественные точки срабатывания
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.25;
        
        if (entry.target === heroRef.current) {
          setHeroVisible(isVisible);
        }
        if (entry.target === tradingRef.current) {
          setTradingVisible(isVisible);
        }
      });
    }, observerOptions);

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    if (tradingRef.current) {
      observer.observe(tradingRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: 'Займы под залог',
      description: 'Мгновенные займы в USDT под обеспечение ETH с прозрачными условиями',
      color: '#8b5cf6',
      action: scrollToBorrow
    },
    {
      icon: PiggyBank,
      title: 'Инвестиции',
      description: 'Инвестируйте USDT в пулы ликвидности и получайте стабильную доходность',
      color: '#ec4899',
      action: scrollToInvest
    },
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Смарт-контракты аудированы, средства защищены децентрализованными протоколами',
      color: '#10b981',
      action: () => {}
    },
    {
      icon: Zap,
      title: 'Мгновенные операции',
      description: 'Быстрые транзакции на Ethereum с минимальными комиссиями',
      color: '#f59e0b',
      action: () => {}
    }
  ];

  const stats = [
    { label: 'Общая ликвидность', value: '$2.5M+', icon: DollarSign },
    { label: 'Активных пользователей', value: '1,200+', icon: Users },
    { label: 'Рейтинг безопасности', value: '5/5', icon: Star }
  ];

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section ref={heroRef} className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Будущее <span className={styles.gradientText}>DeFi</span> кредитования
            </h1>
            <p className={styles.heroSubtitle}>
              Децентрализованная платформа для займов под залог и инвестиций с прозрачными условиями, 
              высокой доходностью и максимальной безопасностью ваших средств
            </p>
            <div className={styles.heroActions}>
              <button 
                className={styles.ctaButton}
                onClick={scrollToBorrow}
              >
                <TrendingUp className={styles.buttonIcon} />
                Получить займ
                <ArrowRight className={styles.arrowIcon} />
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={scrollToInvest}
              >
                <PiggyBank className={styles.buttonIcon} />
                Инвестировать
              </button>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className={styles.stats}>
            <div className={styles.statsGrid}>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className={styles.statCard}>
                    <IconComponent className={styles.statIcon} />
                    <div className={styles.statContent}>
                      <div className={styles.statValue}>{stat.value}</div>
                      <div className={styles.statLabel}>{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.sectionTitle}>Возможности платформы</h2>
            <p className={styles.sectionSubtitle}>
              Используйте передовые DeFi технологии для управления вашими активами
            </p>
          </div>
          
          <div className={styles.featuresGrid}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index} 
                className={styles.featureCard}
                onClick={feature.action}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className={styles.featureIcon}
                  style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                >
                  <IconComponent />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                {(feature.title === 'Займы под залог' || feature.title === 'Инвестиции') && (
                  <div className={styles.featureAction}>
                    <span>Начать</span>
                    <ArrowRight className={styles.featureArrow} />
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* Trading Section */}
      <section ref={tradingRef} id="trading-section" className={`${styles.trading} ${tradingVisible ? styles.tradingVisible : ''}`}>
        <div className={styles.tradingInner}>
          <div className={styles.tradingHeader}>
            <h2 className={styles.sectionTitle}>Начните торговать</h2>
            <p className={styles.sectionSubtitle}>
              Выберите желаемую операцию и начните зарабатывать уже сегодня
            </p>
          </div>
          
          <div className={styles.tradingContainer}>
            <LoanForm poolManager={poolManager} mockToken={mockToken} />
          </div>
        </div>
      </section>
    </div>
  );
}; 