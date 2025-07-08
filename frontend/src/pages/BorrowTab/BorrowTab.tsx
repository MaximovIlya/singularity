import React, { useState } from 'react';
import { TrendingUp, Calculator, Clock, ArrowDownUp } from 'lucide-react';
import styles from './BorrowTab.module.css';

interface Quote {
  lender: string;
  amount: number;
  interestRate: number;
  duration: number;
  collateralRatio: number;
}

export const BorrowTab: React.FC = () => {
  const [fromCoin, setFromCoin] = useState('ETH');
  const [toCoin, setToCoin] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('30');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);

  const coins = ['ETH', 'USDC', 'USDT', 'DAI', 'WBTC'];

  const getQuotes = async () => {
    setLoading(true);
    // Симуляция получения котировок
    setTimeout(() => {
      const mockQuotes: Quote[] = [
        {
          lender: '0x742d...4e88',
          amount: parseFloat(amount) || 1000,
          interestRate: 8.5,
          duration: parseInt(duration),
          collateralRatio: 150,
        },
        {
          lender: '0x851a...7c22',
          amount: parseFloat(amount) || 1000,
          interestRate: 9.2,
          duration: parseInt(duration),
          collateralRatio: 130,
        },
        {
          lender: '0x923f...1a45',
          amount: parseFloat(amount) || 1000,
          interestRate: 7.8,
          duration: parseInt(duration),
          collateralRatio: 160,
        },
      ];
      setQuotes(mockQuotes);
      setLoading(false);
    }, 1500);
  };

  const swapCoins = () => {
    setFromCoin(toCoin);
    setToCoin(fromCoin);
  };

  return (
    <div className={styles.borrowTab}>
      <div className={`${styles.borrowForm} card`}>
        <h2 className={styles.formTitle}>
          <TrendingUp className={styles.titleIcon} />
          Взять в долг
        </h2>

        <div className={styles.coinSelection}>
          <div className={styles.coinGroup}>
            <label>Обеспечение</label>
            <select
              value={fromCoin}
              onChange={e => setFromCoin(e.target.value)}
            >
              {coins.map(coin => (
                <option key={coin} value={coin}>
                  {coin}
                </option>
              ))}
            </select>
          </div>

          <button className={styles.swapButton} onClick={swapCoins}>
            <ArrowDownUp />
          </button>

          <div className={styles.coinGroup}>
            <label>Получить</label>
            <select value={toCoin} onChange={e => setToCoin(e.target.value)}>
              {coins.map(coin => (
                <option key={coin} value={coin}>
                  {coin}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.amountInput}>
          <label>Сумма для получения</label>
          <input
            type='number'
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder='Введите сумму'
          />
        </div>

        <div className={styles.durationSelection}>
          <label>
            <Clock className={styles.labelIcon} />
            Срок займа (дни)
          </label>
          <select value={duration} onChange={e => setDuration(e.target.value)}>
            <option value='7'>7 дней</option>
            <option value='14'>14 дней</option>
            <option value='30'>30 дней</option>
            <option value='60'>60 дней</option>
            <option value='90'>90 дней</option>
          </select>
        </div>

        <button
          className={styles.getQuotesButton}
          onClick={getQuotes}
          disabled={!amount || loading}
        >
          <Calculator className={styles.buttonIcon} />
          {loading ? 'Получение котировок...' : 'Получить котировки'}
        </button>
      </div>

      {quotes.length > 0 && (
        <div className={styles.quotesSection}>
          <h3>Доступные предложения</h3>
          <div className={styles.quotesList}>
            {quotes.map((quote, index) => (
              <div key={index} className={`${styles.quoteCard} card`}>
                <div className={styles.quoteHeader}>
                  <span className={styles.lender}>
                    Кредитор: {quote.lender}
                  </span>
                  <span className={styles.interestRate}>
                    {quote.interestRate}% APR
                  </span>
                </div>
                <div className={styles.quoteDetails}>
                  <div className={styles.detail}>
                    <span>Сумма:</span>
                    <span>
                      {quote.amount} {toCoin}
                    </span>
                  </div>
                  <div className={styles.detail}>
                    <span>Срок:</span>
                    <span>{quote.duration} дней</span>
                  </div>
                  <div className={styles.detail}>
                    <span>Обеспечение:</span>
                    <span>{quote.collateralRatio}%</span>
                  </div>
                </div>
                <button className={styles.acceptQuoteButton}>
                  Принять предложение
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
