import React, { useState } from 'react';
import { PiggyBank, Percent, TrendingUp, BarChart3 } from 'lucide-react';
import { InterestChart } from '../../widgets/InterestChart/InterestChart';
import styles from './InvestTab.module.css';
import { Contract } from '../../utils/contract';

interface InvestmentOption {
  currency: string;
  apy: number;
  totalLiquidity: number;
  risk: 'low' | 'medium' | 'high';
}

type InvestTab = {
  writeContract: Contract | null;
};

export const InvestTab: React.FC<InvestTab> = ({ writeContract }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('30');

  const investmentOptions: InvestmentOption[] = [
    { currency: 'USDC', apy: 8.2, totalLiquidity: 1250000, risk: 'low' },
    { currency: 'USDT', apy: 7.8, totalLiquidity: 980000, risk: 'low' },
    { currency: 'DAI', apy: 8.5, totalLiquidity: 750000, risk: 'medium' },
    { currency: 'ETH', apy: 12.1, totalLiquidity: 500000, risk: 'high' },
    { currency: 'WBTC', apy: 11.5, totalLiquidity: 320000, risk: 'high' },
  ];

  const selectedOption = investmentOptions.find(
    opt => opt.currency === selectedCurrency
  );

  const calculateReturns = () => {
    if (!amount || !selectedOption) return 0;
    const principal = parseFloat(amount);
    const days = parseInt(duration);
    const dailyRate = selectedOption.apy / 365 / 100;
    return principal * Math.pow(1 + dailyRate, days) - principal;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'var(--color-success)';
      case 'medium':
        return 'var(--color-warning)';
      case 'high':
        return 'var(--color-error)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'Низкий';
      case 'medium':
        return 'Средний';
      case 'high':
        return 'Высокий';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className={styles.investTab}>
      <div className={`${styles.investForm} card`}>
        <h2 className={styles.formTitle}>
          <PiggyBank className={styles.titleIcon} />
          Инвестировать
        </h2>

        <div className={styles.currencySelection}>
          <label>Валюта для инвестиций</label>
          <select
            value={selectedCurrency}
            onChange={e => setSelectedCurrency(e.target.value)}
          >
            {investmentOptions.map(option => (
              <option key={option.currency} value={option.currency}>
                {option.currency}
              </option>
            ))}
          </select>
        </div>

        {selectedOption && (
          <div className={`${styles.investmentInfo} card`}>
            <div className={styles.infoHeader}>
              <h3>{selectedOption.currency}</h3>
              <div className={styles.apyBadge}>
                <Percent className={styles.percentIcon} />
                {selectedOption.apy}% APY
              </div>
            </div>

            <div className={styles.infoDetails}>
              <div className={styles.infoItem}>
                <span>Общая ликвидность:</span>
                <span>${selectedOption.totalLiquidity.toLocaleString()}</span>
              </div>
              <div className={styles.infoItem}>
                <span>Уровень риска:</span>
                <span
                  className={styles.riskLabel}
                  style={{ color: getRiskColor(selectedOption.risk) }}
                >
                  {getRiskLabel(selectedOption.risk)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.amountInput}>
          <label>Сумма инвестиций</label>
          <input
            type='number'
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder='Введите сумму'
          />
        </div>

        <div className={styles.durationSelection}>
          <label>Срок инвестиций (дни)</label>
          <select value={duration} onChange={e => setDuration(e.target.value)}>
            <option value='7'>7 дней</option>
            <option value='14'>14 дней</option>
            <option value='30'>30 дней</option>
            <option value='60'>60 дней</option>
            <option value='90'>90 дней</option>
            <option value='180'>180 дней</option>
            <option value='365'>1 год</option>
          </select>
        </div>

        {amount && (
          <div className={`${styles.returnsCalculation} card`}>
            <h4>Ожидаемая доходность</h4>
            <div className={styles.returnsDetails}>
              <div className={styles.returnItem}>
                <span>Вложено:</span>
                <span>
                  {amount} {selectedCurrency}
                </span>
              </div>
              <div className={styles.returnItem}>
                <span>Прибыль за {duration} дней:</span>
                <span className={styles.profit}>
                  +{calculateReturns().toFixed(4)} {selectedCurrency}
                </span>
              </div>
              <div className={`${styles.returnItem} ${styles.total}`}>
                <span>Итого к получению:</span>
                <span>
                  {(parseFloat(amount) + calculateReturns()).toFixed(4)}{' '}
                  {selectedCurrency}
                </span>
              </div>
            </div>
          </div>
        )}

        <button className={styles.investButton}>
          <TrendingUp className={styles.buttonIcon} />
          Инвестировать
        </button>
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h3>
            <BarChart3 className={styles.chartIcon} />
            Исторический график процентных ставок
          </h3>
        </div>
        <InterestChart currency={selectedCurrency} />
      </div>
    </div>
  );
};
