import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../../shared/providers/Web3Context';
import styles from './InvestTab.module.css';
import {
  PiggyBank,
  TrendingUp,
  Clock,
  Info,
  Zap,
  Plus,
  Minus,
  Loader2,
} from 'lucide-react';
import { MobileWalletHint, getCurrencyById } from '../../shared/ui';

const MOCK_TOKEN_ADDRESS_ERROR =
  'Mock token address not found in environment variables.';

export const InvestTab: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<string | null>(null);
  const { poolManager, mockToken } = useWeb3();

  // Фиксированные параметры
  const INVESTMENT_DURATION = 90; // дней
  const INVEST_TOKEN = 'USDT';

  const handleInvest = async () => {
    if (!poolManager || !mockToken) {
      setError(
        'PoolManager или MockToken недоступны. Пожалуйста, подключите кошелек.'
      );
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Пожалуйста, введите корректную сумму больше нуля.');
      return;
    }

    setLoading(true);
    setError(null);
    setTransaction(null);

    try {
      const tokenAddress = import.meta.env.VITE_ASSEST_ADDRESS as string;
      if (!tokenAddress) {
        throw new Error(MOCK_TOKEN_ADDRESS_ERROR);
      }

      const parsedAmount = ethers.parseUnits(amount, 6);
      const amountAsString = parsedAmount.toString();

      // Сначала одобряем токены
      setTransaction('Подтверждение разрешения на использование токенов...');
      const approveTx = await mockToken.approve(
        import.meta.env.VITE_POOL_MANAGER_CONTRACT_ADDRESS,
        amountAsString
      );
      await approveTx.wait();

      // Затем выполняем депозит
      setTransaction('Выполнение инвестиции...');
      const depositTx = await poolManager.deposit(amountAsString);
      setTransaction('Транзакция отправлена! Ожидание подтверждения...');

      await depositTx.wait();

      setTransaction(`Инвестиция успешно выполнена! Hash: ${depositTx.hash}`);
      setAmount('');
    } catch (e: any) {
      console.error('Ошибка инвестирования:', e);
      setError(`Не удалось выполнить инвестицию: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Предотвращаем ввод отрицательных значений
    if (value === '' || (parseFloat(value) >= 0 && !value.includes('-'))) {
      setAmount(value);
    }
  };

  // Refs для управления повторяющимися действиями
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Очистка таймеров
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Функции для кнопок с ускорением при удержании
  const incrementAmount = useCallback(() => {
    setAmount(prev => {
      const currentValue = parseFloat(prev) || 0;
      return (currentValue + 1).toString();
    });
  }, []);

  const decrementAmount = useCallback(() => {
    setAmount(prev => {
      const currentValue = parseFloat(prev) || 0;
      const newValue = Math.max(0, currentValue - 1);
      return newValue.toString();
    });
  }, []);

  const startRepeating = useCallback(
    (action: () => void) => {
      clearTimers(); // Очищаем предыдущие таймеры
      action(); // Первое выполнение сразу

      timeoutRef.current = window.setTimeout(() => {
        intervalRef.current = window.setInterval(action, 100);
      }, 500);
    },
    [clearTimers]
  );

  const stopRepeating = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const handleIncrementStart = useCallback(() => {
    startRepeating(incrementAmount);
  }, [startRepeating, incrementAmount]);

  const handleDecrementStart = useCallback(() => {
    startRepeating(decrementAmount);
  }, [startRepeating, decrementAmount]);

  // Очистка таймеров при размонтировании компонента
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return (
    <div className={styles.investTab}>
      <MobileWalletHint />
      <div className={`${styles.investForm} card`}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>
            <PiggyBank className={styles.titleIcon} />
            Инвестировать
          </h2>
          <p className={styles.formSubtitle}>
            Инвестируйте USDT и получайте доходность на ваши средства
          </p>
        </div>

        <div className={styles.investInfo}>
          <div className={styles.infoCard}>
            <Clock className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Период инвестиций</span>
              <span className={styles.infoValue}>
                {INVESTMENT_DURATION} дней
              </span>
            </div>
          </div>
          <div className={styles.infoCard}>
            <img
              src={getCurrencyById('USDT')?.icon}
              alt='USDT'
              className={styles.infoIcon}
              style={{ width: '20px', height: '20px' }}
            />
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Инвестиционная валюта</span>
              <span className={styles.infoValue}>{INVEST_TOKEN}</span>
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.amountInput}>
            <label className={styles.inputLabel}>
              Сумма инвестиций
              <span
                title='Укажите сумму USDT, которую хотите инвестировать. Средства будут заблокированы на указанный период'
                style={{ cursor: 'help' }}
              >
                <Info className={styles.labelIcon} />
              </span>
            </label>
            <div className={styles.inputWrapper}>
              <button
                type='button'
                className={styles.decrementButton}
                onMouseDown={handleDecrementStart}
                onMouseUp={stopRepeating}
                onMouseLeave={stopRepeating}
                onTouchStart={handleDecrementStart}
                onTouchEnd={stopRepeating}
                disabled={loading || !amount || parseFloat(amount) <= 0}
                title='-1 (hold)'
              >
                <Minus className='icon' />
              </button>
              <input
                type='number'
                value={amount}
                onChange={handleAmountChange}
                placeholder='0.00'
                disabled={loading}
                className={styles.amountField}
                min='0'
                step='0.01'
              />
              <button
                type='button'
                className={styles.incrementButton}
                onMouseDown={handleIncrementStart}
                onMouseUp={stopRepeating}
                onMouseLeave={stopRepeating}
                onTouchStart={handleIncrementStart}
                onTouchEnd={stopRepeating}
                disabled={loading}
                title='+1 (hold)'
              >
                <Plus className='icon' />
              </button>
            </div>
          </div>
        </div>

        <button
          className={styles.investButton}
          onClick={handleInvest}
          disabled={!amount || parseFloat(amount) <= 0 || loading}
        >
          {loading ? (
            <>
              <Loader2 className={`${styles.buttonIcon} ${styles.spinner}`} />
              Инвестирование...
            </>
          ) : (
            <>
              <TrendingUp className={styles.buttonIcon} />
              Инвестировать
            </>
          )}
        </button>

        {transaction && (
          <div className={styles.successMessage}>
            <Zap className={styles.messageIcon} />
            {transaction}
          </div>
        )}
        {error && (
          <div className={styles.errorMessage}>
            <Info className={styles.messageIcon} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
