import React, { useState } from 'react';
import { TrendingUp, Calculator, Clock, ArrowDownUp } from 'lucide-react';
import './BorrowTab.css';

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
    <div className='borrow-tab'>
      <div className='borrow-form card'>
        <h2 className='form-title'>
          <TrendingUp className='title-icon' />
          Взять в долг
        </h2>

        <div className='coin-selection'>
          <div className='coin-group'>
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

          <button className='swap-button' onClick={swapCoins}>
            <ArrowDownUp />
          </button>

          <div className='coin-group'>
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

        <div className='amount-input'>
          <label>Сумма для получения</label>
          <input
            type='number'
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder='Введите сумму'
          />
        </div>

        <div className='duration-selection'>
          <label>
            <Clock className='label-icon' />
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
          className='get-quotes-button'
          onClick={getQuotes}
          disabled={!amount || loading}
        >
          <Calculator className='button-icon' />
          {loading ? 'Получение котировок...' : 'Получить котировки'}
        </button>
      </div>

      {quotes.length > 0 && (
        <div className='quotes-section'>
          <h3>Доступные предложения</h3>
          <div className='quotes-list'>
            {quotes.map((quote, index) => (
              <div key={index} className='quote-card card'>
                <div className='quote-header'>
                  <span className='lender'>Кредитор: {quote.lender}</span>
                  <span className='interest-rate'>
                    {quote.interestRate}% APR
                  </span>
                </div>
                <div className='quote-details'>
                  <div className='detail'>
                    <span>Сумма:</span>
                    <span>
                      {quote.amount} {toCoin}
                    </span>
                  </div>
                  <div className='detail'>
                    <span>Срок:</span>
                    <span>{quote.duration} дней</span>
                  </div>
                  <div className='detail'>
                    <span>Обеспечение:</span>
                    <span>{quote.collateralRatio}%</span>
                  </div>
                </div>
                <button className='accept-quote-button'>
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
