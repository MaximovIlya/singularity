import React, { useState } from 'react';
import { PiggyBank, Percent, TrendingUp, BarChart3 } from 'lucide-react';
import { InterestChart } from '../../widgets/InterestChart/InterestChart';
import './InvestTab.css';

interface InvestmentOption {
  currency: string;
  apy: number;
  totalLiquidity: number;
  risk: 'low' | 'medium' | 'high';
}

export const InvestTab: React.FC = () => {
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
    <div className='invest-tab'>
      <div className='invest-form card'>
        <h2 className='form-title'>
          <PiggyBank className='title-icon' />
          Инвестировать
        </h2>

        <div className='currency-selection'>
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
          <div className='investment-info card'>
            <div className='info-header'>
              <h3>{selectedOption.currency}</h3>
              <div className='apy-badge'>
                <Percent className='percent-icon' />
                {selectedOption.apy}% APY
              </div>
            </div>

            <div className='info-details'>
              <div className='info-item'>
                <span>Общая ликвидность:</span>
                <span>${selectedOption.totalLiquidity.toLocaleString()}</span>
              </div>
              <div className='info-item'>
                <span>Уровень риска:</span>
                <span
                  className='risk-label'
                  style={{ color: getRiskColor(selectedOption.risk) }}
                >
                  {getRiskLabel(selectedOption.risk)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className='amount-input'>
          <label>Сумма инвестиций</label>
          <input
            type='number'
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder='Введите сумму'
          />
        </div>

        <div className='duration-selection'>
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
          <div className='returns-calculation card'>
            <h4>Ожидаемая доходность</h4>
            <div className='returns-details'>
              <div className='return-item'>
                <span>Вложено:</span>
                <span>
                  {amount} {selectedCurrency}
                </span>
              </div>
              <div className='return-item'>
                <span>Прибыль за {duration} дней:</span>
                <span className='profit'>
                  +{calculateReturns().toFixed(4)} {selectedCurrency}
                </span>
              </div>
              <div className='return-item total'>
                <span>Итого к получению:</span>
                <span>
                  {(parseFloat(amount) + calculateReturns()).toFixed(4)}{' '}
                  {selectedCurrency}
                </span>
              </div>
            </div>
          </div>
        )}

        <button className='invest-button'>
          <TrendingUp className='button-icon' />
          Инвестировать
        </button>
      </div>

      <div className='chart-section'>
        <div className='chart-header'>
          <h3>
            <BarChart3 className='chart-icon' />
            Исторический график процентных ставок
          </h3>
        </div>
        <InterestChart currency={selectedCurrency} />
      </div>
    </div>
  );
};
