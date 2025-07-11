import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../../shared/providers/Web3Context';
import styles from './BorrowTab.module.css';
import { 
  TrendingUp, 
  Calculator, 
  Clock, 
  Shield, 
  Info,
  Zap,
  Plus,
  Minus
} from 'lucide-react';
import { CurrencySelect, CURRENCIES, CurrencyId } from '../../shared/ui';

const MOCK_TOKEN_ADDRESS_ERROR =
  'Mock token address not found in environment variables.';

export const BorrowTab: React.FC = () => {
  const [collateralCoin, setCollateralCoin] = useState<CurrencyId>('ETH');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<string | null>(null);
  const { poolManager } = useWeb3();

  // Фиксированные параметры
  const LOAN_DURATION = 90; // дней
  const BORROW_TOKEN = 'USDT';

  const handleBorrow = async () => {
    if (!poolManager) {
      setError('PoolManager недоступен. Пожалуйста, подключите кошелек.');
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

      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await poolManager.borrow(tokenAddress, parsedAmount);
      setTransaction('Транзакция отправлена! Ожидание подтверждения...');

      await tx.wait();

      setTransaction(`Транзакция успешно выполнена! Hash: ${tx.hash}`);
      setAmount('');
    } catch (e: any) {
      console.error('Ошибка заёма:', e);
      setError(`Не удалось выполнить заём: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedCollateral = () => {
    if (!amount || parseFloat(amount) <= 0) return '0.00';
    
    // Примерные коэффициенты обеспечения для разных валют
    const collateralRatios: { [key: string]: number } = {
      'USDT': 110, // 110% для стейблкоина
      'ETH': 150,  // 150% для ETH
      'sepoliaETH': 150 // 150% для sepoliaETH
    };
    
    const ratio = collateralRatios[collateralCoin] || 150;
    const collateralNeeded = (parseFloat(amount) * ratio) / 100;
    
    return collateralNeeded.toFixed(4);
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

  const startRepeating = useCallback((action: () => void) => {
    clearTimers(); // Очищаем предыдущие таймеры
    action(); // Первое выполнение сразу
    
    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(action, 100);
    }, 500);
  }, [clearTimers]);

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
    <div className={styles.borrowTab}>
      <div className={`${styles.borrowForm} card`}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>
            <TrendingUp className={styles.titleIcon} />
            Займ под обеспечение
          </h2>
          <p className={styles.formSubtitle}>
            Получите мгновенный доступ к USDT под залог криптовалют
          </p>
        </div>

        <div className={styles.loanInfo}>
          <div className={styles.infoCard}>
            <Clock className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Срок займа</span>
              <span className={styles.infoValue}>{LOAN_DURATION} дней</span>
            </div>
          </div>
          <div className={styles.infoCard}>
            <Zap className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Получаемая валюта</span>
              <span className={styles.infoValue}>{BORROW_TOKEN}</span>
            </div>
          </div>
        </div>

        <div className={styles.collateralSection}>
          <label className={styles.collateralLabel}>
            <Shield className={styles.labelIcon} />
            Выберите обеспечение
          </label>
          <CurrencySelect
            currencies={CURRENCIES}
            selectedCurrency={collateralCoin}
            onCurrencyChange={setCollateralCoin}
            disabled={loading}
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.amountInput}>
            <label className={styles.inputLabel}>
              Сумма для получения
              <Info className={styles.infoIcon} />
            </label>
            <div className={styles.inputWrapper}>
              <button
                type="button"
                className={styles.decrementButton}
                onMouseDown={handleDecrementStart}
                onMouseUp={stopRepeating}
                onMouseLeave={stopRepeating}
                onTouchStart={handleDecrementStart}
                onTouchEnd={stopRepeating}
                disabled={loading || !amount || parseFloat(amount) <= 0}
                title="-1 (hold)"
              >
                <Minus className="icon" />
              </button>
              <input
                type='number'
                value={amount}
                onChange={handleAmountChange}
                placeholder='0.00'
                disabled={loading}
                className={styles.amountField}
                min="0"
                step="0.01"
              />
              <button
                type="button"
                className={styles.incrementButton}
                onMouseDown={handleIncrementStart}
                onMouseUp={stopRepeating}
                onMouseLeave={stopRepeating}
                onTouchStart={handleIncrementStart}
                onTouchEnd={stopRepeating}
                disabled={loading}
                title="+1 (hold)"
              >
                <Plus className="icon" />
              </button>
            </div>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className={styles.collateralEstimate}>
              <div className={styles.estimateHeader}>
                <Shield className={styles.estimateIcon} />
                <span>Необходимое обеспечение</span>
              </div>
              <div className={styles.estimateValue}>
                {calculateEstimatedCollateral()} {collateralCoin}
              </div>
              <div className={styles.estimateNote}>
                *Приблизительная оценка. Точная сумма будет рассчитана при выполнении транзакции.
              </div>
            </div>
          )}
        </div>

        <button
          className={styles.borrowButton}
          onClick={handleBorrow}
          disabled={!amount || parseFloat(amount) <= 0 || loading}
        >
          <Calculator className={styles.buttonIcon} />
          {loading ? 'Обработка транзакции...' : 'Взять займ'}
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
